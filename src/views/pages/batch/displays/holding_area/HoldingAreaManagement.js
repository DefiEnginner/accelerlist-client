import React from "react";
import BalanceScale from "react-icons/lib/fa/balance-scale";
import Truck from "react-icons/lib/fa/truck";

const getObjectProperty = (obj, property) => {
  return property
    .split(".")
    .reduce((currentObj, key) => (currentObj && currentObj[key]) || null, obj);
};

const sumOf = (list, key) => {
  return list
    .map(item => {
      return parseFloat(getObjectProperty(item, key) || "0");
    })
    .reduce((a, b) => a + b, 0);
};

const groupByFulfillmentCenter = holdings => {
  const groupedHoldings = holdings.reduce((result, holding) => {
    (result[holding.last_fulfillment_center_id] =
      result[holding.last_fulfillment_center_id] || []).push(holding);
    return result;
  }, {});
  return Object.keys(groupedHoldings).map(fulfillmentCenterId => {
    return {
      quantity: sumOf(groupedHoldings[fulfillmentCenterId], "qty").toFixed(0),
      weight: sumOf(
        groupedHoldings[fulfillmentCenterId],
        "itemDimensions.Weight"
      ).toFixed(2),
      last_fulfillment_center_id: fulfillmentCenterId
    };
  });
};

const HoldingAreaManagement = ({ holdings, loadingHoldings }) => {
  if (loadingHoldings || !holdings) {
    return <div>Loading Holdings...</div>;
  }

  return (
    <div className="holding-area-mgmt holding-common">
      <h3>Holding Area Management</h3>
      <div className="shipment-list">
        {groupByFulfillmentCenter(holdings).map((shipment, idx) => {
          return (
            <div className="shipment" key={"shpmt-" + idx}>
              <div className="code-container">
                <span className="code">
                  <span className="top" />
                  <span className="main">
                    {shipment.last_fulfillment_center_id}
                  </span>
                </span>
              </div>
              <div className="stat">
                <Truck size="28" />
                <span>{shipment.quantity}</span>
              </div>
              <div className="stat">
                <BalanceScale size="28" />
                <span>{shipment.weight} lbs</span>
              </div>
              <div className="button green">Create Shipment</div>
              <div className="button purple">Print all labels</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HoldingAreaManagement;
