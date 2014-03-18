/**
*
* SubmitButton
*
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import SubmitButton from "../../../views/pages/template_editor/components/Form/SubmitButton";

class CustomModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  
    render() {
        const { actions, open, keyPrefix, bodyClassName, heading, ...props } = this.props;

        console.log()
        return (
            <Modal isOpen={open} toggle={this.props.onClose} {...props}>
                <ModalHeader toggle={this.props.onClose}>
                    {heading}
                </ModalHeader>

                <ModalBody className={bodyClassName}>
                        {this.props.children}
                </ModalBody>
                <ModalFooter>
                    {
                        actions.map((action, i) => {
                            return <SubmitButton key={`${keyPrefix}_action_${i}`} onSubmit={() => action.onClick()} className={action.className} colour={action.colour}>
                                {action.label}
                            </SubmitButton>
                        })
                    }
                </ModalFooter>
            </Modal>
        );
    }
}

CustomModal.propTypes = {
  onClose: PropTypes.func.isRequired,

};

CustomModal.defaultProps = {
    actions: [],
    bodyClassName: "",
}
export default CustomModal;
