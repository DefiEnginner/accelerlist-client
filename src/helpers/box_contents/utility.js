// This function tries to see if the user input is an FNSKU or SKU. If so, then we
// must pull the ASIN because SKU/FNSKU is not an accepted user input type that can
// be properly detected on Amazon's catalog.
import Papa from "papaparse";
import fileDownload from "react-file-download";
import { skuNumberConversion } from "../batch/utility";
import {
  whoWillColumnMappingForExportFile,
  conditionColumnMappingForExportFile
} from "./mapping_data";

const convertBoxNumber = (boxNumber) => {
  return skuNumberConversion(boxNumber);
}

export const getASINForInput = (userInput, selectedShipmentsData) => {
  let asin;
  selectedShipmentsData.forEach(selectedShipmentData => {
    selectedShipmentData.inboundShipmentItems.forEach(item => {
      if (item.SellerSKU === userInput || item.FulfillmentNetworkSKU === userInput) {
        asin = item.ASIN;
      }
    });
    if (selectedShipmentData.inputToAsinListMapping && selectedShipmentData.inputToAsinListMapping[userInput]) {
      // Currently - only successfully handle the case where we found exactly ONE ASIN in the mapping
      // If there are multiple, then this is the unique case where a single shipment has multiple ASINs, where
      // the same input query maps to multiple different ASINs.
      // In all honestly this case is pretty crazy so we won't handle it using the cache, since
      // that might be buggy. Instead, we'll just use the regular flow to grab the live data.
      if (selectedShipmentData.inputToAsinListMapping[userInput].length === 1) {
        asin = selectedShipmentData.inputToAsinListMapping[userInput][0];
      }
    }
  });
  return asin;
}

export const getCachedSearchResult = (asin, selectedShipmentsData) => {
  for (let index = 0; index < selectedShipmentsData.length; index++) {
    const cachedResultDict = selectedShipmentsData[index].asinToSearchResultDataMapping;
    if (cachedResultDict[asin]) {
      return cachedResultDict[asin]
    }
  }
  return null;
}

export const getShipmentDataForSKU = (sku, selectedShipmentsData) => {
  let fnsku = getFNSKUForSKU(sku, selectedShipmentsData);
  let shipmentIds = getShipmentIdsForSKU(sku, selectedShipmentsData);
  return {
    "fnsku": fnsku,
    "shipmentIds": shipmentIds
  }
}

export const getShipmentIdsForSKU = (sku, selectedShipmentsData) => {
  let shipmentIds = [];
  selectedShipmentsData.forEach(selectedShipmentData => {
    let found = false;
    selectedShipmentData.inboundShipmentItems.forEach(item => {
      if (item.SellerSKU === sku) {
        found = true;
      }
    })
    if (found) {
      shipmentIds.push(selectedShipmentData.selectedShipment.ShipmentId);
    }
  });
  return shipmentIds.filter(result => !!result);
}

export const getFNSKUForSKU = (sku, selectedShipmentsData) => {
  let fnsku;
  selectedShipmentsData.forEach((selectedShipmentData) => {
    selectedShipmentData.inboundShipmentItems.forEach((item) => {
      if (item.SellerSKU === sku) {
        fnsku = item.FulfillmentNetworkSKU;
      }
    })
  });
  return fnsku;
}

