import React, { Component } from 'react';
import {
  Row,
  Card,
  CardBody,
  Input,
} from 'reactstrap';

import CustomSKUSelector from '../../../shared/components/customSKUSelector';
import './index.css';

class SKUSettings extends Component {
  constructor () {
    super();
    this.state = {
      loadedForFirstTime: true,
    }
  }

  UNSAFE_componentWillMount(){
    const { listingDefaults } = this.props;
    this.setState({ UseDefaultCustomSKU: listingDefaults.should_use_custom_sku_template })
    // this.props.onFetchListingDefaults();
  }



  handleChangeUseDefaultCustomSKU = (e) => {
    if (e.target.value === 'Yes') {
      this.setState({
        UseDefaultCustomSKU: true
      })
    }
    if (e.target.value === 'No') {
      this.setState({
        UseDefaultCustomSKU: false
      }, () => {
        const updatedData = {
          should_use_custom_sku_template: false,
          sku_prefix: ""
        };
        this.props.onSaveListingDefaults(updatedData);
      })
    }
  }
	render() {
    const {
      UseDefaultCustomSKU,
    } = this.state;
		return (
      <Card id="SKU_Settings">
        <CardBody style={ {padding: '35px'}}>
          <Row className="title-row font-bold">
            Would you like to use a default custom SKU when listing?
            <Input
              type="select"
              value={UseDefaultCustomSKU === true ? 'Yes': 'No'}
              style={{ width: '100px', marginLeft: '20px'}}
              onChange={this.handleChangeUseDefaultCustomSKU}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Input>
          </Row>

          <CustomSKUSelector
            isOpen={UseDefaultCustomSKU}
            listingDefaults={this.props.listingDefaults}
            onSaveListingDefaults={this.props.onSaveListingDefaults}
			userData={this.props.userData}
          />
          </CardBody>
      </Card>
		);
	}
}

export default SKUSettings;
