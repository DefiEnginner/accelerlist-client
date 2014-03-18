import React from "react";
import PropTypes from "prop-types";
import NoteButtonPopover from "../../../../shared/NoteButtonPopover";

class NoteSelectorElement extends React.Component {
  
  render() {
    const { index, title, options, optionConfig } = this.props;
    return (
        <div className="notes-box">
            <h4 className="notes-box-header">{title}</h4>
            <div className="notes-item-group">
                {
                    !!options && options.map((opt, i) => (
                        <NoteButtonPopover
                          key={`note_${index}_${i}`}
                          content={opt[optionConfig['value']]}
                          id={`${index}_${i}`}
                          buttonText={opt[optionConfig['label']]}
                          buttonStyle="btn btn-outline-primary btn-block btn-notes-item"
                          action={() => this.props.onChangeNote(title, opt[optionConfig['value']])}
                        />
                    ))
                }
            </div>
        </div>
    );
  }
}

NoteSelectorElement.propTypes = {
    optionConfig: PropTypes.object.isRequired
};

NoteSelectorElement.defaultProps = {
    optionConfig: {
        value: "value",
        label: "label"
    }
};

export default NoteSelectorElement;
