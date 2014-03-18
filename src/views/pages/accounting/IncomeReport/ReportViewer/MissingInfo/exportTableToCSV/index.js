import Papa from "papaparse"
import fileDownload from "react-file-download"

export const exportMissingInfoTable = (tableData) => {
    const headers = [
      "SellerSKU",
      "Cost/Unit",
      "Supplier",
      "Date Purchased"
    ];

    let exportableData = tableData.map(row => {
      return [
        row.sku,
        row.buy_cost,
        row.supplier,
        ""
      ];
    });
  
  const csv = Papa.unparse(
    JSON.stringify({
      fields: headers,
      data: exportableData
    }) , {
      delimiter: ",",
      header: true,
      skipEmptyLines: false
    })
  fileDownload(csv, "spreadsheet.csv");
}