import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
} from "reactstrap";
import {
	Elements,
	StripeProvider, } from 'react-stripe-elements';
import ExampleComponent from "react-rounded-image";
import { connect } from "react-redux";
import VisaLogo from "../../../assets/images/visa_logo.gif"
import MasterLogo from "../../../assets/images/master_logo.gif"
import CardLogo from "../../../assets/images/card_logo.gif"
import settingsActions from "../../../redux/settings/actions";
import membershipActions from "../../../redux/membership/actions";
import moment from 'moment';
import BConfirmationModal from "../../../shared/components/BConfirmationModal";
import { stripePublicKey } from "../../../config/mediaLinks";
import StripeCardReplaceForm from "../../../shared/components/StripeCardReplaceForm";

const {
	uploadProfileImage,
	getProfileImage,
	getProfileBillingData } = settingsActions;

const {
	cancelMembership,
	restartMembership } = membershipActions;

class UpdateBilling extends Component {
	constructor(props) {
		super(props);
		this.state = {
			invoicesToDisplay: [],
			invoiceDisplayPage: 0,
			showPopupCancelSubscription: false,
			showPopupRestartSubscription: false,
			valid_sub: false,
		}
		this.handleUploadClick = this.handleUploadClick.bind(this);
		this.togglePopupCancelSubscription = this.togglePopupCancelSubscription.bind(this);
		this.togglePopupRestartSubscription = this.togglePopupRestartSubscription.bind(this);
		this.cancelSubscription = this.cancelSubscription.bind(this);
		this.restartSubscription = this.restartSubscription.bind(this);
		this.updateCardData = this.updateCardData.bind(this);
	}

	updateCardData(){

	}

	cancelSubscription(){
		this.props.cancelMembership();
		this.setState({showPopupCancelSubscription: false});
		this.props.getProfileBillingData();
	}

	restartSubscription(){
		this.props.restartMembership();
		this.setState({showPopupRestartSubscription: false});
		this.props.getProfileBillingData();
	}

	togglePopupCancelSubscription(){
		this.setState({showPopupCancelSubscription: !this.state.showPopupCancelSubscription});
	}

	togglePopupRestartSubscription(){
		this.setState({showPopupRestartSubscription: !this.state.showPopupRestartSubscription});
	}

	handleUploadClick(e) {
		this.refs.fileUploader.click();
	}

	uploadOnChange = (e) => {
		const files = Array.from(e.target.files);
		if(files){
			//file size limitation to 100K
			if(files[0].size < 100 * 1024){
				this.props.uploadProfileImage(files[0]);
			}
		}
	}

	componentDidMount(){
		this.props.getProfileImage();
		this.props.getProfileBillingData();
	}

	/*
	componentWillMount(){
		const { profileBillingDataSet, invoicesPerPage } = this.props;
		this.setState({invoicesToDisplay: profileBillingDataSet['billing_data'].slice(0, invoicesPerPage)});
	}
	*/

    UNSAFE_componentWillReceiveProps(newProps) {
		const {
			profileBillingDataSet,
			is_canceled,
			is_restarted } = newProps;
		const { invoicesPerPage } = this.props;
		const { invoicesToDisplay } = this.state;
		if(invoicesToDisplay && profileBillingDataSet['billing_data']){
			this.setState({invoicesToDisplay: profileBillingDataSet['billing_data'].slice(0, invoicesPerPage)});
		}
		if(is_canceled || is_restarted){
			if(is_canceled){
				this.setState({ valid_sub: false });
			}
			if(is_restarted){
				this.setState({ valid_sub: true });
			}
		} else {
			this.setState({ valid_sub: (profileBillingDataSet['user_data']['active'] === 'true') });
		}

    }

