/*
Box contents algorithm

Available input data:

let inboundShipmentPlans;
let searchResults;
let boxes;
let userInput;

Output is JSON structure that looks like this:
{
	error: None,
	shipmentId: "abc"
}

There are couple of edge cases:
Scenario 1: User needs to specify a sku out of a matchingSKUs list. the response looks like this:
{
	error: None,
	matchingSKUs: ["abc123", "def456"]
}

Scenario 2: User needs to specify an asin out of a matchingASINs list. the response looks like this:
{
	error: None,
	matchingASINs: ["abc123", "def456"]
}

In these scenarios, the expected UI is to open up a modal, and then force the user to pick a SKU out of
the matchingSKUs, or pick an ASIN out of the matchingASINs, depending on the output of the shipment suggestor
algorithm. After the selection has been made, the user clicks OK, and then the shipment suggestor algorithm
is called again using the selection as the new "userInput" field.

Shipment Chooser algorithm procedure:

Step 1: Pretend that the input is a SKU or FNSKU, and look for a matching shipment where the SKU qty
has not been fully accounted for across all the boxes for that shipment. If we found a matching
shipment that has unaccounted for quantity, then we return that shipment and terminate here.
If we could not find a shipment, proceed to step 2.

Step 2: Search Amazon for the product and check the returned search results. Once results are returned,
there are a few scenarios:

1) Multiple ASINs from search results match multiple ASINs in shipments where that ASIN has unaccounted for quantity.
	Use case: User enters a regular search input, pulls up multiple ASINs. Both those ASINs are found in the shipments created.
	Solution, force user to select one of the ASINs that match, and this case reduces into scenario 2.
2) One ASIN from search result matches exactly one ASIN in the shipments selected, and there's multiple SKU for that single ASIN.
3) One ASIN from search result matches exactly one ASIN in the shipments selected, and there's only one SKU for that single ASIN.
4) No ASINs from the search results match any of the ASINs found in the shipment.
*/

/*
Top Level suggestShipment algorithm to be called by redux saga
Note that there are two edge case here. If there are multiple matching asins,
then a user will be forced to specify an ASIN in the list provided before.
If there are multiple matching SKUs, then a user will be forced to specify a SKU.

After the user has specified the input,
There is one particular edge case where a user inputs an ASIN, and then they click ok
and this function gets triggered again, and then the user needs to specify a SKU,
and then this function gets triggered again, and only when the userInput=SKU this function
will succeed. So we have to be sure we can support that edge case on the UI.
*/
export const suggestShipment = (userInput, shipments, searchResults) => {
	console.log("THIS IS SHIPMENTS DS", shipments);
	// First, assume the user's input is a SKU or FNSKU. In that case there's a unique ID
	// that we can use to reconcile. In this case, just pick the first shipment that pops up.
	let suggestionResult = suggestShipmentAssumingInputIsSKUOrFNSKU(userInput, shipments);

	if (suggestionResult) {
		let {shipmentId, sku, asin} = suggestionResult;
		let selectedSearchResult = searchResults.find(result => result.ASIN === asin);
		return {
			error: null,
			shipmentId: shipmentId,
			selectedSKU: sku,
			selectedSearchResult: selectedSearchResult,
			assumedInputType: "sku_or_fnsku" // for debugging purposes
		};
	}

	// Still here? Ok that means the userInput wasn't SKU or FNSKU.
	let asinsWithShipmentsHavingUnaccountedForQty = getAsinsWithShipmentsHavingUnaccountedForQty(searchResults, shipments);
	if (asinsWithShipmentsHavingUnaccountedForQty.length > 1) {
		// force user to specify one of the ASINs here. This is special scenario so we can reduce this to case 2.
		return {
			error: "User needs to specify the ASIN.",
			matchingASINs: asinsWithShipmentsHavingUnaccountedForQty
		};
	} else if (asinsWithShipmentsHavingUnaccountedForQty <= 0) {
		// Either no corresponding SKUs were found or they were all accounted for.
		// Show user error.
		// @TODO: Do custom check here to see if a SKU was account found or not. Return a better
		// error message based on the result of that.
		let isFound = getAsinsThatIntersectSearchResultsAndInboundShipmentItems(searchResults, shipments).length > 0;
		if (!isFound) {
			return {
				error: "User input could not be matched with a product in the selected shipments."
			}
		} else {
			return {
				error: "All the quantities for this user input, and the selected shipments have been accounted for already."
			};
		}

	} else if (asinsWithShipmentsHavingUnaccountedForQty.length === 1) {
		let asin = asinsWithShipmentsHavingUnaccountedForQty[0];
		let selectedSearchResult = searchResults.find(result => result.ASIN === asin);
		let suggestionResult = suggestShipmentForASIN(asin, shipments);
		if (!suggestionResult) {
			let skus = getUniqueUnaccountedForSKUs(asin, shipments);
			if (skus.length > 1) {
				return {
					error: "User needs to specify a SKU or FNSKU.",
					matchingSKUs: skus,
					selectedSearchResult: selectedSearchResult,
					assumedInputType: "asin" // for debugging purposes
				}
			}
			return {
				error: "Unexpected error. Unable to choose a shipment."
			}

		}
		let {shipmentId, sku} = suggestionResult;
		return {
			error: null,
			shipmentId: shipmentId,
			selectedSKU: sku,
			selectedSearchResult: selectedSearchResult,
			assumedInputType: "asin" // for debugging purposes
		};
	}
}

