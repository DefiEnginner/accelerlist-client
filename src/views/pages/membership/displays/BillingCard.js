import React, { Component } from 'react';
import {StripeProvider, Elements} from 'react-stripe-elements';
import PropTypes from 'prop-types';
import {
  Card,
  CardBody,
  CardHeader,
  Button
} from 'reactstrap';
import CardReplacementModal from '../modals/CardReplacementModal';

import {
  CardBodyContainer
} from './styles';
import {
  stripeAPIKey
} from '../../../../helpers/apiConfig';

class BillingCard extends Component {
  state = {
    modalReplaceCard: false
  }

  toggleModalReplaceCard = () => {
    this.setState({
      modalReplaceCard: !this.state.modalReplaceCard
    })
  }

	render() {
    const {
      source, updateMembershipBilling, showMembershipAlert,
      resetCardReplacementRequestStatus, cardReplacementRequestStatus
    } = this.props;
    const { modalReplaceCard } = this.state;

		return (
      <React.Fragment>
        <Card>
          <CardHeader><strong>Billing</strong></CardHeader>
          <CardBody>
            <CardBodyContainer>
              {
                source ? (
                  <React.Fragment>
                    <div className="text-center"><strong>Method: </strong>{`Your ${source.brand || ''} ending in ${source.last4 || ''}`}</div>
                    <div className="text-center" style={{marginTop: '20px'}}><strong>Card Expiration: </strong>{` ${source.exp_month || ''}/${source.exp_year || ''}`}</div>
                  </React.Fragment>
                ) : (
                  <div className="text-center"><strong>No information about credit card</strong></div>
                )
              }
              
            </CardBodyContainer>
            <hr />
            <div className="text-center">
              <Button
                className="float-center"
                color="primary"
                onClick={this.toggleModalReplaceCard}
              >
                Replace Card
              </Button>
            </div>
          </CardBody>
        </Card> 
        <StripeProvider apiKey={stripeAPIKey}>
          <Elements>
            <CardReplacementModal
              isOpen={modalReplaceCard}
              close={this.toggleModalReplaceCard}
              updateMembershipBilling={updateMembershipBilling}
              showMembershipAlert={showMembershipAlert}
              cardReplacementRequestStatus={cardReplacementRequestStatus}
              resetCardReplacementRequestStatus={resetCardReplacementRequestStatus}
            />
          </Elements>
        </StripeProvider>  
        
      </React.Fragment>
		);
	}
}

BillingCard.propTypes = {
  source: PropTypes.object,
  updateMembershipBilling: PropTypes.func.isRequired,
  showMembershipAlert: PropTypes.func.isRequired,
  cardReplacementRequestStatus: PropTypes.string,
  resetCardReplacementRequestStatus: PropTypes.func.isRequired,
};

export default BillingCard;