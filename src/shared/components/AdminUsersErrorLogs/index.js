import React, { Component } from "react";
import {
  Card,
  CardBody,
  Col,
  Row,
} from "reactstrap";
import { connect } from "react-redux";
import adminActions from "../../../redux/admin/actions";

const {
	searchUsersErrorLogs } = adminActions;

class AdminUsersErrorLogs extends Component {
    constructor (props) {
        super(props);
		this.state = {
			showUserData: false,
		};
    }

	componentDidMount(){
		this.props.searchUsersErrorLogs();
	}

	displayRow(data){
		return (
			<Row>
				<Col xs="10">
					{ data['error_id'] }
				</Col>
				<Col xs="2">
					{ data['count'] }
				</Col>
			</Row>
		)
	}

  render() {
    return (
		<div>
		<Card>
			<br />
			<h4>User error messages by type, in last 30 days</h4>
			<CardBody>
				{this.props.usersErrorLogs ? (
						this.props.usersErrorLogs.map(row => (
							this.displayRow(row)))
					) : (null)
				}
			</CardBody>
		</Card>
	</div>
    );
  }
}

export default connect(
  state => {
    return {
		usersErrorLogs: state.Admin.get('usersErrorLogs'),
    };
  },
  {
	  searchUsersErrorLogs
  }
)(AdminUsersErrorLogs);
