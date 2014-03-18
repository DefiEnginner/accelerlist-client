import React, { Component, Fragment } from 'react';
import { 
  Card, CardBody, CardTitle
} from 'reactstrap';
import TableGenerator from '../../../../../../shared/components/TableGenerator';

class SupplierBreakdown extends Component {

  suppliersMapper = (option) => {
    return <Fragment>
        <td>{option.name}</td>
        <td className="text-success">${option.net_profit}</td>
        <td>${option.gross_income}</td>
        <td className="text-danger">-${Math.abs(option.total_expenses)}</td>
        <td>{option.roi}%</td>
    </Fragment>
  }

  render() {
    const headerTitles = [
      { name: "Supplier", value: "name" },
      { name: "Net Profit", value: "net_profit" },
      { name: "Gross Income", value: "gross_income" },
      { name: "Total Expenses", value: "total_expenses" },
      { name: "ROI", value: "roi" }
    ];

    const suppliers = [
      { name: "Supplier 1", net_profit: 750, gross_income: 1000, total_expenses: -250, roi: 25 },
      { name: "Supplier 2", net_profit: 2342, gross_income: 3865, total_expenses: -1734, roi: 33 },
      { name: "Supplier 3", net_profit: 1387, gross_income: 2746, total_expenses: -847, roi: 22 },
      { name: "Supplier 4", net_profit: 642, gross_income: 1847, total_expenses: -734, roi: 18 },
      { name: "Supplier 5", net_profit: 546, gross_income: 1887, total_expenses: -673, roi: 15 }
    ];

    return (
      <Card>
        <CardBody>
          <CardTitle className="text-center mb-5">Supplier Breakdown</CardTitle>
            <TableGenerator
              rootClassName="table table-striped acc-table acc-table-left mt-4"
              headerTitles={headerTitles}
              sortable={true}
              options={suppliers}
              optionMapper={this.suppliersMapper}
          />
        </CardBody>
      </Card>
    );
  }
}

export default SupplierBreakdown;