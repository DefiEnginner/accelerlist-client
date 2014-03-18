import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { amazonLogoSmall } from '../../../assets/images';
import styled from 'styled-components';

class AlertBox extends Component {
  render() {
    return (
      <StyledModal isOpen={this.props.isOpen} toggle={this.props.toggle}>
        <ModalHeader toggle={this.props.toggle} />
        <ModalBody>
          <div className="message-group">
            <span className="message-label"><img src={amazonLogoSmall} alt="Amazon Logo" /> Amazon says:</span>
            <p className="message text-danger">{ this.props.amazonMessage }</p>
          </div>
          <div className="message-group">
            <span className="message-label">We say:</span>
            <p className="message text-danger">{ this.props.message }</p>
            <div className="articles">
              <h4 className="heading">Helpful article:</h4>
              <ul className="list-unstyled">
				<li>
					<a
						target="_blank"
						rel="noopener noreferrer"
						href={ this.props.url }
					>{ this.props.url }</a>
				</li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.props.toggle}>CLOSE</Button>
        </ModalFooter>
      </StyledModal>
    );
  }
}

AlertBox.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  amazonMessage: PropTypes.string.isRequired,
  mesage: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
};

export default AlertBox;

const StyledModal = styled(Modal)`
  .modal-header {
    position: absolute;
    right: 0;
    border-bottom: 0;
    z-index: 9;
  }

  .modal-body {
    padding: 0;
  }

  .message-group {
    padding-bottom: .3rem;
    padding-left: 1rem;
    padding-right: 1rem;
    border-bottom: 1px solid rgba(133, 140, 130, .15);
  }

  .message-label {
    display: inline-block;
    border-bottom-right-radius: 25px;
    margin-bottom: 1.3rem;
    margin-left: -1rem;
    padding: .6rem 1rem .6rem .6rem;
    font-weight: 600;
    color: #858C82;
    background-color: rgba(206, 206, 206, .22);
  }

  .message {
    font-weight: 500;
  }

  .articles {
    margin-top: 2.5rem;

    .heading {
      font-size: 1rem;
      color: #858C82;
    }
  }

  .modal-footer {
    border-top: 0;
  }
`;
