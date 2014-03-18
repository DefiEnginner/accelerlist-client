import moment from "moment";
import amazon_categories from "./amazon_categories";
import toUpper from "lodash/toUpper";
import QRious from "qrious";
import {
  conditionTemplateSKUMapping,
  templateSKUsMapping,
  conditionMappingForPrinterLabels
} from "./mapping_data";
import {
	momentDateToLocalFormatConversion,
	numberFormatterToK,
} from "../utility";

export function applyAdjustmentOnPrice(batchListingDefaults, price) {
  let adjustment;
  if(batchListingDefaults.priceRuleType === true) {
    adjustment = parseFloat(batchListingDefaults.listPriceRuleAmount);
  } else if (batchListingDefaults.priceRuleType === false) {
    adjustment = (parseFloat(price) * parseFloat(batchListingDefaults.listPriceRuleAmount)) / 100;
  }

  if(batchListingDefaults.priceRuleDirection === 'higher_than_buy_box') {
    return (parseFloat(price) + adjustment).toFixed(2);
  }
  else if(batchListingDefaults.priceRuleDirection === 'lower_than_buy_box') {
    return (parseFloat(price) - adjustment).toFixed(2);
  }
  if(batchListingDefaults.priceRuleDirection === 'higher_than_lowest_FBA_offer') {
    return (parseFloat(price) + adjustment).toFixed(2);
  }
  else if(batchListingDefaults.priceRuleDirection === 'lower_than_lowest_FBA_offer') {
    return (parseFloat(price) - adjustment).toFixed(2);
  }

  return batchListingDefaults.defaultListPrice;
}

export function calculateProfitMarginAndROIPrice(batchListingDefaults, currentWorkingListingData) {
  let {buyCost, totalFeeEstimate} = currentWorkingListingData;
  buyCost = parseFloat(buyCost);
  totalFeeEstimate = parseFloat(totalFeeEstimate);

  if(batchListingDefaults.priceRuleDirection === 'roi') {
    let roi = batchListingDefaults.listPriceRuleAmount;
    roi = parseFloat(roi);
    return calculateROIPrice(roi, buyCost, totalFeeEstimate);
  }
  else if(batchListingDefaults.priceRuleDirection === 'profit_margin') {
    let profitMargin = batchListingDefaults.listPriceRuleAmount;
    profitMargin = parseFloat(profitMargin);
    return calculateProfitMarginPrice(profitMargin, buyCost, totalFeeEstimate);
  }
}

export function getLowestFBAOffer(currentWorkingListingData) {
  if (currentWorkingListingData.pricingData &&
    currentWorkingListingData.pricingData.offers &&
    currentWorkingListingData.pricingData.offers.length > 0) {
      const { offers } = currentWorkingListingData.pricingData;
      const offersFBA = [];
      offers.forEach(el => {
        if (el.IsFulfilledByAmazon === "true") {
          offersFBA.push(Number(el.ListingPrice.Amount))
        }
      })
      if (offersFBA.length > 0) {
        return Math.min(...offersFBA);
      } else {
        return null;
      }
    } else {
      return null;
    }
}

function calculateROIPrice(roi, buyCost, totalFeeEstimate){
  let numerator = ((roi + 100.) * buyCost) + (100 * totalFeeEstimate);
  let denominator = 85;
  let price = numerator / denominator;
  return price.toFixed(2);
}

function calculateProfitMarginPrice(profitMargin, buyCost, totalFeeEstimate) {
  let price = 100. * (totalFeeEstimate + buyCost) / (85. - profitMargin);
  return price.toFixed(2);
}

export  function isValidBuyCost(buyCost) {
  let parsedBuyCost = parseFloat(buyCost);
  if(isNaN(parsedBuyCost) || parsedBuyCost <= 0) {
    return false;
  }
  return true;
}

