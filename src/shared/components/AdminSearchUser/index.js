import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
  Input,
  FormGroup,
  Label,
  Button,
} from "reactstrap";
import { connect } from "react-redux";
import adminActions from "../../../redux/admin/actions";
import BConfirmationModal from "../../../shared/components/BConfirmationModal";

const {
	searchUser,
	searchUserFailureModalClose } = adminActions;

class AdminSearchUser extends Component {
    constructor (props) {
        super(props);
		this.state = {
			userUN: "",
			showUserData: false,
			showUserDataFailed: false,
		};
		this.toggleUserData = this.toggleUserData.bind(this);
		this.toggleUserDataFailed = this.toggleUserDataFailed.bind(this);
    }

	UNSAFE_componentWillReceiveProps(newProps){
	const { showUserData, showUserDataFailed } = newProps;
	if(showUserData !== this.props.showUserData){
		this.setState({showUserData: showUserData});
	}
	if(showUserDataFailed !== this.props.showUserDataFailed){
		this.setState({showUserDataFailed: showUserDataFailed});
	}
  }

  handleUnChange(event) {
	this.setState({userUN: event.target.value});
  }

	processSearchUser(){
	const data = {
		username_or_email: this.state.userUN,
	}
	this.props.searchUser(data);
  }

  toggleUserData(){
	this.setState({showUserData: false});
  }

  toggleUserDataFailed(){
	this.setState({showUserData: false});
	this.setState({showUserDataFailed: false});
	this.props.searchUserFailureModalClose();
  }

  displayUserData(){
	const data = this.props.userData;
	const login_url = '../admin_login/' + data.id;
	return (
		<div><br />
		<b>Username:</b> {data.username}<br />
		<b>Email:</b> {data.email}<br />
		<b>Business Name:</b> {data.business_name}<br />
		<b>Seller ID:</b> {data.seller_id}<br />
		<b>Customer ID:</b> {data.customer_id}<br />
		<b>Auth Token:</b> {data.auth_token}<br />
		<b>Marketplace ID:</b> {data.marketplace_id}<br />
		<b>Active Subscription:</b> {data.has_active_subscription}<br />
		<b>In Trial:</b> {data.is_trialing}<br />
		<b>Plan:</b> {data.paln}<br />
		<b>Phone:</b> {data.phone}<br />
		<b>Created:</b> {data.created_at}<br /><br />
		<a className="btn btn-success" href={login_url}>LOGIN AS USER</a>
		</div>
	)
  }

  render() {
    return (
		<div>
		<Card>
			<br />
			<h4>User search</h4>
			<CardBody>
				<Row>
					<Col>
						<FormGroup>
							<Label for="un">Username or email:</Label>
							<Input
								type="text"
								name="un"
								id="un"
								value={this.state.userUN}
								onChange={this.handleUnChange.bind(this)}
							/>
						</FormGroup>
						<FormGroup>
							<Button
								color="success"
								onClick={this.processSearchUser.bind(this)}
							>
								SEARCH USER
							</Button>
							{this.props.showUserData ? (
								this.displayUserData()
							) : (null)
							}
						</FormGroup>
					</Col>
				</Row>
			</CardBody>
		</Card>
			<BConfirmationModal
				isOpen={this.state.showUserDataFailed}
				closeModal={this.toggleUserDataFailed}
				modalTitle="User Not Found"
				modalText="User is not found!"
				buttonColor="danger"
				buttonAction={this.toggleUserDataFailed}
				buttonText="OK"
			/>
	</div>
    );
  }
}

export default connect(
  state => {
    return {
		showUserData: state.Admin.get('showUserData'),
		showUserDataFailed: state.Admin.get('showUserDataFailed'),
		userData: state.Admin.get("userData"),
    };
  },
  {
	  searchUser,
	  searchUserFailureModalClose,
  }
)(AdminSearchUser);
