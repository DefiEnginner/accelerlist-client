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
	changeUserPassword,
	changeUserPasswordFailureModalClose,
	changeUserPasswordSuccessModalClose } = adminActions;

class UpdateUserPassword extends Component {
    constructor (props) {
        super(props);
		this.state = {
			userUN: "",
			userPW: "",
			showPopupPasswordChanged: false,
			showPopupPasswordChangeFailed: false,
		};
		this.togglePopupPasswordChanged = this.togglePopupPasswordChanged.bind(this);
		this.togglePopupPasswordChangeFailed = this.togglePopupPasswordChangeFailed.bind(this);
		this.processChangePassword = this.processChangePassword.bind(this);
    }

	UNSAFE_componentWillReceiveProps(newProps){
	const { showPopupPasswordChanged, showPopupPasswordChangeFailed } = newProps;
	if(showPopupPasswordChanged !== this.props.showPopupPasswordChanged){
		this.setState({showPopupPasswordChanged: showPopupPasswordChanged});
	}
	if(showPopupPasswordChangeFailed !== this.props.showPopupPasswordChangeFailed){
		this.setState({showPopupPasswordChangeFailed: showPopupPasswordChangeFailed});
	}
  }

  handleUnChange(event) {
	this.setState({userUN: event.target.value});
  }

  handlePwChange(event) {
	this.setState({userPW: event.target.value});
  }

	processChangePassword(){
	const data = {
		username_or_email: this.state.userUN,
		new_password: this.state.userPW,
	}
	this.props.changeUserPassword(data);
	this.setState({userPW: ""});
	this.setState({userUN: ""});
  }

  togglePopupPasswordChanged(){
		this.setState({showPopupPasswordChanged: false});
		this.setState({showPopupPasswordChangeFailed: false});
	  this.props.changeUserPasswordSuccessModalClose();
  }

  togglePopupPasswordChangeFailed(){
		this.setState({showPopupPasswordChangeFailed: false});
		this.setState({showPopupPasswordChanged: false});
	  this.props.changeUserPasswordFailureModalClose();
  }

  render() {
    return (
		<div>
		<Card>
			<br />
			<h4>Update user password</h4>
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
							<Label for="pw">Password:</Label>
							<Input
								type="password"
								name="pw"
								id="pw"
								value={this.state.userPW}
								onChange={this.handlePwChange.bind(this)}
							/>
						</FormGroup>
						<FormGroup>
							<Button
								color="success"
								onClick={this.processChangePassword}
							>
								CHANGE USER PASSWORD
							</Button>
						</FormGroup>
					</Col>
				</Row>
			</CardBody>
		</Card>
			<BConfirmationModal
				isOpen={this.state.showPopupPasswordChanged}
				closeModal={this.togglePopupPasswordChanged}
				modalTitle="Password Changed"
				modalText="Password is changed!"
				buttonColor="success"
				buttonAction={this.togglePopupPasswordChanged}
				buttonText="OK"
			/>
			<BConfirmationModal
				isOpen={this.state.showPopupPasswordChangeFailed}
				closeModal={this.togglePopupPasswordChangeFailed}
				modalTitle="Password Not Changed"
				modalText="Password is not changed!"
				buttonColor="danger"
				buttonAction={this.togglePopupPasswordChangeFailed}
				buttonText="OK"
			/>
	</div>
    );
  }
}

export default connect(
  state => {
    return {
		showPopupPasswordChanged: state.Admin.get('showPopupPasswordChanged'),
		showPopupPasswordChangeFailed: state.Admin.get('showPopupPasswordChangeFailed'),
    };
  },
  {
	  changeUserPassword,
	  changeUserPasswordFailureModalClose,
	  changeUserPasswordSuccessModalClose,
  }
)(UpdateUserPassword);