export function getUsedOrNewPriceAccordingly(currentWorkingListingData) {
  const { asin, pricingData} = currentWorkingListingData;
  let usedPrice = null;
  let newPrice = null;

  if (!!pricingData &&
      !!pricingData.competitive_pricing &&
      !!pricingData.competitive_pricing[asin]) {
        const { new_buy_box, used_buy_box } = pricingData.competitive_pricing[asin];
          if (new_buy_box) {
            const landedPrice = parseFloat(new_buy_box.landed_price);
            newPrice = landedPrice;
          }
          if (used_buy_box) {
            const landedPrice = parseFloat(used_buy_box.landed_price);
            usedPrice = landedPrice;
          }
  }
  if (currentWorkingListingData.condition.startsWith("Used")) {
    return usedPrice;
  } else if (currentWorkingListingData.condition.startsWith("New")) {
    return newPrice;
  }
  return null;
}

export function generateBoxContents(
  fulfillmentCenters,
  shipmentIdToCurrentBoxMapping
) {
  let boxContents = {},
    currBoxNum = 1;

  let currBoxData;

  fulfillmentCenters.forEach(fulfillmentCenter => {
    currBoxData = {};
    let shipmentId = fulfillmentCenter.ShipmentId,
      quantityShipped = fulfillmentCenter.QuantityShipped;

    // Update number to be the current box if it is found in the mapping.
    currBoxNum = shipmentIdToCurrentBoxMapping[shipmentId] || currBoxNum;

    currBoxData[currBoxNum] = Number(quantityShipped);
    boxContents[shipmentId] = currBoxData;
  });
  return boxContents;
}

export function editBoxContents(
  boxContents,
  oldFulfillmentCenters,
  newFulfillmentCenters,
  shipmentIdToCurrentBoxMapping
) {
  boxContents = Object.assign({}, boxContents);
  let quantityByShipmentId = {};
  oldFulfillmentCenters.forEach(shipment => {
    quantityByShipmentId[shipment.ShipmentId] =
      Number(shipment.QuantityShipped) || 0;
  });

  newFulfillmentCenters.forEach(fc => {
    let shipmentId = fc.ShipmentId;
    let previousQuantityShipped = Number(quantityByShipmentId[shipmentId]) || 0;
    let quantityShipped = Number(fc.QuantityShipped) || 0;

    if (!boxContents[shipmentId]) {
      // In this case, a new shipment was created. Nothing tricky here, just look at what
      // the current box the user is on, and add all the quantity from the FC to that batch.
      // Nothing to adjust.
      boxContents[shipmentId] = {
        1: quantityShipped
      };
    } else {
      // OK Now there are two cases we need to handle. If quantity shipped was higher than the
      // previous amount, then we need to add items to the box contents automatically based
      // on what the current box is for that shipment ID.

      // If the quantity shipped was lower than previous amount, then we need to remove items
      // starting from the current box. If that doesn't work, we apply an algorithm where we
      // try removing from the most recently created box, until we've taken away enough qty.
      let diff = Math.abs(quantityShipped - previousQuantityShipped) || 0;
      let boxes = boxContents[shipmentId];
      let currentBox = shipmentIdToCurrentBoxMapping[shipmentId] || 1;
      if (quantityShipped > previousQuantityShipped) {
        boxes = addQuantityFromBox(boxes, currentBox, diff);
      } else if (quantityShipped < previousQuantityShipped) {
        boxes = removeQuantityFromBox(boxes, currentBox, diff);
      }
      boxContents[shipmentId] = boxes;
    }
  });
  return boxContents;
}

export function addQuantityFromBox(boxes, currentBox, diff) {
  // Add the extra amount to the current box
  boxes = Object.assign({}, boxes);
  let newQty;
  if (!boxes[currentBox]) {
    newQty = diff;
  } else {
    let currQty = Number(boxes[currentBox]) || 0;
    newQty = currQty + diff;
  }
  boxes[currentBox] = newQty;
  return boxes;
}

