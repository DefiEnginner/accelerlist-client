import React from "react";
import { connect } from "react-redux";
import { Table, Popover, PopoverHeader, PopoverBody } from "reactstrap";
import PropTypes from "prop-types";
import { digitСonversion } from "../../../../..//helpers/utility";

const ProfitPopover = props => {
  let {
    batchNetProfit,
    batchListPrice,
    batchBuyCost,
    batchFees,
    batchRoi,
    batchProfitMargin,
    toggleProfitPopover,
    profitPopoverOpen,
    internationalization_config
  } = props;

  let batchNetProfitCell;

  if (batchNetProfit === 0) {
    batchNetProfitCell = (
      <td>
        {digitСonversion(
          batchNetProfit,
          "currency",
          internationalization_config.currency_code
        )}
      </td>
    );
  } else if (batchNetProfit > 0) {
    batchNetProfitCell = (
      <td className="text-success">
        {digitСonversion(
          batchNetProfit,
          "currency",
          internationalization_config.currency_code
        )}
      </td>
    );
  } else {
    batchNetProfitCell = (
      <td className="text-danger">
        {digitСonversion(
          batchNetProfit,
          "currency",
          internationalization_config.currency_code
        )}
      </td>
    );
  }
  return (
    <div>
      <h4>
        <a href="#a" id="profitPopover" onClick={toggleProfitPopover}>
          {digitСonversion(
            batchNetProfit,
            "currency",
            internationalization_config.currency_code
          )}
        </a>
      </h4>
      <p>NET PROFIT</p>
      <Popover
        placement="bottom"
        isOpen={profitPopoverOpen}
        target="profitPopover"
        toggle={toggleProfitPopover}
      >
        <PopoverHeader>Profit Breakdown</PopoverHeader>
        <PopoverBody>
          <Table className="text-right">
            <tbody>
              <tr>
                <td className="no-borders text-left">
                  <strong>List Price:</strong>
                </td>
                <td className="no-borders">
                  {digitСonversion(
                    batchListPrice,
                    "currency",
                    internationalization_config.currency_code
                  )}
                </td>
              </tr>
              <tr>
                <td className="no-borders text-left">
                  <strong>Buy Cost:</strong>
                </td>
                <td className="no-borders">
                  {digitСonversion(
                    batchBuyCost,
                    "currency",
                    internationalization_config.currency_code
                  )}
                </td>
              </tr>
              <tr>
                <td className="no-borders text-left">
                  <strong>Est. Fees:</strong>
                </td>
                <td className="no-borders">
                  {digitСonversion(
                    batchFees,
                    "currency",
                    internationalization_config.currency_code
                  )}
                </td>
              </tr>
              <tr>
                <td className=" text-left">
                  <strong>Net Profit:</strong>
                </td>
                {batchNetProfitCell}
              </tr>
              <tr>
                <td className="no-borders text-left">
                  <strong>ROI / Profit Margin:</strong>
                </td>
                <td className="no-borders">
                  {digitСonversion(batchRoi, "percent")} /{" "}
                  {digitСonversion(batchProfitMargin, "percent")}
                </td>
              </tr>
            </tbody>
          </Table>
        </PopoverBody>
      </Popover>
    </div>
  );
};

ProfitPopover.propTypes = {
  batchNetProfit: PropTypes.number.isRequired,
  batchListPrice: PropTypes.number.isRequired,
  batchBuyCost: PropTypes.number.isRequired,
  batchFees: PropTypes.number.isRequired,
  batchRoi: PropTypes.string.isRequired,
  batchProfitMargin: PropTypes.string.isRequired,
  toggleProfitPopover: PropTypes.func.isRequired,
  profitPopoverOpen: PropTypes.bool.isRequired
};

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  {}
)(ProfitPopover);
