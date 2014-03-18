import React, { Component } from 'react';
import {injectStripe, CardNumberElement, CardCVCElement, CardExpiryElement} from 'react-stripe-elements';
import { PulseLoader } from 'react-spinners';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Col
} from 'reactstrap';

import {
  ModalBodyRow
} from './styles';

class CardReplacementModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isButtonDisabled: false,
      cardData: []
    }
  }


  confirmCardReplacement = () => {
    const { cardData } = this.state;
    const { showMembershipAlert } = this.props;
    if (this.checkCardDataErrors(cardData)) {
      showMembershipAlert(this.checkCardDataErrors(cardData))
    } else {
      this.setState({
        isButtonDisabled: true
      })
      this.props.stripe.createToken({name: 'Jenny Rosen'}).then(({token}) => {
        let authData = {
          stripeToken: token.id
        }
        this.props.updateMembershipBilling(authData);
      });
    }
  }

  handleChangeCardData = e => {
    const { cardData } = this.state;
    let buffCardData = null;
    const newCardData = e;
    if (cardData.length > 0){
      cardData.forEach((element, index) => {
        if (element.elementType === newCardData.elementType) {
          buffCardData = cardData;
          buffCardData[index] = newCardData;
        }
      })
    }
    if (!buffCardData) {
      buffCardData = cardData;
      buffCardData.push(newCardData);
    }
    this.setState({
      cardData: buffCardData
    })
  }

  checkAllCardDataFieldAreFilled = cardData => {
    let fieldIsEmpty = false;
    if (cardData.length === 3){
      cardData.forEach(element => {
        if (element.empty === true) {
          fieldIsEmpty = true;
        };
      });
    } else {
      fieldIsEmpty = true;
    }
    return fieldIsEmpty;
  }

  checkCardDataErrors = cardData => {
    let error = null;
    if (cardData.length > 0){
      cardData.forEach(element => {
        if (element.error) {
          error = element.error;
        };
      });
    } else {
      error = null;
    }
    return error;
  }
  clearStatusAndCloseModal = () => {
    this.props.resetCardReplacementRequestStatus();
    this.setState({
      isButtonDisabled: false
    })
    this.props.close();
  }
  render() {
    const { 
      isOpen,
      close,
      cardReplacementRequestStatus
    } = this.props;
    const { isButtonDisabled, cardData } = this.state;

    if (cardReplacementRequestStatus === "complete"){
      this.clearStatusAndCloseModal();
    }
    return (
      <React.Fragment>

        <Modal isOpen={isOpen}>
          <ModalHeader style={{ padding: '40px 30px', backgroundColor: '#f7f9fa'}}>
            <div><strong>Replace Card</strong></div>
            <small>Want to update your card information? Enter your new details below.</small>
          </ModalHeader>
          <ModalBody>
            <ModalBodyRow>
              <Col xs="5">
                <strong>Card Number</strong>
              </Col>
              <Col xs="7">
                <div style={{ maxWidth: '160px'}}>
                  <CardNumberElement
                    onChange={this.handleChangeCardData}
                    className="form-control text-center"
                  />
                </div>
              </Col>
            </ModalBodyRow>
            <ModalBodyRow>
              <Col xs="5">
                <strong>CVC</strong>
              </Col>
              <Col xs="7">
                <div style={{ maxWidth: '60px'}}>
                  <CardCVCElement
                    onChange={this.handleChangeCardData}
                    className="form-control text-center"
                  />
                </div>
              </Col>
            </ModalBodyRow>
            <ModalBodyRow>
              <Col xs="5">
                <strong>Expiration (MM/YYYY)</strong>
              </Col>
              <Col xs="7">
                <div style={{ maxWidth: '80px'}}>
                  <CardExpiryElement
                    onChange={this.handleChangeCardData}
                    className="form-control text-center"
                  />
                </div>
              </Col>
            </ModalBodyRow>
          </ModalBody>
          <ModalFooter style={{ backgroundColor: '#f7f9fa'}}>
            <Button color="secondary" onClick={close}>Cancel</Button>{' '}
            <Button
              color="primary"
              disabled={ isButtonDisabled || this.checkAllCardDataFieldAreFilled(cardData) }
              onClick={this.confirmCardReplacement}
              style={{width: '250px'}}
            >{
              cardReplacementRequestStatus === "execution" ?
              (
                <div className='sweet-loading'>
                  <PulseLoader
                    sizeUnit={"px"}
                    size={9}
                    color={'white'}
                    loading={true}
                  />
                </div>
              ) : 'Confirm Card Replacement'
            }
            </Button>
          </ModalFooter>
        </Modal>
      </React.Fragment>
    );
  }
}

CardReplacementModal.propTypes = {
  close: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  updateMembershipBilling: PropTypes.func.isRequired,
  showMembershipAlert: PropTypes.func.isRequired,
  cardReplacementRequestStatus: PropTypes.string,
  resetCardReplacementRequestStatus: PropTypes.func.isRequired
}
export default injectStripe(CardReplacementModal);