export function removeQuantityFromBox(boxes, currentBox, diff) {
  boxes = Object.assign({}, boxes);
  // start removing from current box. if theres more to remove, then
  // start at the latest box and work your way backwards
  let alreadyRemoved = 0;

  if (boxes[currentBox]) {
    let amountLeftToRemove = diff - alreadyRemoved;
    let amountInBox = boxes[currentBox] || 0;
    let amountToRemove = Math.min(amountLeftToRemove, amountInBox);
    boxes[currentBox] = boxes[currentBox] - amountToRemove;
    alreadyRemoved += amountToRemove;
  }

  let boxNumberToRemoveFrom = Object.keys(boxes).length;
  while (boxNumberToRemoveFrom >= 1 && alreadyRemoved < diff) {
    if (boxes[boxNumberToRemoveFrom]) {
      let amountLeftToRemove = diff - alreadyRemoved;
      let amountToRemove = Math.min(
        amountLeftToRemove,
        boxes[boxNumberToRemoveFrom] || 0
      );
      boxes[boxNumberToRemoveFrom] =
        boxes[boxNumberToRemoveFrom] - amountToRemove;
      alreadyRemoved += amountToRemove;
    }
    boxNumberToRemoveFrom = boxNumberToRemoveFrom - 1;
  }
  return boxes;
}

export function updateShipmentToBoxMapping(
  fulfillmentCenters,
  shipmentIdToCurrentBoxMapping,
  shipmentIdToBoxCountMapping
) {
  let updated = false;
  fulfillmentCenters.forEach(fulfillmentCenter => {
    let shipmentId = fulfillmentCenter.ShipmentId;
    if (!shipmentIdToCurrentBoxMapping[shipmentId]) {
      shipmentIdToCurrentBoxMapping[shipmentId] = 1;
      updated = true;
    }
    if (!shipmentIdToBoxCountMapping[shipmentId]) {
      shipmentIdToBoxCountMapping[shipmentId] = 1;
      updated = true;
    }
  });
  return updated;
}

export function constructExistingShipmentsFromListings(listings) {
  // First reverse it - because we always save it in the order of scanning (newest first)
  listings = listings.slice().reverse();

  let existingShipments = {},
    destinationCount = {};
  listings.forEach(listing => {
    listing.fulfillmentCenters.forEach(fulfillmentCenter => {
      if (existingShipments[fulfillmentCenter.ShipmentId]) {
        existingShipments[
          fulfillmentCenter.ShipmentId
        ].QuantityShipped += Number(fulfillmentCenter.QuantityShipped);
      } else {
        let destinationId = fulfillmentCenter.DestinationFulfillmentCenterId;
        if (destinationCount[destinationId]) {
          destinationCount[destinationId] += 1;
        } else {
          destinationCount[destinationId] = 1;
        }
        fulfillmentCenter.QuantityShipped = Number(
          fulfillmentCenter.QuantityShipped
        );
        existingShipments[fulfillmentCenter.ShipmentId] = Object.assign(
          {},
          fulfillmentCenter,
          {
            WarehouseLabel:
              fulfillmentCenter.DestinationFulfillmentCenterId +
              " #" +
              destinationCount[destinationId]
          }
        );
      }
    });
  });
  return Object.values(existingShipments);
}

export function generateTrackingSpreadsheetData(
  products,
  totalShippingCost,
  dateShipped
) {
  const headers = [
    "MSKU",
    "Source",
    "Date Code",
    "ASIN",
    "Cost Per Item",
    "List Price Per Item",
    "Sales Rank",
    "Quantity",
    "Condition",
    "Notes",
    "Date Listed",
    "Total Ship Cost",
    "Ship Cost Per Item",
    "Total Cost",
    "Total List Price"
  ]

  const totalItems = products.reduce((accumulator, element) => {
    return accumulator + element.qty;
  }, 0);

  let exportableData = products.map(product => {
    const totalListPrice = product.price * product.qty;
    const totalCost = product.buyCost * product.qty;
    const shippingCost = (totalShippingCost / totalItems) * product.qty;
    const shipCostPerItem = totalShippingCost / totalItems;
    return [
      product.sku,
      product.supplier,
      "",
      product.asin,
      product.buyCost,
      product.price,
      product.salesrank,
      product.qty,
      product.condition,
      product.note,
      dateShipped,
      shippingCost.toFixed(2),
      shipCostPerItem.toFixed(2),
      totalCost.toFixed(2),
      totalListPrice.toFixed(2)
    ];
  });

  return ({
    fields: headers,
    data: exportableData
  });
}

