import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import PropTypes from "prop-types";
import CustomSKUSelector from '../../../../shared/components/customSKUSelector';


class CustomSKUTemplateModal extends Component {
  render() {
    const { isOpen, close } = this.props;
    const listingDefaults = {
      should_use_custom_sku_template: isOpen,
      sku_prefix: this.props.skuPrefix
    }
    return (
      <Modal isOpen={isOpen} toggle={close} size="lg">
        <ModalHeader>
          <strong>Custom SKU Creator</strong>
        </ModalHeader>
        <ModalBody>
          {!!isOpen && <CustomSKUSelector
            isOpen={isOpen}
            listingDefaults={listingDefaults}
            onSaveListingDefaults={this.props.onSaveListingDefaults}
          />}
		  <span style={{ color: 'red' }}>
				<b>
				  * Any changes made here will not apply to your next batch. More premanent custom skus can be made in the settings area.
				</b>
		  </span>
        </ModalBody>
      </Modal>
    );
  }
}

CustomSKUTemplateModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired
};

export default CustomSKUTemplateModal;
