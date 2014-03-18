const ListPriceRuleOptions = [
  { key: 'price_rule_1', value: 'match_buy_box_price' , label: 'Match Buy Box Price'},
  { key: 'price_rule_2', value: 'price' , label: 'Price'},
  { key: 'price_rule_3', value: 'fixed_value' , label: 'Fixed Value'},
  { key: 'price_rule_4', value: 'own-price' , label: "I'll Set My Own Price"},
  { key: 'price_rule_5', value: 'lowest_fba_offer' , label: "Match Lowest FBA Offer"},
];

const ListPriceDirectionRuleOptions = [
    { key: 'price_direction_rule_1', value: 'higher_than_buy_box' , label: 'Higher Than Buy Box'},
    { key: 'price_direction_rule_2', value: 'lower_than_buy_box' , label: 'Lower Than Buy Box'},
    { key: 'price_direction_rule_3', value: 'roi' , label: 'ROI'},
    { key: 'price_direction_rule_4', value: 'profit_margin' , label: "Profit Margin"},
    { key: 'price_direction_rule_5', value: 'higher_than_lowest_FBA_offer' , label: 'Higher than lowest FBA offer'},
    { key: 'price_direction_rule_6', value: 'lower_than_lowest_FBA_offer' , label: 'Lower than lowest FBA offer'},
];

const ListBatchItemConditions = [
    { key: 'batch_item_condition_0', value: 'NoDefault' , label: 'NoDefault'},
    { key: 'batch_item_condition_1', value: 'UsedLikeNew' , label: 'UsedLikeNew'},
    { key: 'batch_item_condition_2', value: 'UsedVeryGood' , label: 'UsedVeryGood'},
    { key: 'batch_item_condition_3', value: 'UsedGood' , label: 'UsedGood'},
    { key: 'batch_item_condition_4', value: 'UsedAcceptable' , label: 'UsedAcceptable'},
    { key: 'batch_item_condition_5', value: 'CollectibleLikeNew' , label: 'CollectibleLikeNew'},
    { key: 'batch_item_condition_6', value: 'CollectibleVeryGood' , label: 'CollectibleVeryGood'},
    { key: 'batch_item_condition_7', value: 'CollectibleGood' , label: 'CollectibleGood'},
    { key: 'batch_item_condition_8', value: 'CollectibleAcceptable' , label: 'CollectibleAcceptable'},
    { key: 'batch_item_condition_9', value: 'NotUsed' , label: 'NotUsed'},
    { key: 'batch_item_condition_10', value: 'Refurbished:' , label: 'Refurbished'},
    { key: 'batch_item_condition_11', value: 'NewItem' , label: 'NewItem'},
];

export {
  ListPriceRuleOptions,
	ListPriceDirectionRuleOptions,
	ListBatchItemConditions,
};