export function generateInventoryLoaderData(products, fulfillmentCenterId) {
  let headers = [
    "sku",
    "product-id",
    "product-id-type",
    "price",
    "minimum-seller-allowed-price",
    "maximum-seller-allowed-price",
    "item-condition",
    "quantity",
    "add-delete",
    "will-ship-internationally",
    "expedited-shipping",
    "standard-plus",
    "item-note",
    "fulfillment-center-id",
    "product-tax-code",
    "batteries_required",
    "merchant_shipping_group_name",
    "supplier_declared_dg_hz_regulation1",
    "supplier_declared_dg_hz_regulation2",
    "supplier_declared_dg_hz_regulation3",
    "supplier_declared_dg_hz_regulation4",
    "supplier_declared_dg_hz_regulation5"
  ];

  let rows = [];
  products.forEach(product => {
    let row = {
      sku: product.sku,
      price: product.price,
      batteries_required: "false",
      merchant_shipping_group_name: product.shippingTemplate,
      supplier_declared_dg_hz_regulation1: "not_applicable",
      supplier_declared_dg_hz_regulation2: "not_applicable",
      supplier_declared_dg_hz_regulation3: "not_applicable",
      supplier_declared_dg_hz_regulation4: "not_applicable",
      supplier_declared_dg_hz_regulation5: "not_applicable",
      "item-note": product.note,
      "product-id-type": "1",
      "minimum-seller-allowed-price": product.minPrice,
      "maximum-seller-allowed-price": product.maxPrice,
      "item-condition": getConditionMapping()[product.condition],
      "product-tax-code": product.taxCode,
      "product-id": product.asin
    };

    if (fulfillmentCenterId === "DEFAULT") {
      row.quantity = product.qty;
      row["fulfillment-center-id"] = "";
    } else {
      row["fulfillment-center-id"] = fulfillmentCenterId;
    }

    headers.forEach(header => {
      if (!row[header]) {
        row[header] = "";
      }
    });
    rows.push(row);
  });
  return rows;
}

export function generateBatchItemsSpreadsheetData(products, meta) {
  let headers = [
		'sku',
		'fnsku',
		'asin',
		'name',
		'price',
		'minimum-price',
		'maximum-price',
		'buy-cost',
		'total-fee-estimate',
		'qty',
		'sales-rank',
		'suplier',
		'prep-instructions',
		'tax-code',
		'shipping-template',
		'condition',
		'category',
		'date-created',
		'date-purchased',
		'date-exp',
		'note',
		'image',
  ];

  let rows = [];
  products.forEach(product => {
    let row = {
		sku: product.sku,
		fnsku: product.fnsku,
		asin: product.asin,
		name: product.name,
		price: product.price,
		'minimum-price': product.minPrice,
		'maximum-price': product.maxPrice,
		'buy-cost': product.buyCost,
		'total-fee-estimate': (parseFloat(product.totalFeeEstimate) + 0.15*parseFloat(product.price)).toFixed(2) || 0.0,
		qty: product.qty,
		'sales-rank': product.salesrank,
		suplier: product.suplier,
		'prep-instructions': product.prepInstructions,
		'tax-code': product.taxCode,
		'shipping-template': product.shippingTemplate,
		condition: product.condition,
		category: product.category,
		'date-created': product.created_at,
		'date-purchased': product.datePurchased,
		'date-exp': product.expDate,
		note: product.note,
		image: product.imageUrl
	}

    headers.forEach(header => {
      if (!row[header]) {
        row[header] = "";
      }
    });
    rows.push(row);
  });
  return rows;
}

