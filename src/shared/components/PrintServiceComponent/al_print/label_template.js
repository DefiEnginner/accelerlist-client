import { convertInToPixels } from "../../../../helpers/utility";
import { transformDataForPrinting } from "../../../../helpers/batch/utility";
import { getDestination, getAdditionalInfo } from "../../../../helpers/print_service/utility";
import JsBarcode from "jsbarcode";

export const getLabelContent = (listing, labelConf) => {
  let container = document.createElement("div");
  let additionalInfo = "";
  const transformListing = transformDataForPrinting(listing);

  additionalInfo = getAdditionalInfo([
    transformListing.condition,
    getDestination(transformListing.fulfillmentCenters),
    transformListing.expDate ? `EXP : ${transformListing.expDate}` : ""
  ]);

  const labelWidth = labelConf && labelConf.width ? Number(labelConf.width) : 2;
  const labelHeight = labelConf && labelConf.height ? Number(labelConf.height) : 1;
  const transformScale = labelConf.printerDriverConfig ? labelConf.printerDriverConfig.transform_scale : "1";

  const labelFontSizeCoefficient = labelConf && labelConf.fontSizeCoefficient
    ? (((1 - Number(labelConf.fontSizeCoefficient)) * 2) + Number(labelConf.fontSizeCoefficient)) : 1;
  const labelBarCodeType = labelConf && labelConf.barCodeType ? labelConf.barCodeType : "CODE39";
  const labelBarcodeWidthCoof = labelBarCodeType === "CODE128" ? 150 : 200; 
  const labelBarCodeFontSize = (labelHeight * 72) / (6 * labelFontSizeCoefficient);
  const labelBarcodeHeight = convertInToPixels(labelHeight / 4);
  const labelBarcodeWidth = Math.trunc(convertInToPixels(labelWidth) / labelBarcodeWidthCoof) || 1;

  const labelBody = `
    <div class="label-container">
      <div class="label-fnsku">
        ${textToBarcode(transformListing.fnsku, labelBarCodeType, labelBarCodeFontSize, labelBarcodeHeight, labelBarcodeWidth)}
      </div>
      <div class="label-name-container">
        <div class="label-name">
          ${transformListing.name}
        </div>
      </div>
      <div class="label-additionalInfo">
        ${additionalInfo}
      </div>
    </div>`;

  container = `
    <html>
      <head>
        <style>
          .label-body {
            margin: 0;
          }
          .label-container {
            width: ${convertInToPixels(labelWidth)}px;
            height: ${convertInToPixels(labelHeight)}px;
            position: relative;
            display: flex;
            flex-direction: column;
            transform: scale(${labelConf.orientation === "portrait" ? transformScale + ",1" : "1," + transformScale});
            transform-origin: ${labelConf.orientation === "portrait" ? "left" : "bottom"};
          }
          .label-name-container {
            height: ${convertInToPixels(labelHeight) - (labelBarcodeHeight + 14 + labelBarCodeFontSize) - (convertInToPixels(labelHeight / (10 * labelFontSizeCoefficient)) + 6)}px;
            display: flex;
            align-items: center;
          }
          .label-fnsku {
            border-top: 5px solid transparent;
            font-family: Arial, sans-serif;
            font-size: ${convertInToPixels(labelHeight / (10 * labelFontSizeCoefficient))}px;
            text-align: center;
          }
          .label-name {
            font-family: Arial, sans-serif;
            font-size: ${convertInToPixels(labelHeight / (10 * labelFontSizeCoefficient))}px;
            text-align: center;
            display: -webkit-box;
            line-height: 1.5em;
            max-height: 3em;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-left: 6mm;
            margin-right: 6mm;
          }
          .label-additionalInfo {
            border-top: 1px solid transparent;
            font-weight: bold;
            font-family: Arial, sans-serif;
            font-size: ${convertInToPixels(labelHeight / (10 * labelFontSizeCoefficient))}px;
            line-height: ${convertInToPixels(labelHeight / (10 * labelFontSizeCoefficient))}px;
            text-align: center;
            position: absolute;
            width: 100%;
            bottom: 5px;
          }
        </style>
      </head>
      <body class="label-body">
        ${labelBody}
      </body>
    </html>`;  
    //console.log(container) 
  return container;
}

