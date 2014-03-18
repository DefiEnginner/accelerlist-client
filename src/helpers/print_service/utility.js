export function getZebraPrinters() {
  if (!window.jsPrintSetup) {
    return null;
  }
  return (window.jsPrintSetup.getPrintersList() || "")
    .split(",")
    .filter(printer => {
      return printer.toLowerCase().indexOf("zebra") > -1;
    })
    .map(printer => {
      return {
        name: printer,
        isConnected: true
      };
    });
};

export function getDymoPrinters() {
  if (
    !window.dymo ||
    !window.dymo.label ||
    !window.dymo.label.framework ||
    !window.dymo.label.framework.getPrinters
  ) {
    return null;
  }
  return window.dymo.label.framework.getPrinters();
};

export function getDestination(fulfillmentCenters) {
  if (fulfillmentCenters && fulfillmentCenters.length === 1) {
    return fulfillmentCenters[0].DestinationFulfillmentCenterId;
  }
  return "";
};

export function getAdditionalInfo(additionalInfoArray) {
  let addStrind = "";

  additionalInfoArray.forEach(data => {
    if (data) {
      addStrind ? addStrind += ` | ${data}` : addStrind += `${data}`
    }
  })
  return addStrind;
}

export const testPrintLabel = {
  fnsku: "X010Y3IFZP",
  name: "Test product Test product Test product Test product Test product Test product Test product Test product Test product Test product ",
  condition: "CollectibleVeryGood",
  expDate: "2019-01-01",
  fulfillmentCenters: [
    {
      DestinationFulfillmentCenterId: "EWQX"
    }
  ]
}