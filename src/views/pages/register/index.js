import React, { Component } from "react";
import { StripeProvider, Elements } from "react-stripe-elements";

import Form from "./form";

import "../style.css";

import {
  stripeAPIKey
} from '../../../helpers/apiConfig';

const registrationPlans = [
  {
    plan_name: "default",
    billing_cycle_length: "monthly",
    plan_price: 34,
    trial_days: 14
  },
  {
    plan_name: "monthly",
    billing_cycle_length: "monthly",
    plan_price: 34,
    trial_days: 14
  },
  {
    plan_name: "annual",
    billing_cycle_length: "annual",
    plan_price: 340,
    trial_days: 14
  },
  {
    plan_name: "jimpickins",
    billing_cycle_length: "monthly",
    plan_price: 34,
    trial_days: 21
  }
];

class Register extends Component {
  state = {
    registrationPlanName: "default",
    billing_cycle_length: null,
    plan_price: null,
    trial_days: null
  };

  componentDidMount() {
    const { offer } = this.props.match.params;

    if (offer) {
      window.addEventListener('load', () => {
        let _fprom = window._fprom||[];
        window._fprom = _fprom;
        _fprom.push(["url_tracking", true]);
        if (window.$FPROM) {
          window.$FPROM.trackVisitor({url_tracking: true}, (error) => console.log(error))
        }
      });
    }
  }

  UNSAFE_componentWillMount() {
    const { offer } = this.props.match.params;
    const indexOfSelectedPlan = registrationPlans.findIndex(el => el.plan_name === offer);
    if (
      offer &&
      indexOfSelectedPlan !== -1 &&
      this.state.registrationPlanName === "default"
    ) {
      this.setState({
        ...registrationPlans[indexOfSelectedPlan]
      });
    } else {
      this.setState({
        ...registrationPlans[0]
      });
    }
  }

  render() {
    const { plan_price, trial_days, billing_cycle_length, plan_name } = this.state;
    return (
      <div className="view">
        <StripeProvider apiKey={stripeAPIKey}>
          <Elements>
            <Form billing_cycle_length={billing_cycle_length} plan_price={plan_price} trial_days={trial_days} plan_name={plan_name} />
          </Elements>
        </StripeProvider>
      </div>
    );
  }
}

export default Register;
