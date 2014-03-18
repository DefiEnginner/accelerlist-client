import React, { Component, Fragment } from 'react';
import {
  Card, CardBody, CardDeck, CardTitle
} from 'reactstrap';
import CardBreakdownPopover from './CardBreakdownPopover';
import ProfitAnalyticsChart from './ProfitAnalyticsChart';
import styled from 'styled-components';
import { digitСonversion } from '../../../../../../helpers/utility';

const StyledMetricDeck = styled(CardDeck)`
  .card {
    text-align: center;
    cursor: pointer;

    &.result {
      border: 0;
      box-shadow: none;
      background: transparent;

      .card-footer {
        padding-top: 0;
        padding-bottom: 0;
        background-color: #fff;
        border: 0;
      }
    }
  }

  .value {
    display: block;
    font-size: 24px;
    font-weight: 600;
  }

  .title {
    display: block;
    text-transform: uppercase;
  }

  .equal {
    margin: 0 0  0 2em
    font-size: 24px;
  }
`;

class Summary extends Component {

  render() {
    const {
      data,
      dataByDate
    } = this.props;

    // console.log("DATA BY DATE:", dataByDate);

    return (
      <Fragment>
        <h3 className="h5 text-center">
          Profit Breakdown ({data.dateStart} - {data.dateEnd})
        </h3>
        <StyledMetricDeck className="mt-5 align-items-center">
          <CardBreakdownPopover
            data={data}
            type="grossIncome"
          />
          <CardBreakdownPopover
            data={data}
            type="cogs"
          />
          <CardBreakdownPopover
            data={data}
            type="expenses"
          />
          <span className="equal">=</span>
          <Card className="text-center result">
            <CardBody>
              <span className="value text-success">{digitСonversion(data.netProfit - data.miscExpenses, "currency", "USD")}</span>
              <span className="title">Net</span>
            </CardBody>
          </Card>
        </StyledMetricDeck>

        <Card className="mt-4">
          <CardBody>
            <CardTitle className="mb-4">Profit Analytics Chart</CardTitle>
            <ProfitAnalyticsChart data={dataByDate} roi={data.roi} dailyNetProfit={data.dailyNetProfit} />
          </CardBody>
        </Card>
      </Fragment>
    );
  }
}

export default Summary;
