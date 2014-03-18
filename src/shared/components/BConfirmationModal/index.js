import React from "react";
import {
  Card,
  CardBody,
  CardTitle,
  Button,
  Row,
  Col,
} from "reactstrap";
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class BConfirmationModal extends React.Component {
	render() {
		return (
	  <div>
        <Modal
          isOpen={this.props.isOpen}
          onRequestClose={this.props.closeModal}
		  style={customStyles}
        >
		<Card>
			<CardBody>
				<Row>
					<Col>
						<div className="text-center">
							<CardTitle>{ this.props.modalTitle }</CardTitle>
							<hr />
							{ this.props.modalText }
							<br /><hr /><br />
							<Button
								color={ this.props.buttonColor }
								onClick={ this.props.buttonAction }
							>
								{ this.props.buttonText }
							</Button>
						</div>
					</Col>
				</Row>
			</CardBody>
		</Card>
        </Modal>
      </div>
		);
	}
}

Modal.setAppElement('#root');

export default BConfirmationModal;