export function getConditionMapping() {
  return {
    UsedLikeNew: "1",
    UsedVeryGood: "2",
    UsedGood: "3",
    UsedAcceptable: "4",
    CollectibleLikeNew: "5",
    CollectibleVeryGood: "6",
    CollectibleGood: "7",
    CollectibleAcceptable: "8",
    NotUsed: "9",
    Refurbished: "10",
    NewItem: "11"
  };
}

export function getReverseConditionMapping() {
  let reverse = {};
  let conditionMapping = getConditionMapping();
  Object.keys(conditionMapping).forEach(condition => {
    reverse[conditionMapping[condition]] = condition;
  });
  return reverse;
}

export function checkDataOfAddingBatchItem(currentWorkingListingData) {
  const {
    buyCost,
    qty,
    price,
    expDate,
    datePurchased,
    asin,
    sku,
	  skuPrefix,
	  condition
  } = currentWorkingListingData;
  if (
    (Number(buyCost) >= 0) &&
    (Number(qty) > 0) &&
    (Number(price) > 0) &&
    (moment(expDate).isValid() || expDate === "") &&
    (moment(datePurchased).isValid() || datePurchased === "") &&
    asin.length > 0 &&
	  (sku ? sku.length > 0 : skuPrefix && skuPrefix.length > 0) &&
	  condition !== ''
  ) {
    return true;
  } else {
    return false;
  }
}

export function mapListingDefaultFieldToBackendModel(fieldName) {
  let mapping = {
    "skuPrefix": "sku_prefix",
    "skuNumber": "sku_number",
    "buyCost": "buy_cost",
    "supplier": "supplier",
    "scout": "scout",
    "price": "list_price",
    "datePurchased": "date_purchased",
    "expDate": "exp_date",
    "qty": "quantity",
    "condition": "condition",
    "taxCode": "tax_code",
    "minPrice": "min_price",
    "maxPrice": "max_price",
    "noteCategory": "note_category",
    "noteSubcategory": "note_subcategory",
    "note": "note",
    "shouldUseCustomSkuTemplate": "should_use_custom_sku_template",
    "shippingTemplate": "shipping_template",
    "listPriceRuleAmount": "list_price_rule_amount",
    "priceRuleType": "price_rule_type",
    "priceRuleDirection": "price_rule_direction",
    "listPriceRuleType": "list_price_rule_type",
    "defaultListPrice": "default_list_price",
    "gradingOptions": "grading_options",
    "pricingOptions": "pricing_options",
    "keepaDateRange": "keepa_date_range",
	"showInNewTabAmazon": "show_in_new_tab_amazon",
	"showInNewTabEbay": "show_in_new_tab_ebay",
  }
  return mapping[fieldName];
}

export function getConditionOptions() {
  return [
    { value: "NewItem", label: "NewItem" },
    { value: "UsedLikeNew", label: "UsedLikeNew" },
    { value: "UsedVeryGood", label: "UsedVeryGood" },
    { value: "UsedGood", label: "UsedGood" },
    { value: "UsedAcceptable", label: "UsedAcceptable" },
    { value: "CollectibleLikeNew", label: "CollectibleLikeNew" },
    { value: "CollectibleVeryGood", label: "CollectibleVeryGood" },
    { value: "CollectibleGood", label: "CollectibleGood" },
    { value: "CollectibleAcceptable", label: "CollectibleAcceptable" },
    { value: "Refurbished", label: "Refurbished" }
  ];
}

export function getNewConditionOptions() {
  return [
    { label: "N", value: "NewItem", title: "New" },
    { label: "LN", value: "UsedLikeNew", title: "Used / Like New" },
    { label: "VG", value: "UsedVeryGood", title: "Used / Very Good" },
    { label: "G", value: "UsedGood", title: "Used / Good" },
    { label: "A", value: "UsedAcceptable", title: "Used / Acceptable" },
    { label: "R", value: "Refurbished", title: "Refurbished" },
    { label: "C-LN", value: "CollectibleLikeNew", title: "Collectible / Like New" },
    { label: "C-VG", value: "CollectibleVeryGood", title: "Collectible / Very Good" },
    { label: "C-G", value: "CollectibleGood", title: "Collectible / Good" },
    { label: "C-A", value: "CollectibleAcceptable", title: "Collectible / Acceptable" },
  ];
}

