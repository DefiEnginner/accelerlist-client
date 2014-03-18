export function getConditionMappingInventoryPrintLabels(fieldName) {
  const conditionMappingInventoryPrintLabels = {
    "1": "UsedLikeNew",
    "2": "UsedVeryGood",
    "3": "UsedGood",
    "4": "UsedAcceptable",
    "5": "CollectibleLikeNew",
    "6": "CollectibleVeryGood",
    "7": "CollectibleGood",
    "8": "CollectibleAcceptable",
    "9": "NotUsed",
    "10": "Refurbished",
    "11": "NewItem"
  };
  if (conditionMappingInventoryPrintLabels[fieldName]) {
    return conditionMappingInventoryPrintLabels[fieldName];
  }
  return "";
}


export function generateStrandedItemsSpreadsheetData(products, meta) {
  let headers = [
		'marketplace',
		'seller sku',
		'primary action',
		'date stranded',
		'date classified as unsellable',
		'status primary',
		'status secondary',
		'error message',
		'stranded reason',
		'asin',
		'sku',
		'fnsku',
		'product name',
		'condition',
		'fulfilled by',
		'fulfillable qty',
		'your price',
		'unfulfillable qty',
		'reserved quantity',
		'inbound shipped qty',
  ];

  let rows = [];
  products.forEach(product => {
    let row = {
		"seller sku": product.seller_sku,
		marketplace: product.marketplace_id,
		"primary action": product.primary_action,
		"date stranded": product.date_stranded,
		"date_classified as unsellable": product.date_classified_as_unsellable,
		"status primary": product.status_primary,
		"status secondary": product.status_secondary,
		"error message": product.error_message,
		"stranded reason": product.stranded_reason,
		asin: product.asin,
		sku: product.sku,
		fnsku: product.fnsku,
		"product name": product.product_name,
		condition: product.condition,
		"fulfilled by": product.fulfilled_by,
		"fulfillable qty": product.fulfillable_qty,
		"your price": product.your_price,
		"unfulfillable qty": product.unfulfillable_qty,
		"reserved quantity": product.reserved_quantity,
		"inbound shipped qty": product.inbound_shipped_qty,
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
