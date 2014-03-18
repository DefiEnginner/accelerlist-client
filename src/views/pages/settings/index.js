import React, { Component } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
	TabContent,
	TabPane,
	Nav,
	NavItem,
	NavLink,
} from "reactstrap";
import { connect } from "react-redux";

import classnames from 'classnames';
import { func, object } from "prop-types";
import Address from "../address";
import ListingDefaults from "./Listing_Defaults";
import PrinterDefaultsQz from "./PrintSettings";
import UpdateBilling from "./UpdateBilling";
import UpdatePasswordForm from "./UpdatePasswordForm";
import LeaderboardForm from "./LeaderboardForm";
import AffiliateForm from "./AffiliateForm";
import SupplierList from "./SupplierList";
import ScoutList from "./ScoutList";
import SweetAlert from "sweetalert2-react";
import settingsActions from "../../../redux/settings/actions";
import authActions from "../../../redux/auth/actions";
import appActions from "../../../redux/app/actions";
import SKUSettings from "./SKU_Settings"
const { openMwsAuthorizeModal, getUser } = authActions;
const { closeSettingsAlert } = settingsActions;



const {
	fetchListingDefaults,
	saveListingDefaults,
	updateUserDataSettings,
	updateUserSettings
} = settingsActions
const { userError } = appActions;
const { updateUserData } = authActions;

const ViewHeader = () => (
  <div className="view-header">
    <header className="text-white">
      <h1 className="h5 title text-uppercase">Settings</h1>
    </header>
  </div>
);

const ViewContent = ({ children }) => (
  <div className="view-content view-components">
    <Card>
      <CardBody>{children}</CardBody>
    </Card>
  </div>
);

class Settings extends Component {

	constructor(props) {
	    super(props);

		this.toggleTabs = this.toggleTabs.bind(this);
	    this.state = {
			activeTab: '1',
			businessName: "",
			sellerId: "",
			marketplaceId: "",
			authToken: "",
	    };
	}

	UNSAFE_componentWillReceiveProps(newProps){
		if(newProps.userData){
			if(newProps.userData.businessName){
				this.setState({businessName: newProps.userData.businessName});
			}
			if(newProps.userData.sellerId){
				this.setState({sellerId: newProps.userData.sellerId});
			}
			if(newProps.userData.marketplaceId){
				this.setState({marketplaceId: newProps.userData.marketplaceId});
			}
			if(newProps.userData.authToken){
				this.setState({authToken: newProps.userData.authToken});
			}
		}
	}

	  toggleTabs(tab) {
		if (this.state.activeTab !== tab) {
	      this.setState({
		    activeTab: tab
	      });
		}
	  }

	handleUpdateBusinessName(){
		const { businessName } = this.state;
		this.props.updateUserDataSettings({
			business_name: businessName
		});
	}

	handleUpdateSellerId(){
		const { sellerId } = this.state;
		this.props.updateUserDataSettings({
			seller_id: sellerId
		});
	}

	handleUpdateMarketplaceId(){
		const { marketplaceId } = this.state;
		this.props.updateUserDataSettings({
			marketplace_id: marketplaceId
		});
	}

	handleUpdateAuthToken(){
		const { authToken } = this.state;
		this.props.updateUserDataSettings({
			auth_token: authToken
		});
	}