export function getCategoryOptions() {
  return amazon_categories.map(category => {
    return {
      label: category,
      value: category
    };
  });
}

export function generateBarcodeDataForBox(products, shipmentId, boxNumber) {
  let barcodeStr = "AMZN,PO:" + shipmentId;
  products.forEach(product => {
    let boxData = product.boxContents[shipmentId];
    if (!boxData || !boxData[boxNumber]) {
      return;
    }
    let quantityShipped = boxData[boxNumber];
    barcodeStr += ",ASIN:" + product.asin + ",QTY:" + quantityShipped;
    if (product.expDate) {
      barcodeStr += ",EXP:" + moment(product.expDate).format("YYMMDD");
    }
  });
  return barcodeStr;
}

export function printCodeForBox(frameName, qrText, boxWeight, shipmentName, boxNumber, unitsCount, warehouseName, showAlert) {
  try {
    window.frames[frameName].document.body.innerHTML = "";
    let canvas = document.createElement("canvas");
    canvas.setAttribute("style", "display: block; width: 500px;");
    let qr = new QRious({ level: "H", size: 500, element: canvas, value: qrText });
    if (showAlert && qr !== canvas.qrious) {
      showAlert("Error", "Unable to generate QR code");
      return
    }
    let header = document.createElement("div");
    let canvasContainer = document.createElement("div");
    let footer = document.createElement("div");

    let box_num = document.createElement("div");
    let warehouse_name  = document.createElement("div");
    let units_count = document.createElement("div");
    let shipment_name = document.createElement("div");
    let box_weight = document.createElement("div");

    header.setAttribute("style", "display: flex; margin: 20px;");
    canvasContainer.setAttribute("style", "display: flex; margin: 20px; justify-content: center;");
    footer.setAttribute("style", "display: flex; margin: 20px;");

    canvasContainer.appendChild(canvas);

    box_num.innerText = [
      `Box ${boxNumber}`
    ];
    box_num.setAttribute("style", "width: 30%; text-align: left; font-size: 30px; font-weight: bold;");
    header.appendChild(box_num);

    warehouse_name.innerText = [
      `Warehouse: ${warehouseName}`
    ];
    warehouse_name.setAttribute("style", "width: 40%; text-align: center; font-size: 30px; font-weight: bold;")
    header.appendChild(warehouse_name);

    units_count.innerText = [
      `${unitsCount} units shipped in box`
    ];
    units_count.setAttribute("style", "width: 30%; text-align: right; font-size: 30px; font-weight: bold;")
    header.appendChild(units_count);

    shipment_name.innerText = [
      shipmentName
    ];
    shipment_name.setAttribute("style", "width: 70%; text-align: left; font-size: 30px; font-weight: bold;")
    footer.appendChild(shipment_name);

    box_weight.innerText = [
      `Est Weight: ${boxWeight}`
    ];
    box_weight.setAttribute("style", "width: 30%; text-align: right; font-size: 30px; font-weight: bold;")
    footer.appendChild(box_weight);

    window.frames[frameName].document.body.appendChild(header);
    window.frames[frameName].document.body.appendChild(canvasContainer);
    window.frames[frameName].document.body.appendChild(footer);
    window.frames[frameName].window.focus();
    window.frames[frameName].window.print();
  } catch (error) {
    if (showAlert) {
      showAlert("Error", "Unable to generate QR code");
    }
  }
}

let boolConverter = val => {
  return !!val;
};

const parseInteger = val => {
  return Math.round(Number(val));
}

