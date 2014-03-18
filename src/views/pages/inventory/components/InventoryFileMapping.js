import React, { Component, Fragment } from 'react';
import {
  Row,
  Button
} from 'reactstrap'

import Select from "react-select";
import PropTypes from 'prop-types'

class InventoryFileMapping extends Component {
    state = {
        seller_sku: '',
        cost: '',
        supplier: '',
        date_purchased: '',
        error: false
    }

    submit = () => {
        if(!!this.state.seller_sku && !!this.state.cost) {
            this.setState({error: false});
            let mapping = {
                "seller_sku": this.state.seller_sku,
                "buy_cost": this.state.cost,
                "supplier": this.state.supplier,
                "date_purchased": this.state.date_purchased
            };
            let data = {
                mapping: JSON.stringify(mapping),
                file: this.props.file
            };
            this.props.uploadInventoryItemsFile(data);
            this.props.updateLoadingFlag(true);
            this.props.close();
            this.setState({
                seller_sku: '',
                cost: '',
                supplier: '',
                date_purchased: '',
                error: false
            });
        }
        else {
            this.setState({error: true});
        }
    }
  
  render() {
    const { close, options } = this.props;
    return (
        <Fragment>
            <Row className="m-2 mt-5" style={{justifyContent: 'left'}}>
                    <span className="col-md-3"><strong>SellerSKU</strong></span>
                    <Select
                        className="col-md-4"
                        name="seller_sku"
                        value={this.state.seller_sku||""}
                        options={options}
                        onChange={(option) => this.setState({'seller_sku': !!option ? option.value : ''})}
                    />
            </Row>
            <Row className="m-2" style={{justifyContent: 'left'}}>
                    <span className="col-md-3"><strong>Cost/Unit</strong></span>
                    <Select
                        className="col-md-4"
                        name="cost"
                        value={this.state.cost||""}
                        options={options}
                        onChange={(option) => this.setState({'cost': !!option ? option.value : ''})}
                    />
            </Row>
            <Row className="m-2" style={{justifyContent: 'left'}}>
                    <span className="col-md-3"><strong>Supplier</strong></span>
                    <Select
                        className="col-md-4"
                        name="supplier"
                        value={this.state.supplier||""}
                        options={options}
                        onChange={(option) => this.setState({'supplier': !!option ? option.value : ''})}
                    />
            </Row>
            <Row className="m-2" style={{justifyContent: 'left'}}>
                    <span className="col-md-3"><strong>Date Purchased</strong></span>
                    <Select
                        className="col-md-4"
                        name="date_purchased"
                        value={this.state.date_purchased||""}
                        options={options}
                        onChange={(option) => this.setState({'date_purchased': !!option ? option.value : ''})}
                    />
            </Row>
            {
                !!this.state.error &&
                <Row style={{justifyContent: 'center'}}>
                    <span style={ {color: 'red'}}><strong>Please Provide mappings for the CSV!</strong></span>
                </Row>
            }
            <Row className="mt-5 " style={{justifyContent: 'center', marginBottom: '100px'}}>
                <Button className="m-2" color="secondary" onClick={close}>Cancel</Button>
                <Button className="m-2" color="info" onClick={this.submit}>Submit</Button>
            </Row>
        </Fragment>
    );
  }
}

InventoryFileMapping.propTypes = {
  close: PropTypes.func.isRequired,
  uploadInventoryItemsFile: PropTypes.func.isRequired,
  options: PropTypes.object.isRequired,
  file: PropTypes.object.isRequired,
  updateLoadingFlag: PropTypes.func.isRequired
}

export default InventoryFileMapping;