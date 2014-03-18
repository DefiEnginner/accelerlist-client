const templateSKUsMapping = {
  exp_date: "expDate",
  purchased_date: "purchasedDate",
  list_price: "price",
  buy_cost: "buyCost",
  asin: "asin",
  supplier: "supplier",
  scout: "scout",
  tax_code: "taxCode",
  condition: "condition",
  salesrank: "salesrank",
  sku_number: "skuNumber",
  "purchased_date_mmyy": "datePurchased",
  "purchased_date_mmddyy": "datePurchased",
  "exp_date_mmyy": "expDate",
  "exp_date_mmddyy": "expDate",
  "listing_date_mmddyy": "listing_date"
};

const conditionTemplateSKUMapping = {
  "NewItem": "N",
  "UsedLikeNew": "LN",
  "UsedVeryGood": "VG",
  "UsedGood": "G",
  "UsedAcceptable": "A",
  "CollectibleLikeNew": "LN",
  "CollectibleVeryGood": "VG",
  "CollectibleGood": "G",
  "CollectibleAcceptable": "A",
  "Refurbished": "R"
};

const conditionMappingForPrinterLabels = {
  "NewItem": "New",
  "UsedLikeNew": "Used - LN",
  "UsedVeryGood": "Used - VG",
  "UsedGood": "Used - G",
  "UsedAcceptable": "Used - A",
  "CollectibleLikeNew": "Collectible - LN",
  "CollectibleVeryGood": "Collectible - VG",
  "CollectibleGood": "Collectible - G",
  "CollectibleAcceptable": "Collectible - A",
  "Refurbished": "Refurbished",
  "Condition" : "Condition" // for print test
};

//_AWAITING_ASYNCHRONOUS_REPLY_ - The request is being processed, but is waiting for external information before it can complete.
//_CANCELLED_ - The request has been aborted due to a fatal error.
//_DONE_ - 	The request has been processed. You can call the GetFeedSubmissionResult operation to receive a processing report that describes which records in the feed were successful and which records generated errors.
//_IN_PROGRESS_ - The request is being processed.
//_IN_SAFETY_NET_ - The request is being processed, but the system has determined that there is a potential error with the feed (for example, the request will remove all inventory from a seller's account.) An Amazon seller support associate will contact the seller to confirm whether the feed should be processed.
//_SUBMITTED_ - The request has been received, but has not yet started processing.
//_UNCONFIRMED_ - The request is pending.
// http://docs.developer.amazonservices.com/en_US/feeds/Feeds_FeedProcessingStatus.html

const feedStatusMappingToFeedButtonStyle = {
  "_AWAITING_ASYNCHRONOUS_REPLY_": "warning",
  "_CANCELLED_": "danger",
  "_DONE_": "primary",
  "_IN_PROGRESS_": "warning",
  "_IN_SAFETY_NET_": "warning",
  "_SUBMITTED_": "warning",
  "_UNCONFIRMED_": "warning"
};

const feedStatusMappingToFeedButtonText = {
  "_AWAITING_ASYNCHRONOUS_REPLY_": "processing",
  "_CANCELLED_": "cancelled",
  "_DONE_": "view completed feed",
  "_IN_PROGRESS_": "processing",
  "_IN_SAFETY_NET_": "processing",
  "_SUBMITTED_": "processing",
  "_UNCONFIRMED_": "processing"
};

export {
  conditionTemplateSKUMapping,
  templateSKUsMapping,
  conditionMappingForPrinterLabels,
  feedStatusMappingToFeedButtonStyle,
  feedStatusMappingToFeedButtonText
};