const fieldTransformers = {
  asin: {
    converter: String
  },
  sku: {
    converter: String
  },
  skuPrefix: {
    converter: String
  },
  skuNumber: {
    converter: parseInteger
  },
  buyCost: {
    converter: Number
  },
  supplier: {
    converter: String
  },
  scout: {
    converter: String
  },
  datePurchased: {
    converter: String
  },
  expDate: {
    converter: String
  },
  price: {
    converter: Number
  },
  qty: {
    converter: parseInteger
  },
  condition: {
    converter: String
  },
  note: {
    converter: String
  },
  taxCode: {
    converter: String
  },
  minPrice: {
    converter: Number
  },
  maxPrice: {
    converter: Number
  },
  fnsku: {
    converter: String
  },
  weight: {
    converter: Number
  },
  imageUrl: {
    converter: String
  },
  salesrank: {
    converter: parseInteger
  },
  name: {
    converter: String
  },
  isHoldingAreaListing: {
    converter: boolConverter
  },
  shouldUseCustomSkuTemplate: {
    converter: boolConverter
  },
  totalFeeEstimate: {
    converter: Number
  },
  itemWeight: {
    converter: Number
  },
  packageWeight: {
    converter: Number
  },
  keepaDateRange: {
    converter: Number
  },
  showInNewTabAmazon: {
    converter: boolConverter
  },
  showInNewTabEbay: {
    converter: boolConverter
  },

  /* Fields without type restrictions */
  searchResults: {},
  pricingData: {},
  prepInstructions: {},
  fulfillmentCenters: {},
  isGeneratedSku: {}, // this field is removed before making api calls,
  shippingTemplate: {},
};

const validListingFields = Object.keys(fieldTransformers);

export function convertListingField(fieldName, fieldValue) {
  if (
    !fieldTransformers[fieldName] ||
    !fieldTransformers[fieldName].converter
  ) {
    return fieldValue;
  }
  let converter = fieldTransformers[fieldName].converter;
  return converter(fieldValue);
}

export function serializeListing(listing) {
  listing = Object.assign({}, listing);
  Object.keys(listing).forEach(listingField => {
    if (validListingFields.indexOf(listingField) === -1) {
      delete listing[listingField];
    }
  });
  Object.keys(listing).forEach(key => {
    listing[key] = convertListingField(key, listing[key]);
  });
  return listing;
}

export function generateTemplatedSKU(listing) {
	/*
	 * this will end if SKU in format:
	 *	{count}-{pref}-{pref} or {pref}-{pref}-{count}
	 *	later on {count} will be replaced with skuNumber if needed
	 *	in private_batch/saga or public_batch/saga
	 */
	let sku_prefixes = listing.skuPrefix;
	if(!sku_prefixes || sku_prefixes === "null"){
		return listing.asin;
	}
	sku_prefixes = sku_prefixes.replace(/{/g, '');
	sku_prefixes = sku_prefixes.replace(/}/g, '');
	sku_prefixes = sku_prefixes.split('-');

	let skus_array = [];

	sku_prefixes.forEach((sku, i) => {
	if(sku.length > 2) {
		if(templateSKUsMapping[sku] === "datePurchased" ||
			templateSKUsMapping[sku] === "expDate" ||
			templateSKUsMapping[sku] === "listing_date") {
			if(templateSKUsMapping[sku] === "datePurchased") {
				let skuMapping = toUpper(sku.replace("purchased_date_",""));
				const PurchasedDate = moment(
					new Date(listing[templateSKUsMapping[sku]]))
					.format(skuMapping);
				if(PurchasedDate !== 'Invalid date'){
					skus_array.push(PurchasedDate);
				}
			} else if (templateSKUsMapping[sku] === "expDate") {
				let skuMapping = toUpper(sku.replace("exp_date_",""));
				const ExpDate = moment(
					new Date(listing[templateSKUsMapping[sku]]))
					.format(skuMapping);
				if(ExpDate !== 'Invalid date'){
					skus_array.push(ExpDate);
				}
			} else if (templateSKUsMapping[sku] === "listing_date") {
				let skuMapping = toUpper(sku.replace("listing_date_",""));
				const ListingDate = moment(new Date()).format(skuMapping);
				if(ListingDate !== 'Invalid date'){
					skus_array.push(ListingDate);
				}
			}
		} else if(templateSKUsMapping[sku] === "condition") {
			skus_array.push(conditionTemplateSKUMapping[listing[templateSKUsMapping[sku]]]);
		} else if(templateSKUsMapping[sku] === "salesrank") {
			skus_array.push(
				numberFormatterToK(listing[templateSKUsMapping[sku]], 1));
		} else if(templateSKUsMapping[sku] === 'skuNumber'){
			skus_array.push('{count}');
		} else if(templateSKUsMapping[sku] === "list_price") {
			skus_array.push(
				parseFloat(listing[templateSKUsMapping[sku]]).toFixed(2));
		} else if(templateSKUsMapping[sku] === "buy_cost") {
			skus_array.push(
				parseFloat(Math.round(listing[templateSKUsMapping[sku]]) * 100 / 100).toFixed(2));
		} else {
			if(sku in templateSKUsMapping){
				skus_array.push(listing[templateSKUsMapping[sku]]);
			} else {
				skus_array.push(sku);
			}
		}
    } else {
      skus_array.push(sku);
    }
  });
	skus_array = skus_array.filter(e => { return e !== '' });
	let skus = skus_array.join('-');
	if(skus){
		return skus;
	} else {
		return listing.asin;
	}
}

