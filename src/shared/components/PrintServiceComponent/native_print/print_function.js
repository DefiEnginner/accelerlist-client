import JsBarcode from "jsbarcode";
import { logError } from "../../../../helpers/utility";
import labelTemplate30252 from "./30252_template.label";
import labelTemplate30334 from "./30334_template.label";
import labelTemplate30336 from "./30336_template.label";
import { transformDataForPrinting } from "../../../../helpers/batch/utility";
import { getDestination, getAdditionalInfo } from "../../../../helpers/print_service/utility";

export const nativePrint = (printQueue, printerDefaults, clearPrintJobQueue, printJobSuccess, currentJobId, setCurrentJobId, onError) => {

  if (!printerDefaults || !printerDefaults.printer_name) {
    onError(null, "You have not selected a printer! Please update your printer settings.");
    clearPrintJobQueue();
    return;
  }

  if (printQueue.length > 0 && (printQueue[0].id !== currentJobId)) {
    setCurrentJobId(printQueue[0].id);

    const isMac = navigator.platform.toUpperCase().match("MAC") ? true : false;
    const qty = printQueue[0].copies;
    const printListing = transformDataForPrinting(printQueue[0].data);
    let queue = [];

    if (isMac && printerDefaults.manufacturer === "Zebra") {
      for (let index = 0; index < qty; index++) {
        queue.push({
          listing: printListing,
          qty: 1
        });
      }
    } else {
      queue.push({
        listing: printListing,
        qty,
      });
    }

    if (printerDefaults.manufacturer === "Dymo") {
      try {
        const { listing, qty } = queue[0];
        let additionalInfo = "";

        additionalInfo = getAdditionalInfo([
          listing.condition,
          getDestination(listing.fulfillmentCenters),
          listing.expDate ? `EXP : ${listing.expDate}` : ""
        ]);

        let label = null,
        labelType = null;
        if (printerDefaults.label_type === "30252") {
            labelType = labelTemplate30252;
        } else if (printerDefaults.label_type === "30334") {
            labelType = labelTemplate30334;
        } else if (printerDefaults.label_type === "30336") {
            labelType = labelTemplate30336;
        }

        if (labelType) {
          label = window.dymo.label.framework.openLabelXml(labelType);
        }
        if (label) {
          let printParamsXml = window.dymo.label.framework.createLabelWriterPrintParamsXml(
            {
              printQuality: "Text"
            }
          );
          let labelSet = new window.dymo.label.framework.LabelSetBuilder();
          if (printerDefaults.printer_name) {
            for (let d = 0; d < qty; d++) {
              let record = labelSet.addRecord();
              record.setText("BARCODE", listing.fnsku);
              record.setText(
                "TITLE",
                formatName(listing.name, printerDefaults.label_type)
              );
              record.setText("ADDITIONAL_INFO", additionalInfo);
            }
            label.printAsync(
              printerDefaults.printer_name,
              printParamsXml,
              labelSet
            );
            printJobSuccess();
          }
        }
      } catch (error) {
        clearPrintJobQueue();
        onError(error, "Error, cannot print. Check printer connection and configuration")
      } 
    }


    if (printerDefaults.manufacturer === "Zebra") {
      if (!window.jsPrintSetup) {
        // alert("Firefox required");
        return;
      }
      if (isMac) {
        queue.forEach(el => {
          try {
            const { listing, qty } = el;
            let additionalInfo = "";

            additionalInfo = getAdditionalInfo([
              listing.condition,
              getDestination(listing.fulfillmentCenters),
              listing.expDate ? `EXP : ${listing.expDate}` : ""
            ]);

            printZebra(listing, additionalInfo, qty);
          } catch (error) {
            clearPrintJobQueue();
            logError(error, {
              tags: {
                exceptionType: "Printer"
              }
            });
          }
        })
      } else {
        try {
          const { listing, qty } = queue[0];
          let additionalInfo = "";

          additionalInfo = getAdditionalInfo([
            listing.condition,
            getDestination(listing.fulfillmentCenters),
            listing.expDate ? `EXP : ${listing.expDate}` : ""
          ]);

          printZebra(listing, additionalInfo, qty);
        } catch (error) {
          clearPrintJobQueue();
          onError(error, "Error, cannot print. Check printer connection and configuration")
        }
      }
      printJobSuccess();
    }
  }
}

const getLabelContent = (listing, additionalInfo) => {
  return `
    <div style="padding-left: 20px;border-top: 3px solid transparent;font-family: Arial, sans-serif;font-size: medium;">
      ${listing.fnsku}
    </div>
    <div style="padding-left: 20px;border-top: 3px solid transparent;font-family: Arial, sans-serif;font-size: medium;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">
      ${formatName(listing.name)}
    </div>
    <div style="padding-left: 20px;border-top: 3px solid transparent;font-family: Arial, sans-serif;font-size: medium;">
      ${additionalInfo}
    </div>`;
};

const formatName = (name, labelType) => {
  if (!name) {
    return "";
  } else {
    if (labelType && labelType === "30336") {
      if (name.length > 27) {
        return `${name.slice(0, 27)}...`;
      }
    } else {
      if (name.length > 45) {
        return `${name.slice(0, 45)}...`;
      };
    }
    return name;
  } 
};

const printZebra = (listing, additionalInfo, qty) => {
  window.frames["print_helper"].document.body.innerHTML = "";
  let container = document.createElement("div");
  let center = document.createElement("center");
  let code = document.createElement("canvas");

  let labelContent = getLabelContent(listing, additionalInfo);
  JsBarcode(code, listing.fnsku, {
    displayValue: false,
    width: 2,
    height: 37,
    marginTop: 9,
    marginBottom: 6,
    marginLeft: 20,
    marginRight: 25
  });
  center.appendChild(code);
  container.innerHTML = labelContent;
  container.insertBefore(center, container.firstChild);
  window.frames["print_helper"].document.body.appendChild(container);
  window.jsPrintSetup.setOption("numCopies", qty);
  window.jsPrintSetup.clearSilentPrint();
  window.jsPrintSetup.setSilentPrint(true);
  window.jsPrintSetup.printWindow(window.frames["print_helper"]);
}