  static propTypes = {
    closeSettingsAlert: func.isRequired,
    openMwsAuthorizeModal: func.isRequired,
    currentAlert: object
  };

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.screenPosition) {
      window.location.href = `#${this.props.location.state.screenPosition}`;
	}
	if(this.props.userData){
		this.setState({businessName: this.props.userData.businessName});
	}
  }

  render() {
    const {
      closeSettingsAlert,
      currentAlert,
      openMwsAuthorizeModal,
      mwsAuthValues,
      listingDefaults,
			userError,
			isUserSettingsUpdating,
    } = this.props;

	const { businessName, sellerId, marketplaceId, authToken } = this.state;
    return (
      <div className="view settings">
        <ViewHeader />
        <ViewContent>
			<Row>
				<div style={{width: "100%"}}>
					<Nav pills>
					  <NavItem>
						<NavLink
						  className={classnames({ active: this.state.activeTab === '1' })}
						  style={{ cursor: "pointer" }}
						  onClick={() => { this.toggleTabs('1'); }}
						>
						  Account Settings
						</NavLink>
					  </NavItem>
					  <NavItem>
						<NavLink
						  className={classnames({ active: this.state.activeTab === '2' })}
						  style={{ cursor: "pointer" }}
						  onClick={() => { this.toggleTabs('2'); }}
						>
						  Address Settings
						</NavLink>
					  </NavItem>
					  <NavItem>
						<NavLink
						  className={classnames({ active: this.state.activeTab === '3' })}
						  style={{ cursor: "pointer" }}
						  onClick={() => { this.toggleTabs('3'); }}
						>
						  Printer Settings
						</NavLink>
					  </NavItem>
					  <NavItem>
						<NavLink
						  className={classnames({ active: this.state.activeTab === '4' })}
						  style={{ cursor: "pointer" }}
						  onClick={() => { this.toggleTabs('4'); }}
						>
						  Listing Settings
						</NavLink>
					  </NavItem>
					  <NavItem>
						<NavLink
						  className={classnames({ active: this.state.activeTab === '5' })}
						  style={{ cursor: "pointer" }}
						  onClick={() => { this.toggleTabs('5'); }}
						>
						  SKU Settings
						</NavLink>
					  </NavItem>
					  <NavItem>
						<NavLink
						  className={classnames({ active: this.state.activeTab === '6' })}
						  style={{ cursor: "pointer" }}
						  onClick={() => { this.toggleTabs('6'); }}
						>
							Supplier/Scout Settings
						</NavLink>
					  </NavItem>
					  <NavItem>
						<NavLink
						  className={classnames({ active: this.state.activeTab === '7' })}
						  style={{ cursor: "pointer" }}
						  onClick={() => { this.toggleTabs('7'); }}
						>
						  Update Billing
						</NavLink>
					  </NavItem>
					</Nav>
					<TabContent activeTab={this.state.activeTab}>
					  <TabPane tabId="1">
						  <Row>
							<Col>
							  <Card>
								<CardBody>
								  <CardTitle>Account Settings</CardTitle>
								  <Row>
										<Col>
											<Card>
												<CardBody>
													<h6 className="card-title text-uppercase">
													Your Amazon MWS Authorization Settings
													</h6>
													<Form>
														<FormGroup row>
															<Label for="userName" sm={3}>
															Username:
															</Label>
															<Col sm={9}>
															<Input
																value={
																this.props.userData !== undefined
																	? this.props.userData.userName
																	: null
																}
																type="text"
																name="username"
																id="userName"
																disabled
															/>
															</Col>
														</FormGroup>
														<FormGroup row>
															<Label for="businessName" sm={3}>
															Business Name:
															</Label>
															<Col sm={7}>
															<Input
																value={ businessName }
																type="text"
																name="businessName"
																id="businessName"
																disabled={isUserSettingsUpdating}
																onChange={(e) => {
																this.setState({
																	businessName: e.target.value
																})
																}}
															/>
															</Col>
															<Col sm={2}>
															<Button
																color="primary"
																className="mb-2 float-right"
																disabled={isUserSettingsUpdating}
																onClick={this.handleUpdateBusinessName.bind(this)}
															>Update</Button>
															</Col>
														</FormGroup>
														<FormGroup row>
															<Label for="email" sm={3}>
															Email:
															</Label>
															<Col sm={9}>
															<Input
																value={
																this.props.userData !== undefined
																	? this.props.userData.email
																	: null
																}
																type="text"
																name="email"
																id="email"
																disabled
															/>
															</Col>
														</FormGroup>
														<FormGroup row>
															<Label for="phone" sm={3}>
															Phone:
															</Label>
															<Col sm={9}>
															<Input
																value={
																this.props.userData !== undefined
																	? this.props.userData.phone
																	: null
																}
																type="text"
																name="phone"
																id="phone"
																disabled
															/>
															</Col>
														</FormGroup>
														<FormGroup row>
															<Label for="sellerID" sm={3}>
															Seller ID:
															</Label>
															<Col sm={7}>
															<Input
																value={ sellerId }
																type="text"
																name="sellerID"
																id="sellerID"
																disabled={isUserSettingsUpdating}
																onChange={(e) => {
																this.setState({
																	sellerId: e.target.value
																})
																}}
															/>
															</Col>
															<Col sm={2}>
															<Button
																color="primary"
																className="mb-2 float-right"
																disabled={isUserSettingsUpdating}
																onClick={this.handleUpdateSellerId.bind(this)}
															>Update</Button>
															</Col>
														</FormGroup>
														<FormGroup row>
															<Label for="mwsToken" sm={3}>
															MWS Auth.Token:
															</Label>
															<Col sm={7}>
															<Input
																value={ authToken }
																type="text"
																name="token"
																id="mwsToken"
																disabled={isUserSettingsUpdating}
																onChange={(e) => {
																this.setState({
																	authToken: e.target.value
																})
																}}
															/>
															</Col>
															<Col sm={2}>
															<Button
																color="primary"
																className="mb-2 float-right"
																disabled={isUserSettingsUpdating}
																onClick={this.handleUpdateAuthToken.bind(this)}
															>Update</Button>
															</Col>
														</FormGroup>
														<FormGroup row>
															<Label for="marketId" sm={3}>
															Marketplace ID:
															</Label>
															<Col sm={7}>
															<Input
																value={ marketplaceId }
																type="text"
																name="marketId"
																id="marketId"
																disabled={isUserSettingsUpdating}
																onChange={(e) => {
																this.setState({
																	marketplaceId: e.target.value
																})
																}}
															/>
															</Col>
															<Col sm={2}>
															<Button
																color="primary"
																className="mb-2 float-right"
																disabled={isUserSettingsUpdating}
																onClick={this.handleUpdateMarketplaceId.bind(this)}
															>Update</Button>
															</Col>
														</FormGroup>
													</Form>
													<Row>
													<Col xs="6">
														<Button
														onClick={openMwsAuthorizeModal}
														color="success"
														>
															{ mwsAuthValues.authToken ? "Re-Authorize" : "Authorize" }
														</Button>
													</Col>
													<Col xs="6">
													</Col>
													</Row>
												</CardBody>
												</Card>
											</Col>
											<Col>
												<UpdatePasswordForm />
												{this.props.userData ? (
												<AffiliateForm
													className="mt-4"
													userData={this.props.userData}
													updateUserData={this.props.updateUserData}
													updateUserSettings={this.props.updateUserSettings}
												/>
												) : (null)
												}
												{this.props.userData ? (
												<LeaderboardForm
													userData={this.props.userData}
													updateUserData={this.props.updateUserData}
													updateUserSettings={this.props.updateUserSettings}
												/>
												) : (null)
												}
											</Col>
								  </Row>
								</CardBody>
							  </Card>
							</Col>
						  </Row>
					  </TabPane>
					  <TabPane tabId="2">
						  <Row>
							  <Col>
								<Address />
							  </Col>
						  </Row>
					  </TabPane>
					  <TabPane tabId="3">
						  <Row>
							  <Col>
								<PrinterDefaultsQz />
							  </Col>
						  </Row>
					  </TabPane>
					  <TabPane tabId="4">
						  <Row>
							  <Col>
								  <Row>
									<Col xs="12">
									  <Card style={{overflow: "inherit"}}>
										<CardBody>
										  <CardTitle>Listing Settings</CardTitle>
										  <Row>
											<Col>
												<ListingDefaults
													userError={userError}
													updateUserData={this.props.updateUserData}
													updateUserSettings={this.props.updateUserSettings}
												/>
											</Col>
										  </Row>
										</CardBody>
									  </Card>
									</Col>
								  </Row>
							  </Col>
						  </Row>
					  </TabPane>
					  <TabPane tabId="5">
						  <Row>
							  <Col>
								  <Card>
									<CardBody>
									  <CardTitle>SKU Settings</CardTitle>
									  <SKUSettings onSaveListingDefaults={this.props.saveListingDefaults} onFetchListingDefaults={this.props.fetchListingDefaults} listingDefaults={listingDefaults} />
									</CardBody>
								  </Card>
							  </Col>
						  </Row>
					  </TabPane>
					  <TabPane tabId="6">
						  <Row>
							  <Col>
								<SupplierList />
							  </Col>
						  </Row>
						  <br /><hr /><br />
						  <Row>
							  <Col>
								<ScoutList />
							  </Col>
						  </Row>
					  </TabPane>
					  <TabPane tabId="7">
						  <Row>
							  <Col>
								  <UpdateBilling
									invoicesPerPage={10}
								  />
							  </Col>
						  </Row>
					  </TabPane>
					</TabContent>
				  </div>
			</Row>
        </ViewContent>
        {currentAlert ? (
          <SweetAlert
            show={currentAlert !== null}
            title={currentAlert.title}
            text={currentAlert.text}
            confirmButtonColor={"#3085d6"}
            onConfirm={() => closeSettingsAlert()}
          />
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default connect(
  state => {
    return {
      mwsAuthValues: state.Auth.get("mwsAuthValues"),
      userData: state.Auth.get("userData"),
      listingDefaults: state.Settings.toJS().listingDefaults,
      currentAlert: state.Settings.get("currentAlert"),
      isUserSettingsUpdating: state.Settings.get("isUserSettingsUpdating"),
    };
  },
  {
    fetchListingDefaults,
    closeSettingsAlert,
    openMwsAuthorizeModal,
    saveListingDefaults,
	userError,
	updateUserDataSettings,
	getUser,
	updateUserData,
	updateUserSettings,
  }
)(Settings);