export const generatePackListFileAndExport = (selectedShipmentData) => {
  const { selectedShipment, inboundShipmentItems, boxes } = selectedShipmentData;
  const additionalItemsData = selectedShipmentData.additionalData;
  const totalShipmentSKUs = inboundShipmentItems.length;
  let sortBoxes = boxes;
  sortBoxes.sort((a,b) => (a.box_number > b.box_number) ? 1 : ((b.box_number > a.box_number) ? -1 : 0));

  const totalShipmentUnits = inboundShipmentItems.reduce((acc, element) => {
    return acc + Number(element.QuantityShipped);
  }, 0);
   const shipmentData = [
    {
      col1: "Shipment ID",
      col2: selectedShipment.ShipmentId,
    },
    {
      col1: "Name",
      col2: selectedShipment.ShipmentName,
    },
    {
      col1: "Plan ID",
      col2: "--",
    },
    {
      col1: "Ship To",
      col2: selectedShipment.DestinationFulfillmentCenterId,
    },
    {
      col1: "Total SKUs",
      col2: totalShipmentSKUs,
    },
    {
      col1: "Total Units",
      col2: totalShipmentUnits,
    },
    {
      col1: "Pack list",
      col2: "1 of 1",
    }
  ]
  const tsvShipmentData = Papa.unparse(JSON.stringify(shipmentData), {
    delimiter: "\t",
    header: false,
    skipEmptyLines: false
  })
   let boxItemsHeaders = [
    "Merchant SKU",
    "Title",
    "ASIN",
    "FNSKU",
    "external-id",
    "Condition",
    "Who Will Prep?",
    "Prep Type",
    "Who Will Label?",
    "Shipped"
  ];
  sortBoxes.forEach(box => {
    boxItemsHeaders = boxItemsHeaders.concat([
      `${box.shipment_id}${convertBoxNumber(box.box_number)} - Unit Quantity`,
      `${box.shipment_id}${convertBoxNumber(box.box_number)} Expiration Date (mm/dd/yy)`
    ]);
  });
   let itemsInBoxes = [];
   sortBoxes.forEach(box => {
    box.items.forEach(boxItem => {
      const productExistInArray = itemsInBoxes.findIndex(product => product.SellerSKU === boxItem.SellerSKU);
      if (productExistInArray === -1) {
        itemsInBoxes.push(boxItem)
      }
    })
  });
	console.log(itemsInBoxes);
   const itemsRows = itemsInBoxes.map(item => {
    let shippedBoxInformationArray = [];
    sortBoxes.forEach(box => {
      const itemInBox = box.items.find(el => el.SellerSKU === item.SellerSKU);
      if (itemInBox) {
        shippedBoxInformationArray.push(
          itemInBox.QuantityShippedInBox,
          additionalItemsData && Object.keys(additionalItemsData).length > 0 && additionalItemsData[itemInBox.SellerSKU] && additionalItemsData[itemInBox.SellerSKU].exp_date.length > 0
            ? additionalItemsData[itemInBox.SellerSKU].exp_date
            : "Not Needed"
        )
      } else {
        shippedBoxInformationArray.push(
          "",
          "Not Needed"
        )
      }
    })

    const currentProductInformation = itemsInBoxes.find(el => el.SellerSKU === item.SellerSKU);
    const inboundShipmentItem = inboundShipmentItems.find(el => el.SellerSKU === item.SellerSKU);
    const itemCondition = additionalItemsData && Object.keys(additionalItemsData).length > 0 && additionalItemsData[item.SellerSKU] ? additionalItemsData[item.SellerSKU].condition : "N/A";
	let PrepDetails = null;
	let QuantityShipped = "--";
	if(inboundShipmentItem){
		PrepDetails = inboundShipmentItem.PrepDetailsList.PrepDetails;
		QuantityShipped = inboundShipmentItem.QuantityShipped;
	}

    let whoWillPrep = null;
    let prepType = null;
    let whoWillLabel = null;

    if (PrepDetails) {
      if (Array.isArray(PrepDetails)) {
        whoWillLabel = PrepDetails[0].PrepOwner.value;
        prepType =  PrepDetails[1].PrepInstruction.value;
        whoWillPrep = PrepDetails[1].PrepOwner.value;
      } else {
        if (!!PrepDetails.PrepOwner) {
          whoWillLabel = PrepDetails.PrepOwner.value;
        }
      }
    };

    let itemRow = [
        item.SellerSKU,
        currentProductInformation ? currentProductInformation.ProductSearchResult.name : "--",
        item.ASIN,
        item.FulfillmentNetworkSKU,
        `ASIN : ${item.ASIN}`,
        conditionColumnMappingForExportFile[itemCondition],
        whoWillPrep ? whoWillColumnMappingForExportFile[whoWillPrep] : "--",
        prepType ? prepType : "--",
        whoWillLabel ? whoWillColumnMappingForExportFile[whoWillLabel] : "--",
        QuantityShipped
      ];

    itemRow = itemRow.concat(shippedBoxInformationArray);
    return itemRow;
  });

  const tvsItemsData = Papa.unparse(JSON.stringify({
    fields: boxItemsHeaders,
    data: itemsRows
  }), {
    delimiter: "\t",
    header: true,
    skipEmptyLines: false
  })
   fileDownload(`${tsvShipmentData}\r\n\r\n${tvsItemsData}`, `Package-Information-${selectedShipment.ShipmentId}.tsv`);
}