	invoicesNext = () => {
		const { profileBillingDataSet, invoicesPerPage } = this.props;
		const a = this.state.invoiceDisplayPage + 1;
		this.setState({invoicesToDisplay: profileBillingDataSet['billing_data'].slice(a*invoicesPerPage, (a + 1)*invoicesPerPage)});
		this.setState({invoiceDisplayPage: a})
	}

	invoicesPrev = () => {
		const { profileBillingDataSet, invoicesPerPage } = this.props;
		const a = this.state.invoiceDisplayPage - 1;
		this.setState({invoicesToDisplay: profileBillingDataSet['billing_data'].slice(a*invoicesPerPage, (a + 1)*invoicesPerPage)});
		this.setState({invoiceDisplayPage: a})
	}

	displayInvoice = invoice => {
		let logo = '';
		if(invoice['card'] === 'visa'){
			logo = VisaLogo;
		} else if(invoice['card'] === 'master') {
			logo = MasterLogo;
		} else {
			logo = CardLogo;
		}
		return (
		<React.Fragment key={ invoice['date_ts'] }>
			<Row>
				<Col xs="1">
					<img
						src={ logo }
						alt="logo"
					/>
				</Col>
				<Col>
					<Row>
						<Col>
							<b>Invoice of { moment(invoice['date']).format("MMMM Mo, YYYY") } ${ (invoice['amount'] / 100).toFixed(2) }</b>
						</Col>
						<Col xs="3">
							<div className="text-right">
								<a target="_blank"
									rel="noopener noreferrer"
									href={ invoice['url'].substr(0, invoice['url'].lastIndexOf("/")) }
								>Download</a>
							</div>
						</Col>
					</Row>
				</Col>
			</Row>
			<hr />
		</React.Fragment>
		);
	}

	showSubscriptionMessage = (color, message) => {
		const col = { color: color }
		return (
			<Row>
				<Col>
					<span style={ col }>
						<b>{ message }</b>
					</span>
				</Col>
			</Row>
		);
	}

