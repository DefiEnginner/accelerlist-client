import React, { Component } from 'react';
import {
  Form, FormGroup, Label, Col, Button, Input,
} from 'reactstrap';
import Popover from 'react-awesome-popover';
import Select from 'react-select';
import { FlagIcon } from 'react-flag-kit';
import './style.css';
import { get_marketplace_mapping } from '../../../../helpers/utility';
import "react-awesome-popover/build/index.css";

const labelFlag = (data) => (
	<span>{data.label} <FlagIcon code={data.flag} /></span>
);

class AmazonAuthorization extends Component {
  constructor(props) {
    super(props);

    this.state = {
      marketplace: null,
      amazon_seller_id: "",
      amazon_auth_token: "",
	  amazon_seller_id_ok: false,
	  amazon_auth_token_ok: false,
    }
  }

	check_seller_id = (seller_id) => {
		this.setState({ amazon_seller_id_ok: /^[A-Z0-9]{14}$/.test(seller_id)});
	}

	check_auth_token = (auth_token) => {
		if(auth_token && auth_token.startsWith("amzn.mws")){
			this.setState({ amazon_auth_token_ok: /^[a-zA-Z0-9-.]{45}$/.test(auth_token)});
		} else {
			this.setState({ amazon_auth_token_ok: false});
		}
	}

	UNSAFE_componentWillReceiveProps(np){
		this.setState({
			marketplace: get_marketplace_mapping(false, np.amazon_marketplace),
			amazon_seller_id: np.amazon_seller_id,
			amazon_auth_token: np.amazon_auth_token,
		});
		this.check_seller_id(np.amazon_seller_id);
		this.check_auth_token(np.amazon_auth_token);
	}

  marketplaceChanged = (selected) => {
    this.setState({ marketplace: selected });
  }

	handleInput = (e, source) => {
		this.setState({
	      [source]: e.target.value
		});
		if(source === "amazon_seller_id"){
			this.check_seller_id(e.target.value);
		}
		if(source === "amazon_auth_token"){
			this.check_auth_token(e.target.value);
		}
	}

	linkAccount = () => {
		let ud = this.props.userData;
		ud.authToken = this.state.amazon_auth_token;
		ud.sellerId = this.state.amazon_seller_id;
		ud.marketplaceId = this.state.marketplace.marketplaceID;
		this.props.updateUserData(ud);
		const {
			marketplace,
			amazon_seller_id,
			amazon_auth_token
		} = this.state;
		let marketplaceID;
		if(marketplace.marketplaceID){
			marketplaceID = marketplace.marketplaceID;
		}
        let payload = {
            marketplaceId: marketplaceID,
            sellerId: amazon_seller_id,
            authToken: amazon_auth_token,
        };
        this.props.verifyCredential(payload);
	}


  render() {
    return(
      <Form>
        <FormGroup row>
          <Col md="3">
            <Label>Pick your marketplace carefully</Label>
            <Select
              options={ get_marketplace_mapping(true) }
              optionRenderer={labelFlag}
              valueRenderer={labelFlag}
              value={this.state.marketplace}
              onChange={this.marketplaceChanged}
              clearable={false}
              />
          </Col>
        </FormGroup>
        <FormGroup>
          <Label>Link your Amazon {this.state.marketplace !== null && this.state.marketplace.value} account to AccelerList</Label>
          <ul className="list-unstyled link-account-step">
            <li>
              <span className="step">1</span>
              <span className="text"><a href="https://sellercentral.amazon.com/gp/mws/registration/register.html?developerName=AccerList&devMWSAccountId=5445-7997-8640" target="_blank" rel="noopener noreferrer" >Login here</a> to your Amazon Marketplace Web Service (MWS)</span>
            </li>
            <li>
              <span className="step">2</span>
              <span className="text">
                Once you’re logged into Amazon, input the following information into the two input boxes.
                <Popover
                  action="hover"
                  placement="top"
                  arrow={false}
                  style={{ transform: "translate3d(473px, -339px, 0px)" }}
                >
                  <Button type="button" color="link" className="ml-1">See example screen</Button>
                  <img src="http://placehold.it/400x300" className="img-fluid" alt="" />
                </Popover>
              </span>
            </li>
            <li>
              <span className="step">3</span>
              <span className="text">
                Upon clicking the “Next” button, accept the Terms and Conditions. Then copy/paste your Seller ID and Auth. Token in the boxes below.
                <Popover
                  action="hover"
                  placement="top"
                  arrow={false}
                  style={{ transform: "translate3d(762px, -339px, 0px)" }}
                >
                  <Button type="button" color="link" className="ml-1">See example screen</Button>
                  <img src="http://placehold.it/400x300" className="img-fluid" alt="" />
                </Popover>

                <FormGroup row className="mt-4  align-items-center">
                  <Col md="2"><Label>Seller ID<span className="text-danger">*</span></Label></Col>
                  <Col md="3"><Input
                    value={this.state.amazon_seller_id}
                    onChange={e => this.handleInput(e, "amazon_seller_id")}
					style={this.state.amazon_seller_id_ok ? {} : { "border-color": "red" }}
                  /></Col>
                </FormGroup>
                <FormGroup row className="align-items-center">
                  <Col md="2"><Label>Merchant Token<span className="text-danger">*</span></Label></Col>
                  <Col md="3"><Input
                    value={this.state.amazon_auth_token}
                    onChange={e => this.handleInput(e, "amazon_auth_token")}
					style={this.state.amazon_auth_token_ok ? {} : { "border-color": "red" }}
                  /></Col>
                </FormGroup>
                <FormGroup row>
                  <Col md="5">
                  <Button
                    type="button"
                    color="success"
                    block
                    onClick={this.linkAccount}
					disabled={!this.state.amazon_seller_id_ok || !this.state.amazon_auth_token_ok}
                  >LINK ACCOUNT</Button>
                  </Col>
                </FormGroup>

                <div class="popover show bs-popover-right popover-help-bubble">
                  <div class="popover-body">
                    Need help finding your Seller ID and Auth. Token?
                    Feel free to chat us by clicking the chat icon on
                    the bottom right of your screen.
                  </div>
                </div>
              </span>
            </li>
          </ul>
        </FormGroup>
      </Form>
    );
  }
}

export default AmazonAuthorization;
