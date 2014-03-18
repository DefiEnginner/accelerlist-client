import Papa from 'papaparse'
import fileDownload from 'react-file-download'
import {
	generateStrandedItemsSpreadsheetData,
}  from '../../../../helpers/inventory/utility'

/**
 * export batch items csv
 *
 * @param {array} produts Items data set
 * @param {object} meta Batch meta data
 */
export const generateStrandedItemsFileExport = (products, meta) => {
  let exportableData = generateStrandedItemsSpreadsheetData(products, meta);
  let csv = Papa.unparse(JSON.stringify(exportableData) , {
    delimiter: ",",
    header: true,
    skipEmptyLines: false
  })
	fileDownload(csv, 'StrandedItemsSpreadsheet.csv');
}