  render() {
	const { profileBillingDataSet, invoicesPerPage } = this.props;
	const { invoiceDisplayPage } = this.state;
    return (
	<div>
    <Card body style={{ backgroundColor: '#f9f9f9', borderColor: '#f9f9f9' }}>
		<CardBody>
			<CardTitle>Update Billing</CardTitle>
			<Row>
				<Col xs="1">
				</Col>
				<Col>
					<Card>
						<CardBody>
							<Row>
								<Col>
									<input
										type="file"
										id="file"
										ref="fileUploader"
										style={{display: "none"}}
										onChange={this.uploadOnChange}
									/>
									<div style={{display: 'flex', justifyContent: 'right' }}>
										<div
											style={{ cursor: "pointer" }}
											onClick={this.handleUploadClick}
										>
											<ExampleComponent
												image={this.props.profileImage}
												roundedSize="0"
												imageWidth="100"
												imageHeight="100"
											/>
										</div>
									</div>
								</Col>
								<Col>
									<CardTitle>
										{ this.props.profileBillingDataSet['user_data']['businessname'] ? (
												this.props.profileBillingDataSet['user_data']['businessname']
											) : ( this.props.profileBillingDataSet['user_data']['username'] )
										}
									</CardTitle>
									Customer since <b>{ moment(this.props.profileBillingDataSet['user_data']['created']).format("MMMM, YYYY") }</b><br />
									{ this.state.valid_sub ? (
									<div className="text-right">
										<Button
										  className="float-center"
										  color="danger"
										  onClick={this.togglePopupCancelSubscription}
										  disabled={this.props.is_canceling}
										>
										  CANCEL SUBSRIPTION
										</Button>
									</div> ) : (
									<div className="text-right">
										<Button
										  className="float-center"
										  color="success"
										  onClick={this.togglePopupRestartSubscription}
										  disabled={this.props.is_restarting}
										>
										  RESTART SUBSRIPTION
										</Button>
									</div>
									)
									}
									{this.props.show_cancel_failed ? (
										this.showSubscriptionMessage(
											"red",
											"Canceling subscription failed!")
									) : (null)
									}
									{this.props.show_restart_failed ? (
										this.showSubscriptionMessage(
											"red",
											"Restarting subscription failed!")
									) : (null)
									}
									{this.props.show_canceled ? (
										this.showSubscriptionMessage(
											"green",
											"Canceling subscription success!")
									) : (null)
									}
									{this.props.show_restarted ? (
										this.showSubscriptionMessage(
											"green",
											"Restarting subscription sucsess!")
									) : (null)
									}
								</Col>
							</Row>
						</CardBody>
					</Card>
					<br />
					<Card>
						<CardBody>
							<CardTitle>Update Billing Payment Method</CardTitle>
							<StripeProvider apiKey={ stripePublicKey }>
								<Elements>
									<StripeCardReplaceForm />
								</Elements>
							</StripeProvider>
						</CardBody>
					</Card>
				</Col>
				<Col xs="1">
				</Col>
				<Col>
					<Card>
						<CardBody>
							<Row>
								<Col>
									<h3>Your Invoices</h3>
								</Col>
								<Col>
									<div className="text-right">
									</div>
								</Col>
							</Row>
							<hr /><br />
							{this.state.invoicesToDisplay.map(invoice => (
								this.displayInvoice(invoice)
							))}
							<Row>
								<Col>
									<div className="text-right">
										{
											invoiceDisplayPage > 0 ? (
										<Button
											onClick={() => this.invoicesPrev()}
											color="primary"
										>
												&lt;
										</Button>
										) : (null)
										}
										{
											invoiceDisplayPage * invoicesPerPage + invoicesPerPage < profileBillingDataSet['billing_data'].length ? (
										<Button
											onClick={() => this.invoicesNext()}
											color="primary"
										>
											&gt;
										</Button>
										) : (null)
										}
									</div>
								</Col>
							</Row>
						</CardBody>
					</Card>
				</Col>
				<Col xs="1">
				</Col>
			</Row>
        </CardBody>
	</Card>
		{ this.state.showPopupCancelSubscription ? (
			<BConfirmationModal
				isOpen={this.state.showPopupCancelSubscription}
				closeModal={this.togglePopupCancelSubscription}
				modalTitle="Confirm Cancel Subscription"
				modalText="Please confirm cancel subscription"
				buttonColor="danger"
				buttonAction={this.cancelSubscription}
				buttonText="CANCEL SUBSCRIPTION"
			/> ) : (null)
		}
		{ this.state.showPopupRestartSubscription ? (
			<BConfirmationModal
				isOpen={this.state.showPopupRestartSubscription}
				closeModal={this.togglePopupRestartSubscription}
				modalTitle="Confirm Restart Subscription"
				modalText="Please confirm restart subscription"
				buttonColor="success"
				buttonAction={this.restartSubscription}
				buttonText="RESTART SUBSCRIPTION"
			/> ) : (null)
		}
	</div>
    );
  }
}

export default connect(
	state => {
		return {
			userData: state.Auth.get('userData'),
			profileImage: state.Settings.get("profileImage"),
			profileBillingDataSet: state.Settings.get("profileBillingDataSet"),
			is_member: state.Settings.get("is_canceled"),
			is_canceled: state.Membership.get("is_canceled"),
			is_restarted: state.Membership.get("is_restarted"),
			is_restarting: state.Membership.get("is_restarting"),
			is_canceling: state.Membership.get("is_canceling"),
			show_cancel_failed: state.Membership.get("show_cancel_failed"),
			show_restart_failed: state.Membership.get("show_restart_failed"),
			show_canceled: state.Membership.get("show_canceled"),
			show_restarted: state.Membership.get("show_restarted"),
		};
	}, {
		uploadProfileImage,
		getProfileImage,
		getProfileBillingData,
		cancelMembership,
		restartMembership,
	}
)(UpdateBilling);
