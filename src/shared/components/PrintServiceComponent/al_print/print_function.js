import { getLabelContent, getLabelContentZPL } from "./label_template";
import { labelsTypeList } from "../../../../helpers/print_service/labelsTypeList";
import qz from "qz-tray";
import printerDriverConfigPreset from "../../../../helpers/print_service/printer_driver_conf_AL";

export const alPrint = (printQueue, printerDefaults, clearPrintJobQueue, printJobSuccess, currentJobId, setCurrentJobId, onError) => {
  const isMac = navigator.platform.toUpperCase().match("MAC") ? true : false;

  if (!printerDefaults || !printerDefaults.printer_name || !printerDefaults.label_type || !printerDefaults.orientation) {
    onError(null, "Printer conf is not set!");
    clearPrintJobQueue();
    return;
  }
  
  if (
      printQueue.length > 0
      && (!printQueue[0].data.hasOwnProperty('fnsku') || !printQueue[0].data.fnsku)
    ) {
    onError(null, "FNSKU is missing, can't print!");
    clearPrintJobQueue();
    return;
  }

  if (printQueue.length > 0 && (printQueue[0].id !== currentJobId)) {
    setCurrentJobId(printQueue[0].id);
    const indexLabelFromList = labelsTypeList.findIndex(el => el.lableName === printerDefaults.label_type);
    const labelWidth = indexLabelFromList !== -1 ? labelsTypeList[indexLabelFromList].width : Number(printerDefaults.label_width);
    const labelHeight = indexLabelFromList !== -1 ? labelsTypeList[indexLabelFromList].height : Number(printerDefaults.label_height);
    const fontSizeCoefficient = printerDefaults.font_size_coefficient ? Number(printerDefaults.font_size_coefficient) : 0.9;
    const barCodeType = printerDefaults.barcode_type ? printerDefaults.barcode_type : "CODE39";
    const orientation = printerDefaults.orientation;
    const printerDriverConfigName = printerDefaults.printer_driver_config ? printerDefaults.printer_driver_config : "";
    const printerDriverConfig = printerDriverConfigPreset.hasOwnProperty(printerDriverConfigName)
      ? printerDriverConfigPreset[printerDriverConfigName]
      : null;

    const printerConfig = {
      orientation: orientation,
      copies: printQueue[0].copies,
      margins: {top: 0, right: 0, bottom: 0, left: 0},
      units: "in",
      scaleContent: true,
      rasterize: true,
      size: { 
        width: orientation === "portrait" ? labelWidth : labelHeight,
        height: orientation === "portrait" ? labelHeight : labelWidth,
      },
      interpolation: "nearest-neighbor",
      colorType: 'grayscale',
      density: printerDriverConfig && printerDriverConfig.density ? printerDriverConfig.density : [203, 300, 600],
      altPrinting: isMac,
    }
    let printData = [];
    
    switch(!!printerDriverConfig && !!printerDriverConfig.tag ? printerDriverConfig.tag : "") {
      case "zebra":
        printData = getLabelContentZPL(printQueue[0].data, {
          width: labelWidth,
          height: labelHeight,
          fontSizeCoefficient: fontSizeCoefficient,
          barCodeType: barCodeType,
          orientation: orientation,
          density: printerDriverConfig && printerDriverConfig.density ? printerDriverConfig.density : 203
        });
        break;

      default:
        printData = [{
          type: 'html',
          format: 'plain',
          data: getLabelContent(printQueue[0].data, {
            width: labelWidth,
            height: labelHeight,
            fontSizeCoefficient: fontSizeCoefficient,
            barCodeType: barCodeType,
            printerDriverConfig: printerDriverConfig,
            orientation: orientation
          }),
          options: {
            pageWidth: labelWidth,
            pageHeight: labelHeight,
            units: "in",
          },
        }]
        break;
    }
    const config = qz.configs.create(printerDefaults.printer_name, printerConfig);
    
    qz.print(config, printData).then(() => {
      printJobSuccess();
    }).catch((err) => {
      onError(err, "Error, cannot print. Check printer connection and configuration");
      clearPrintJobQueue();
    });
  }
}