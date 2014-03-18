import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Card, CardBody, CardFooter,
  Table
} from 'reactstrap';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import styled from 'styled-components';
import { digitСonversion } from '../../../../../../../helpers/utility';

const StyledPopover = styled(Popover)`
  min-width: 300px;

  .arrow {
    margin: 0 -0.76rem;
  }

  .table {
    td {
      padding-top: 8px;
      padding-bottom: 8px;
    }

    tr:first-child td {
      border-top: 0;
    }
`;

class CardBreakdownPopover extends Component {
  constructor(props) {
    super(props);

    this.state = {
      popoverOpen: false
    }
  }

  togglePopover = () => {
    this.setState({ popoverOpen: !this.state.popoverOpen });
  }

  formatNumber(value) {
    return digitСonversion(value, "currency", "USD");
  }

  render() {
    const {
      data,
      type,
    } = this.props;

    let title, value, popoverContent;

    const GrossIncome = () => (
      <Table className="table-striped acc-table acc-table-left">
        <tbody>
          <tr>
            <td>Total FBA Sales</td>
            <td className="text-success">{this.formatNumber(data.fbaOrderRevenue)}</td>
          </tr>
          <tr>
            <td>Total MF Sales</td>
            <td>{this.formatNumber(data.mfOrderRevenue)}</td>
          </tr>
          <tr>
            <td>Total Refund</td>
            <td className="text-danger">{this.formatNumber(data.totalRefundCost)}</td>
          </tr>
          <tr>
            <td>Total Inventory Credits</td>
            <td className="text-danger">{this.formatNumber(data.totalInventoryCredits)}</td>
          </tr>
          <tr>
            <td>Total Misc. Income</td>
            <td className="text-success">{this.formatNumber(data.totalMiscellaneous)}</td>
          </tr>
        </tbody>
      </Table>
    );

    const Cogs = () => (
      <Table className="table-striped acc-table acc-table-left">
        <tbody>
          <tr>
            <td>Cost of Good Delivered</td>
            <td>{this.formatNumber(data.costOfGoodsDelivered)}</td>
          </tr>
          <tr>
            <td>Cost of Good Adjusted</td>
            <td>{this.formatNumber(data.costOfGoodsAdjusted)}</td>
          </tr>
          <tr>
            <td>Cost of Good Refunded</td>
            <td>{this.formatNumber(data.costOfGoodsReturned)}</td>
          </tr>
        </tbody>
      </Table>
    );

    const Expenses = () => (
      <Table className="table-striped acc-table acc-table-left">
        <tbody>
          <tr>
            <td>Total Transaction Fees</td>
            <td className="text-danger">{this.formatNumber(data.totalTransactionFees)}</td>
          </tr>
          <tr>
            <td>Total Selling Fees</td>
            <td className="text-danger">{this.formatNumber(data.totalSellingFees)}</td>
          </tr>
          <tr>
            <td>Total Services Fees</td>
            <td className="text-danger">{this.formatNumber(data.totalServiceFees)}</td>
          </tr>
          <tr>
            <td>Total Shipping Fees</td>
            <td className="text-danger">{this.formatNumber(data.totalShippingFees)}</td>
          </tr>
          <tr>
            <td>Total Inventory Fees</td>
            <td className="text-danger">{this.formatNumber(data.totalInventoryFees)}</td>
          </tr>
          <tr>
            <td>Guarantee Claims Total</td>
            <td>{this.formatNumber(data.guaranteeClaimsTotal)}</td>
          </tr>
          <tr>
            <td>Chargebacks Total</td>
            <td>{this.formatNumber(data.chargebackTotal)}</td>
          </tr>
          <tr>
            <td>Misc Expenses</td>
            <td>{this.formatNumber(data.miscExpenses)}</td>
          </tr>
        </tbody>
      </Table>
    );

    if(type === 'grossIncome' ) {
      title = 'Income';
      value = this.formatNumber(data.grossIncome);
      popoverContent = <GrossIncome />;
    } else if(type === 'cogs') {
      title = 'COGS';
      value = this.formatNumber(data.cogs);
      popoverContent = <Cogs />;
    } else if(type === 'expenses') {
      title = 'Fees & Expenses';
      value = this.formatNumber(data.totalExpensesWithoutCogs - data.miscExpenses);
      popoverContent = <Expenses />;
    }

    return (
      <Fragment>
        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="bottom"
          overlay={
            <StyledPopover title={`${title} Breakdown`} id="breakdown-popover">
              {popoverContent}
            </StyledPopover>
          }
        >
          <Card>
            <CardBody>
              <span className={`value ${(type === 'cogs' || type === 'expenses') ? 'text-danger' : 'text-success'}`}>{value}</span>
            </CardBody>
            <CardFooter>
              <span className="title">{title}</span>
            </CardFooter>
          </Card>
        </OverlayTrigger>

      </Fragment>
    );
  }

}

CardBreakdownPopover.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
};

export default CardBreakdownPopover;