let computeQuantityInAllBoxes = (sku, boxes) => {
	let boxQuantities = boxes.map(box => {
		return box.items.reduce((acc, item) => {
			if (item.SellerSKU === sku) {
				return acc + item.QuantityShippedInBox;
			}
			return acc;
		}, 0)
	})
	return boxQuantities.reduce((acc, qty) => {
		return acc + qty;
	}, 0)
}

let findSKUsWithUnaccountedForQuantityInShipment = (asin, shipment) => {
	let skus = [];
	let items = shipment.inboundShipmentItems;
	items.forEach(item => {
		if (item.ASIN === asin) {
			let sku = item.SellerSKU;
			let quantityShipped = item.QuantityShipped;
			if (quantityShipped > computeQuantityInAllBoxes(sku, shipment.boxes)) {
				skus.push(sku);
			}
		}
	})
	return skus;
}

let getUniqueUnaccountedForSKUs = (asin, shipments) => {
	// Get the unique SKUs discovered across all the shipments
	let unaccountedForSKUsLists = [];
	shipments.forEach(shipment => {
		unaccountedForSKUsLists.push(findSKUsWithUnaccountedForQuantityInShipment(asin, shipment))
	});
	let uniqueUnaccountedForSKUs = Array.from(new Set(unaccountedForSKUsLists.reduce((currList, skuList) => {
		return currList.concat(skuList);
	}, [])));
	return uniqueUnaccountedForSKUs;
}

let getShipmentIdsWithUnaccountedForSKUsLists = (asin, shipments) => {
	let shipmentIdsWithUnaccountedForSKUsLists = shipments.map(shipment => {
			if (findSKUsWithUnaccountedForQuantityInShipment(asin, shipment).length > 0) {
				return shipment.selectedShipment.ShipmentId;
			} else {
				return null;
			}
		}
	).filter(shipmentId => !!shipmentId);
	return shipmentIdsWithUnaccountedForSKUsLists;
}

let suggestShipmentForASIN = (asin, shipments) => {
	let uniqueUnaccountedForSKUs = getUniqueUnaccountedForSKUs(asin, shipments);
	console.log("SKUS: ", uniqueUnaccountedForSKUs);

	// Only suggest a shipment if there was exactly 1 SKU found. In that case, choose the first shipment
	// we found, where this single unique SKU was found.
	if (uniqueUnaccountedForSKUs.length === 1) {
		let shipmentIdsWithUnaccountedForSKUsLists = getShipmentIdsWithUnaccountedForSKUsLists(asin, shipments);
		return {
			shipmentId: shipmentIdsWithUnaccountedForSKUsLists[0],
			sku: uniqueUnaccountedForSKUs[0]
		};
	}
	return null;
}

let suggestShipmentAssumingInputIsSKUOrFNSKU = (userInput, shipments) => {
	for (let c=0; c<shipments.length; c++) {
		let shipment = shipments[c];
		for (let d=0; d<shipment.inboundShipmentItems.length; d++) {
			let item = shipment.inboundShipmentItems[d];
			if (item.SellerSKU === userInput || item.FulfillmentNetworkSKU === userInput) {
				let sku = item.SellerSKU;
				let quantityShipped = item.QuantityShipped;
				console.log("Quantity shipped and in box", quantityShipped, computeQuantityInAllBoxes(sku, shipment.boxes))
				if (quantityShipped > computeQuantityInAllBoxes(sku, shipment.boxes)) {
					return {
						shipmentId: shipment.selectedShipment.ShipmentId,
						sku: sku,
						asin: item.ASIN
					};
				}
			}
		}
	}
}

let getAsinsWithShipmentsHavingUnaccountedForQty = (searchResults, shipments) => {
	let asinsWithShipmentsHavingUnaccountedForQty = searchResults.map(result => {
		let asin = result.ASIN;
		let unaccountedForSKUsLists = [];
		shipments.forEach((shipment) => {
			unaccountedForSKUsLists.push(findSKUsWithUnaccountedForQuantityInShipment(asin, shipment));
		});
		let numShipmentsWithUnaccountedForSkus = unaccountedForSKUsLists.filter(
			skusList => skusList.length > 0
		).length;
		return numShipmentsWithUnaccountedForSkus > 0 ? asin : null;
	}).filter(asin => !!asin);
	return asinsWithShipmentsHavingUnaccountedForQty;
}


let getAsinsThatIntersectSearchResultsAndInboundShipmentItems = (searchResults, shipments) => {
	let asinsThatIntersectSearchResultsAndInboundShipmentItems = searchResults.map(result => {
		let asin = result.ASIN;
		let found = false;
		shipments.forEach((shipment) => {
			shipment.inboundShipmentItems.forEach(item => {
				if (item.ASIN === asin) {
					found = true;
				}
			})
		});
		return found ? asin : null;
	}).filter(asin => !!asin);
	return asinsThatIntersectSearchResultsAndInboundShipmentItems;
}
