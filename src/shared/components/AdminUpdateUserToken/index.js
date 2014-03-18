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

const {
	userTokenUpdate,
} = adminActions;

class AdminUpdateUserToken extends Component {
    constructor (props) {
        super(props);
		this.state = {
			userUN: "",
			userEmail: "",
			userToken: "",
			sellerId: "",
		};
    }

	handleInputChange = (event, input) => {
		this.setState({[input]: event.target.value});
		console.log(this.state)
	}

	processUpdate(){
		const { userUN, userEmail, userToken, sellerId } = this.state;
		const data = {
			username: userUN,
			email: userEmail,
			token: userToken,
			sellerid: sellerId,
		}
		this.props.userTokenUpdate(data);
		console.log(this.state, this.props);
	}

	render() {
		const {
			userTokenUpdateCompleted,
			userTokenUpdateFailed,
		} = this.props;
    return (
		<div>
		<Card>
			<br />
			<h4>User Auth Token And Seller ID Upadate</h4>
			<CardBody>
				<Row>
					<Col>
						<FormGroup>
							<Label for="un">Username:</Label>
							<Input
								type="text"
								name="un"
								id="un"
								value={this.state.userUN}
								onChange={e => this.handleInputChange(e, "userUN")}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="token">email:</Label>
							<Input
								type="text"
								name="email"
								id="email"
								value={this.state.userEmail}
								onChange={e => this.handleInputChange(e, "userEmail")}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="token">Token:</Label>
							<Input
								type="text"
								name="token"
								id="token"
								value={this.state.userToken}
								onChange={e => this.handleInputChange(e, "userToken")}
							/>
						</FormGroup>
						<FormGroup>
							<Label for="sellerid">Seller ID:</Label>
							<Input
								type="text"
								name="sellerid"
								id="sellerid"
								value={this.state.sellerId}
								onChange={e => this.handleInputChange(e, "sellerId")}
							/>
						</FormGroup>
						<FormGroup>
							<Button
								color="success"
								onClick={this.processUpdate.bind(this)}
							>
								UPDATE USER TOKEN AND SELLER ID
							</Button>
						</FormGroup>
						{userTokenUpdateCompleted ? (
							<div style={{color: "green"}}>
								<b>User auth token and seller ID update success!</b>
							</div>
						) : (null)
						}
						{userTokenUpdateFailed ? (
							<div style={{color: "red"}}>
								<b>User auth token and seller ID update failed!</b>
							</div>
						) : (null)
						}
					</Col>
				</Row>
			</CardBody>
		</Card>
	</div>
    );
  }
}

export default connect(
  state => {
    return {
		userTokenUpdateCompleted: state.Admin.get('userTokenUpdateCompleted'),
		userTokenUpdateFailed: state.Admin.get('userTokenUpdateFailed'),
    };
  },
  {
	  userTokenUpdate,
  }
)(AdminUpdateUserToken);