export const getLabelContentZPL = (listing, labelConf) => {
  const transformListing = transformDataForPrinting(listing);
  const density = labelConf.density;
  const orientation = labelConf.orientation ? labelConf.orientation : "portrait";
  const widthInDots =  labelConf.height && density ? Math.round(Number(labelConf.width) * Number(density), 10) : 0;
  const heightInDots = labelConf.height && density ? Math.round(Number(labelConf.height) * Number(density), 10) : 0;
  const barcodeType = labelConf.barCodeType ? labelConf.barCodeType : "CODE39";
  const fontHeight = Math.round((heightInDots / 9) * Number(labelConf.fontSizeCoefficient), 10);
  const fontWidth = Math.round((fontHeight / 5) * 4.5, 10);
  const name = transformListing.name && transformListing.name.length > 120 ? `${transformListing.name.slice(0, 120)}...` : transformListing.name;

  let barcodeCommandType = "^B3";
  let barcodeWidth = 0;
  let barcodeSymbolWidth = 0;
  let barcodeSymbolCount = 0;
  let barcodeWidthCoof = 0;

  switch(barcodeType) {
    case "CODE39":
      barcodeCommandType = "^B3";
      barcodeSymbolWidth = 16;
      barcodeSymbolCount = transformListing.fnsku.length + 2;
      barcodeWidthCoof = Math.trunc((widthInDots / barcodeSymbolCount + 2) / barcodeSymbolWidth);
      barcodeWidth = String(transformListing.fnsku) ? (barcodeSymbolCount * (barcodeWidthCoof * barcodeSymbolWidth)) : 0;
    break;

    case "CODE128":
      const barcodeSystemSymbolsWidth = 18;
      barcodeCommandType = "^BC";
      barcodeSymbolWidth = 11;
      barcodeSymbolCount = transformListing.fnsku.length;
      barcodeWidthCoof = Math.trunc(widthInDots / (((barcodeSymbolCount + 2) * barcodeSymbolWidth) + (barcodeSystemSymbolsWidth * 2)));
      barcodeWidth = String(transformListing.fnsku) 
        ? ((barcodeSymbolCount * barcodeSymbolWidth) * barcodeWidthCoof) + ((barcodeSystemSymbolsWidth * 2) * barcodeWidthCoof)
        : 0;
    break;

    default:
      barcodeCommandType = "^B3";
      barcodeSymbolWidth = 16;
      barcodeSymbolCount = transformListing.fnsku.length + 2;
      barcodeWidthCoof = Math.trunc((widthInDots / barcodeSymbolCount + 2) / barcodeSymbolWidth);
      barcodeWidth = String(transformListing.fnsku) ? (barcodeSymbolCount * (barcodeWidthCoof * barcodeSymbolWidth)) : 0;
    break;
  }

  
  const additionalInfo = getAdditionalInfo([
    transformListing.condition,
    getDestination(transformListing.fulfillmentCenters),
    transformListing.expDate ? `EXP : ${transformListing.expDate}` : ""
  ]);

  let labelZPL = [];

  switch(orientation) {
    case "portrait":
      labelZPL = [
        '^XA\n',
        '^PR3,3,3\n',
        '^FS\n',
        `^PW${widthInDots}\n`,
        '^FWN\n',
        `^BY${barcodeWidthCoof},3,${Math.round(heightInDots / 3, 10)}\n`,
        `^FO${Math.round(((widthInDots - barcodeWidth) / 2), 10)},10${barcodeCommandType}^FD${transformListing.fnsku}\n`,
        '^FS\n',
        `^A0,${fontHeight},${fontWidth}\n`,
        `^FO10,${Math.round((heightInDots / 3 ) + (10 * barcodeWidthCoof) + 20, 10)}\n`,
        `^TBN,${widthInDots - 20},${fontHeight * 2}\n`,
        `^FD${transformListing.name}\n`,
        '^FS\n',
        `^A0,${fontHeight},${fontWidth}\n`,
        `^FO10,${heightInDots - fontWidth - 20}\n`,
        `^FB${widthInDots - 20},1,,C\n`,
        `^FD${additionalInfo}\n`,
        '^FS\n',
        '^XZ\n',
        ];
    break;

    case "landscape":
      labelZPL = [
        '^XA\n',
        '^PR1,2,2\n',
        `^PW${heightInDots}\n`,
        '^FWB\n',
        `^BY${barcodeWidthCoof},3,${Math.round(heightInDots / 3, 10)}\n`,
        `^FO10,${Math.round(((widthInDots - barcodeWidth) / 2), 10)}${barcodeCommandType}^FD${transformListing.fnsku}\n`,
        '^FS\n',
        `^A0,${fontHeight},${fontWidth}\n`,
        `^FO${Math.round((heightInDots / 3 ) + (10 * barcodeWidthCoof) + 20, 10)},10\n`,
        `^FB${widthInDots - 20},3,,C\n`,
        `^FD${name}\n`,
        '^FS\n',
        `^A0,${fontHeight},${fontWidth}\n`,
        `^FO${heightInDots - fontWidth - 20},10\n`,
        `^FB${widthInDots - 20},1,,C\n`,
        `^FD${additionalInfo}\n`,
        '^FS\n',
        '^XZ\n',
        ];
    break;

    default:
      labelZPL = [
        '^XA\n',
        '^FS\n',
        `^PW${widthInDots}\n`,
        `^BY${barcodeWidthCoof},3,${Math.round(heightInDots / 3, 10)}\n`,
        `^FO${Math.round(((widthInDots - barcodeWidth) / 2), 10)},10${barcodeCommandType}^FD${transformListing.fnsku}\n`,
        '^FS\n',
        `^A0,${fontHeight},${fontWidth}\n`,
        `^FO10,${Math.round((heightInDots / 3 ) + (10 * barcodeWidthCoof) + 20, 10)}\n`,
        `^TBN,${widthInDots - 20},${fontHeight * 2}\n`,
        `^FD${transformListing.name}\n`,
        '^FS\n',
        `^A0,${fontHeight},${fontWidth}\n`,
        `^FO10,${heightInDots - fontWidth - 20}\n`,
        `^FB${widthInDots - 20},1,,C\n`,
        `^FD${additionalInfo}\n`,
        '^FS\n',
        '^XZ\n',
        ];
    break;
  };

  return labelZPL;
}

const textToBarcode = (text, barCodeType, fontSize, barcodeHeight, barcodeWidth) => {
  let canvas = document.createElementNS("http://www.w3.org/2000/svg","svg");

  JsBarcode(canvas, text, {
    format: barCodeType || "CODE39",
    width: barcodeWidth,
    height: barcodeHeight,
    fontSize: fontSize,
    fontOptions: "bold",
    textMargin: 1,
    margin: 1,
  });

  return canvas.outerHTML;
}