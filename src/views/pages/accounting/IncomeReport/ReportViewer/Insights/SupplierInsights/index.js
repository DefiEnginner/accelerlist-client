import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { 
  Row, Col,
  Card, CardBody, CardTitle
} from 'reactstrap';
import {PieChart, Pie, ResponsiveContainer, Tooltip} from 'recharts';
import styled from 'styled-components';
import { digitСonversion } from '../../../../../../../helpers/utility';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

const StyledSummary = styled.div`
  ol {
    padding-left: 1em;
  }

  p {
    margin-top: 1em;
    font-size: 18px;
  }
`;

class SupplierInsights extends Component {

  formatNumber = (value) => {
    return digitСonversion(value, "currency", "USD");
  }

  formatPercent = (value) => {
    return digitСonversion(value, "percent");
  }

  sortByIncome = (a,b) => {
    if (a.grossIncome < b.grossIncome) {
      return 1;
    } else if (a.grossIncome > b.grossIncome) {
      return -1;
    }
    return 0;
  }

  totalIncome = (data) => {
    let total = 0;
    data.forEach(item => {
      total += item.grossIncome;
    });
    
    return total;
  }

  render() {
    const {
      dataBySupplier,
      from,
      to
    } = this.props;

    // chart 
    let data = [];

    for(let key of Object.keys(dataBySupplier)) {
      let item = dataBySupplier[key];
      item.name = key;
      data.push(item);
    }

    // top suppliers
    let sortedByIncome = data.slice(0).sort(this.sortByIncome);
    let totalIncome = this.totalIncome(sortedByIncome);
    sortedByIncome.forEach((item,idx) => {
      item = Object.assign({
        "incomePercentage": (item.grossIncome/totalIncome)*100
      }, item);
      
      sortedByIncome[idx] = item;
    });

    // table
    const tableColumns = [
      { dataField: 'name', text: 'Supplier' },
      { dataField: 'netProfit', text: 'Net Profit' },
      { dataField: 'grossIncome', text: 'Gross Income' },
      { dataField: 'totalExpenses', text: 'Total Expenses' },
      { dataField: 'roi', text: 'ROI' }
    ];

    let tableData = [];
    data.forEach(item => {
      tableData.push({
        netProfit: this.formatNumber(item.netProfit),
        grossIncome: this.formatNumber(item.grossIncome),
        totalExpenses: this.formatNumber(item.totalExpenses),
        roi: this.formatPercent(item.roi),
        name: item.name
      });
    });

    return (
      <Fragment>
        <Card className="mb-4">
          <CardBody>
            <CardTitle className="text-center mb-5">Supplier Insights ({from} - {to})</CardTitle>
            <Row>
              <Col md="4">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie 
                      data={data} 
                      dataKey="grossIncome" 
                      fill="#82ca9d"
                      innerRadius={40} 
                    />
                    <Tooltip formatter={this.formatNumber} />} />
                  </PieChart>
                </ResponsiveContainer>
              </Col>
              <Col md="8">
                <StyledSummary>
                  <h4 className="h5">Top Suppliers</h4>
                  <ol>
                  {
                    // top 5 suppliers
                    sortedByIncome.slice(0, 4).map((item, idx) => {
                      return (<li key={idx}>{item.name} ({this.formatPercent(item.incomePercentage)})</li>);
                    })
                  }
                  </ol>

                  <p><strong>{sortedByIncome[0].name}</strong> is your biggest supplier, generating <span className="text-success font-weight-bold">
                    {this.formatNumber(sortedByIncome[0].grossIncome)} {" "}
                    ({this.formatPercent(sortedByIncome[0].incomePercentage)})</span> income during this time period.
                  </p>
                </StyledSummary>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <BootstrapTable
              data={tableData}
              keyField="name"
              columns={tableColumns}
              classes="acc-table acc-table-left"
              sriped
              hover
              pagination={paginationFactory({
                paginationSize: 10,
                sizePerPage: 20,
                sizePerPageList: [20, 50, 100]
              })}
            />
          </CardBody>
        </Card>


      </Fragment>
    );
  }
}

SupplierInsights.propTypes = {
  dataBySupplier: PropTypes.object.isRequired
}

export default SupplierInsights;