/**
*
* PickupForm
*
*/

import React from 'react';
import remove from 'lodash/remove';
import cloneDeep from 'lodash/cloneDeep';
import sumBy from 'lodash/sumBy';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


class BoxContentsTable extends React.Component {

    UNSAFE_componentWillMount(){
    this.setState({maxTankNumber: this.props.maxTankNumber})
  }

  onBeforeSaveCell = (row, cellName, cellValue) => {
    let tempBox = cloneDeep(this.props.box);
    let newBox = remove(tempBox, function(box) {
        return box.key !== row.key;
    });
    let sum = sumBy(newBox, 'value');
    if(Number(cellValue) < 0)
    {
        return false;
    }
    sum = Number(sum) + Number(cellValue);
    if(sum > this.props.totalQty)
    {
        return false;
    }
    this.props.handleChange('UnAssignedQuantity', this.props.totalQty - sum, this.props.ShipmentId);
    return true;
  }
  

  render() {
    const cellEditProp = {
        mode: 'click',
        beforeSaveCell: this.onBeforeSaveCell,
    };
    const { box } = this.props;
    return (
        <BootstrapTable
            data={box} 
            cellEdit={cellEditProp}
            exportCSV={false} 
            pagination={false}
            striped
            borderedr
            hover
        >
            <TableHeaderColumn width="50%" dataAlign="center" dataSort={false} dataField="key" editable={true} isKey={true}>BOX NUMBER</TableHeaderColumn>
            <TableHeaderColumn width="50%" dataAlign="center" dataSort={false} dataField="value" editable={true} >QUANTITY SHIPPED</TableHeaderColumn>
        </BootstrapTable>
    );
  }
}

BoxContentsTable.propTypes = {

};

export default BoxContentsTable;
