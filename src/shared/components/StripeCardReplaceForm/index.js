import React from "react";
import {
  InputGroup,
  InputGroupAddon,
  Button,
  Row,
  Col,
} from "reactstrap";
import { connect } from "react-redux";
import {
	injectStripe,
	CardNumberElement,
	CardCVCElement,
	CardExpiryElement } from 'react-stripe-elements';
import FaCreditCard from "react-icons/lib/fa/credit-card";
import FaCalendar from "react-icons/lib/fa/calendar";
import FaLock from "react-icons/lib/fa/lock";
import membershipActions from "../../../redux/membership/actions";

const { cardReplacementMembership } = membershipActions;


class StripeCardReplaceForm extends React.Component {
  handleSubmit = (ev) => {
    ev.preventDefault();
    if (this.props.stripe) {
      this.props.stripe
        .createToken()
		.then((payload) => {
			const token = payload.token.id
			this.props.cardReplacementMembership({stripeToken: token});
		});
    } else {
      console.log("Stripe.js hasn't loaded yet.");
    }
  };

	showReplacementMessage = (color, message) => {
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
    return (
      <form onSubmit={this.handleSubmit}>
		<Row>
			<Col>
				 <InputGroup>
					<InputGroupAddon className="input-group-text" addonType="prepend">
						<FaCreditCard />
					</InputGroupAddon>
					<CardNumberElement
						placeholder="Card Number"
						type="text"
						defaultValue=""
						className="form-control"
					/>
				</InputGroup>
			</Col>
		</Row>
		<br />
		<Row>
			<Col>
				 <InputGroup>
					<InputGroupAddon className="input-group-text" addonType="prepend">
						<FaCalendar />
					</InputGroupAddon>
					<CardExpiryElement
						placeholder="MM/YY"
						type="text"
						defaultValue=""
						className="form-control"
					/>
				</InputGroup>
			</Col>
			<Col>
				 <InputGroup>
					<InputGroupAddon className="input-group-text" addonType="prepend">
						<FaLock />
					</InputGroupAddon>
			        <CardCVCElement
						placeholder="CVC"
						type="text"
						defaultValue=""
						className="form-control"
					/>
				</InputGroup>
			</Col>
		</Row>
		<br />
		<Row>
			<Col>
				<Button
					color="success"
					disabled={this.props.is_replacing_card}
				>
					UPDATE PAYMENT INFO
				</Button>
			</Col>
		</Row>
		{this.props.show_card_replaced ? (
			this.showReplacementMessage(
				"green",
				"Card replace success!")
		) : (null)
		}
		{this.props.show_card_replace_failed ? (
			this.showReplacementMessage(
				"red",
				"Card replace failed!")
		) : (null)
		}
	  </form>
    );
  }
}
export default connect(
	state => {
		return{
			show_card_replaced: state.Membership.get("show_card_replaced"),
			show_card_replace_failed: state.Membership.get("show_card_replace_failed"),
			is_replacing_card: state.Membership.get("is_replacing_card"),
		};
	},
	{
		cardReplacementMembership,
	}
)(injectStripe(StripeCardReplaceForm));
