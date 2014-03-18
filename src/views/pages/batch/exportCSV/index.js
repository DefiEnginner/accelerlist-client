import Papa from 'papaparse'
import fileDownload from 'react-file-download'
import {
	generateInventoryLoaderData,
	generateTrackingSpreadsheetData,
	generateBatchItemsSpreadsheetData,
}  from '../../../../helpers/batch/utility'

import {
	sanitize_filename
}  from '../../../../helpers/utility'

export const generateTrackingSpreadsheetAndExport = (products, totalShippingCost, dateShipped, batch_name) => {
  let exportableData = generateTrackingSpreadsheetData(products, totalShippingCost, dateShipped)
  const csv = Papa.unparse(JSON.stringify(exportableData) , {
    delimiter: ",",
    header: true,
    skipEmptyLines: false
  });
  let fn = 'TrackingSpreadsheet '+ batch_name  +'.csv'
  fn = sanitize_filename(fn, '_', true);
  fileDownload(csv, fn);
}

export const generateInventoryLoaderFileAndExport = (products, fulfillmentCenterId) => {
  let exportableData = generateInventoryLoaderData(products, fulfillmentCenterId)
  let tsv = Papa.unparse(JSON.stringify(exportableData), {
    delimiter: "\t",
    header: true,
    skipEmptyLines: false
  })
  fileDownload(tsv, 'InventoryLoaderFile.tsv')
}

/**
 * export batch items csv
 *
 * @param {array} produts Items data set
 * @param {object} meta Batch meta data
 */
export const generateBatchItemsFileExport = (products, meta) => {
  let exportableData = generateBatchItemsSpreadsheetData(products, meta);
  let csv = Papa.unparse(JSON.stringify(exportableData) , {
    delimiter: ",",
    header: true,
    skipEmptyLines: false
  })
	// create header
	let header = Papa.unparse(JSON.stringify([
			['BATCH', meta.batchName],
			['BATCH ID:', meta.id],
			['Date Created', meta.created_at],
			['Date Updated', meta.updated_at],
			['Type', meta.workflowType],
			[],[],
		]),
		{
			delimiter: ",",
		    skipEmptyLines: false
		}
	)

	csv = header + csv;
	fileDownload(csv, 'BatchItemsSpreadsheet.csv');
}
