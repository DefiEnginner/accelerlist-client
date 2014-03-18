import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input, Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import { checkSku, fnskuLabel } from '../../../../assets/images';
import {  MdCheckCircle as IconCheck } from 'react-icons/lib/md';

class SkuLabelConfirm extends Component {
	state = {
		confirmed: false,
	}

	Change = () => {
		const { confirmed } = this.state;
		this.setState({ confirmed: !confirmed });
	}

	Understand = () => {
		const { userData } = this.props;
		if(userData){
			let ud = userData;
			ud.settings["batch_sku_label_warning"] = "true";
			this.props.updateUserData(ud);
			let data = {batch_sku_label_warning: "true"};
			this.props.updateUserSettings(data);
		}
		this.props.toggle();
	}

  render() {
    return (
		<Modal
			isOpen={this.props.isOpen}
			toggle={this.props.toggle}
			backdrop="static"
			keyboard={false}
			size="lg"
		>
			<ModalHeader>Attention, check custom SKU and printer</ModalHeader>
	        <ModalBody>
						<strong className="text-danger">Attention:</strong> It’s very important to double check your custom sku and your first printed product label <strong>BEFORE you scan and list too many items</strong>. Please double check that both are working as intended and then safely list your 2nd item in the batch.
						<div className="d-flex justify-content-around text-center mt-3">
							<div>
								<h4 className="h6 mb-2"><IconCheck size="20" className="text-success" /> Check your SKU</h4>
								<img src={checkSku} alt="Check SKU" />
							</div>
							<div>
								<h4 className="h6 mb-2"><IconCheck size="20" className="text-success" /> Check first printed label</h4>
								<img src={fnskuLabel} alt="Check FNSKU Label" />
							</div>
						</div>
	        </ModalBody>
		    <ModalFooter>
				<div>
					<Input
						type="checkbox"
						checked={this.state.confirmed}
						onChange={this.Change}
					/> &nbsp;
					<span>Confirm reading instructions</span>
				</div>
				<Button
					color="success"
					onClick={this.Understand}
					disabled={!this.state.confirmed}
				>I understand</Button>
		    </ModalFooter>
      </Modal>
    );
  }
}

SkuLabelConfirm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  updateUserData: PropTypes.func.isRequired,
};

export default SkuLabelConfirm;

