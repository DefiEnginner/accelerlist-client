import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Badge
} from 'reactstrap';
import { 
  digitСonversion,
  momentDateTimeToLocalFormatConversion,
  momentDateIsValid
 } from "../../../..//helpers/utility";

import {
  CardBodyContainer
} from './styles';

class PlanCard extends Component {

  handleCancleMembership = () => {
    window.raaft('startCancelFlow', {
        subscriptionId: this.props.subscription.id
      });
  }
  secondsToISOString = (seconds) => {
    return seconds * 1000;
  }
	render() {
    const { subscription } = this.props;
    const { plan, status, current_period_end } = subscription;
    let planAmount = null;

    if (subscription && subscription.length !== 0 && plan){
      planAmount = (plan.amount / 100).toFixed(2);
    }

		return (
      <Card>
        <CardHeader><strong>Plan</strong></CardHeader>
        <CardBody>
          <CardBodyContainer>
            <div className="text-center"><strong>Current Plan: </strong></div>
            <div className="text-center">
              {`(${digitСonversion(
                    planAmount,
                    "currency",
                    "USD"
                  ) || 'N/A'}/mo)`}
              {' '}
              {status === 'trialing' && <Badge color="primary">FREE TRIAL</Badge>}
            </div>
            <div className="text-center" style={{marginTop: '20px'}}>
              <strong>Ends: </strong>
              {
                momentDateIsValid(this.secondsToISOString(current_period_end))
                ? momentDateTimeToLocalFormatConversion(this.secondsToISOString(current_period_end))
                : "N/A"
              }
            </div>
            {
              status === 'trialing' &&
              <div style={{marginTop: '20px'}}>
                <strong>{`Note: `}</strong>{` Your are currently in your trial period, and your card will not be charged until the end time above. 
                Your subscription will be automatically renewed when the current subscription ends.`}
              </div>
            }
          </CardBodyContainer>
          <hr />
          <div className="text-center">
            <Button
              className="float-center"
              color="danger"
              onClick={this.handleCancleMembership}
            >
              Cancel Membership
            </Button>
          </div>
        </CardBody>
      </Card>   
		);
	}
}

PlanCard.propTypes = {
  subscription: PropTypes.object.isRequired
};

export default PlanCard;