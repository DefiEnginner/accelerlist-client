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
	searchUsersPerMarketplace } = adminActions;

class AdminUsersPerMarketplace extends Component {
    constructor (props) {
        super(props);
		this.state = {
			showUserData: false,
		};
    }

	componentDidMount(){
		this.props.searchUsersPerMarketplace();
	}

	displayRow(data){
		return (
			<Row>
				<Col>
					{ data['marketplace_id'] }
				</Col>
				<Col>
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
			<h4>Users per marketplace</h4>
			<CardBody>
				{this.props.usersPerMarketplace ? (
						this.props.usersPerMarketplace.map(row => (
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
		usersPerMarketplace: state.Admin.get('usersPerMarketplace'),
    };
  },
  {
	  searchUsersPerMarketplace
  }
)(AdminUsersPerMarketplace);