export function getBatchFieldsIncludedSKUTemplate(skuPrefix) {
  let sku_prefixes = skuPrefix.split("-");
  let skus = [];
  sku_prefixes.forEach(sku => {
    if(sku.length > 2 && sku[0] === '{' && sku[sku.length - 1] === '}') {
		if (skus.indexOf(templateSKUsMapping[sku.substring(1, sku.length -1)]) === -1
		 && templateSKUsMapping[sku.substring(1, sku.length -1)]) {
        skus.push(`${templateSKUsMapping[sku.substring(1, sku.length -1)]}`);
      }
    }
  });
  return skus;
}

export function getProductsBySku(products) {
  let productsBySku = {};
  products.forEach(product => {
    productsBySku[product.sku] = product;
  });
  return productsBySku;
}

export function setFocusToAmazonSearchBar() {
  let barcodeScanner = document.getElementById("barcode-scanner");
  if (barcodeScanner) {
    barcodeScanner.focus();
  }
}

export function skuNumberConversion(skuNumber) {
  const places = 3;
  const buffSkuNumber = Number(skuNumber);
  var zero = places - buffSkuNumber.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + buffSkuNumber;
}

export function checkPriceLimit(itemObject, listingDefaults) {
  const buffItemObject = Object.assign({}, itemObject);
  const { minPrice, maxPrice } = listingDefaults;

  if (Number(buffItemObject.price) > Number(buffItemObject.maxPrice)) {
    buffItemObject.maxPrice = buffItemObject.price;
  } else {
    buffItemObject.maxPrice = maxPrice;
  }

  if (Number(buffItemObject.minPrice) > Number(buffItemObject.price)) {
    buffItemObject.minPrice = buffItemObject.price;
  } else {
    buffItemObject.minPrice = minPrice;
  }
  return buffItemObject;
}

export function checkConditionIsUsedOrNew(condition) {
  if (!condition || (!condition.startsWith("Used") && !condition.startsWith("New"))) {
    return false;
  }
  return true;
}

export function checkNumberIsPositive(value) {
  if ( isNaN(value) || parseFloat(value) <= 0 ) {
    return false;
  }
  return true;
}

export function transformDataForPrinting(listing) {
  const listingItem = Object.assign({}, listing);
  listingItem.condition = conditionMappingForPrinterLabels[listing.condition];

  if (listingItem.expDate) {
    listingItem.expDate = momentDateToLocalFormatConversion(listingItem.expDate);
  } else {
    listingItem.expDate = "";
  }
  return listingItem;
}
