const isMac = navigator.platform.toUpperCase().match("MAC") ? true : false;
export const labelsTypeList = [
  {
    lableName: "Dymo 30336 | 1 x 2.125",
    width: 2.125,
    height: 1,
    orientation: "landscape",
    fontSizeCoefficient: 0.8,
    barcode_type : "CODE39"
  },
  {
    lableName: "Dymo 30334 | 1.25 x 2.25",
    width: 2.25,
    height: 1.25,
    orientation: isMac ? "landscape" : "portrait",
    fontSizeCoefficient: 0.8,
    barcode_type : "CODE39"
  },
  {
    lableName: "Dymo 30252 | 1.125 x 3.5",
    width: 3.5,
    height: 1.125,
    orientation: "landscape",
    fontSizeCoefficient: 0.9,
    barcode_type : "CODE39"
  },
  {
    lableName: "Dymo 99012 | 1.4 x 3.5",
    width: 3.5,
    height: 1.4,
    orientation: "landscape",
    fontSizeCoefficient: 0.9,
    barcode_type : "CODE39"
  },
  {
    lableName: "Zebra | 2.25 x 1.25",
    width: 2.25,
    height: 1.25,
    orientation: "portrait",
    fontSizeCoefficient: 0.8,
    barcode_type : "CODE39"
  },
  {
    lableName: "Zebra | 3 x 1",
    width: 3,
    height: 1,
    orientation: "portrait",
    fontSizeCoefficient: 0.9,
    barcode_type : "CODE39"
  },
];