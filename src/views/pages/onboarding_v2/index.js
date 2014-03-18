import React, { Component } from 'react';
import { connect } from 'react-redux';
import settingsActions from '../../../redux/settings/actions';
import authActions from "../../../redux/auth/actions";
import appActions from "../../../redux/app/actions";
import {
  Nav, NavItem, NavLink, TabContent, TabPane, Button, Col, Row
} from 'reactstrap';
import { IoAndroidArrowDropright as IconArrowRight } from 'react-icons/lib/io';
import { FaFacebookSquare as IconFacebook } from 'react-icons/lib/fa';
import AmazonAuthorization from './AmazonAuthorization';
import Address from '../address';
import CustomSKUSelector from '../../../shared/components/customSKUSelector';
import './style.css';
import addressAction from "../../../redux/address/actions";
import { exampleMSKU } from "../../../assets/images";

const { fetchAdressList } = addressAction;

const { openMwsAuthorizeModal, getUser, verifyCredential } = authActions;
const { closeSettingsAlert } = settingsActions;

const {
	fetchListingDefaults,
	saveListingDefaults,
	updateUserDataSettings,
	updateUserSettings
} = settingsActions

const { userError } = appActions;
const { updateUserData } = authActions;

class Onboarding_v2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
    activeTab: 1,
    customSKUOpen: false
    }
  }

  toggleTab = (tabId) => {
    this.setState({
      activeTab: tabId,
    });
  }

  openCustomSKU = () => {
    this.setState({
      customSKUOpen: true
    })
  }

	UNSAFE_componentWillReceiveProps(np){
		if(np.userData){
			if(
				np.userData.marketplaceId
					&& np.userData.sellerId
					&& np.userData.authToken){
				this.setState({ activeTab: 2 });
			} else {
				this.setState({ activeTab: 1 });
				return;
			}
			if(this.props.addressList){
				if(
					np.userData.marketplaceId
						&& np.userData.sellerId
						&& np.userData.authToken
						&& this.props.addressList.length > 0){
					this.setState({ activeTab: 3 });
				} else {
					this.setState({ activeTab: 2 });
					return;
				}
				if(this.props.listingDefaults){
					if(
						np.userData.marketplaceId
							&& np.userData.sellerId
							&& np.userData.authToken
							&& this.props.addressList.length > 0
							&& this.props.listingDefaults.sku_prefix){
						this.setState({ activeTab: 4 });
						if(this.props.userData && !this.props.userData.settings.is_onboarded){
							let ud = np.userData;
							ud.settings['is_onboarded'] = true;
							this.props.updateUserData(ud);
							let data = {is_onboarded: ud.settings["is_onboarded"]};
							this.props.updateUserSettings(data);
						}
					} else {
						this.setState({ activeTab: 3 });
						return;
					}
				}
			} else {
				this.props.fetchAdressList();
			}
		}
	}

  render() {
    const {
		listingDefaults,
		userData,
		addressList,
    } = this.props;

    const {
      activeTab,
      customSKUOpen
	} = this.state;

    return (
      <div className="view">
        <div className="view-content onboarding mt-0">
          <h2 className="h4">Welcome to AccelerList</h2>
          <p>Let’s get you started by linking your Amazon account and providing some information.</p>

          <div className="d-flex justify-content-between align-items-center mt-5">
            <Nav pills className="nav-pills-step">
              <NavItem>
				  <NavLink
					  active={activeTab >= 1}
					  onClick={() => this.toggleTab(1)}
					  className={ userData &&
						(!userData.marketplaceId ||
							!userData.sellerId ||
							!userData.authToken) ? "bg-danger white" : null }
				  >
                  <div>
                    <span className="step">Step 1:</span>
                    <span className="title">AMAZON AUTHORIZATION</span>
                  </div>
                  <IconArrowRight size="22" className="icon-arrow" />
                </NavLink>
              </NavItem>
              <NavItem>
				  <NavLink
					  active={activeTab >= 2}
					  onClick={() => this.toggleTab(2)}
					  className={addressList && !addressList.length > 0 ? "bg-danger white" : null }
				  >
                  <div>
                    <span className="step">Step 2:</span>
                    <span className="title">SET SHIPPING ADDRESS</span>
                  </div>
                  <IconArrowRight size="22" className="icon-arrow" />
                </NavLink>
              </NavItem>
              <NavItem>
				  <NavLink
					  active={activeTab >= 3}
					  onClick={() => this.toggleTab(3)}
					  className={listingDefaults && !listingDefaults.sku_prefix ? "bg-danger white" : null }
				  >
                  <div>
                    <span className="step">Step 3:</span>
                    <span className="title">SET CUSTOM SKU</span>
                  </div>
                  <IconArrowRight size="22" className="icon-arrow" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink active={activeTab >= 4} onClick={() => this.toggleTab(4)}>
                  <div>
                    <span className="step">Step 4:</span>
                    <span className="title">WATCH PRODUCT DEMO</span>
                  </div>
                  <IconArrowRight size="22" className="icon-arrow" />
                </NavLink>
              </NavItem>
            </Nav>
            <Nav pills>
              <NavItem><NavLink href="https://www.facebook.com/groups/accelerlist/" target="_blank" className="p-0"><IconFacebook size="28" color="#3B5998" /></NavLink></NavItem>
            </Nav>
          </div>
          <TabContent activeTab={activeTab} className="tab-content-step">
            <TabPane tabId={1}>
				<AmazonAuthorization
					amazon_marketplace={
						this.props.userData
							? this.props.userData.marketplaceId
							: null
						}
					amazon_seller_id={
						this.props.userData
							? this.props.userData.sellerId
							: null
						}
					amazon_auth_token={
						this.props.userData
							? this.props.userData.authToken
							: null
						}
					updateUserData={this.props.updateUserData}
					userData={this.props.userData}
					verifyCredential={this.props.verifyCredential}
				/>
            </TabPane>
            <TabPane tabId={2}>
              <Address />
            </TabPane>
            <TabPane tabId={3}>
              { customSKUOpen === false &&
              <div className="text-center">
                <p className="mb-4">It’s now time to create your custom MSKU (Merchant Sku Number). This is very important step that allows you to customize your skus for each
                  product you list. Below is an example MSKU set up that most sellers use. You can customize yours to include multiple data sets by pressing
                  the button below. It’s crucial you create a unique MSKU configuration so that none of your MSKUs repeat over time which will cause an error
                  in your Seller Central account.</p>
                <img src={exampleMSKU} alt="Example of MSKU" className="img-fluid m-auto" />
                <Button color="success" className="mt-4" onClick={this.openCustomSKU}>CREATE YOUR CUSTOM MSKU NOW</Button>
              </div>
              }
              <CustomSKUSelector
                isOpen={customSKUOpen}
                listingDefaults={listingDefaults}
                onSaveListingDefaults={this.props.saveListingDefaults}
              />
            </TabPane>
            <TabPane tabId={4}>
				<div>
					<Row>
						<Col sm="3">
							<div className="text-center">
								<h3>
									Please watch the demo video!
								</h3>
							</div>
							<br />
							<div className="text-center">
								<h3>
									Afterwards, the last step may be setting up yout thermal printer in the settings area. Then you're ready to create your first batch.
								</h3>
							</div>
						</Col>
						<Col sm="6">
              <div>
                <div class="embed-responsive embed-responsive-16by9">
                  <iframe
                    class="embed-responsive-item"
                    src="https://www.youtube.com/embed/9y9n260kHBM?rel=0"
                    allowfullscreen
                    title="Instructions"
                  ></iframe>
                </div>
			</div>
						</Col>
						<Col sm="3">
							<div className="text-center">
								<h3>
									If you need help you can always reach us from the chat widget in the bottom righthand corner.
								</h3>
							</div>
						</Col>
					</Row>
			  </div>
            </TabPane>
          </TabContent>
        </div>
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
	  addressList: state.Address.get("addressList"),
 	  userTags: state.UserTags.get("userTags"),
    }
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
	  fetchAdressList,
	  verifyCredential,
  }
)(Onboarding_v2);
