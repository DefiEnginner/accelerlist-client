import React from "react";
import NoteSelectorElement from './NoteSelectorElement';
import _ from 'lodash';

class NoteSelector extends React.Component {
  
  render() {
    const { options, category, onChangeNote } = this.props;
    let newOptions = _.cloneDeep(options);
    if(category !== "All Categories") newOptions = options.filter(o => o.category === category);
    newOptions = _.chain(newOptions)
      .groupBy("subcategory")
      .toPairs()
      .sort()
      .value();
    const optionConfig = {
      label: "nickname",
      value: "note_text"
    };
    let renderOptions = [];
    _.map(newOptions, (option, i) => {
      renderOptions.push(<NoteSelectorElement
        key={`NoteSelectorElement_${i}`}
        index={`${i}`}
        title={option[0]}
        options={option[1]}
        optionConfig={optionConfig}
        onChangeNote={onChangeNote}
      />);
    })
    return (
      <div className="form-group">
        <label>Choose suitable notes</label>
        <div className="horizontal-scrollable">
            <div className="notes-box-group">
              {renderOptions}
            </div>
        </div>
        
    </div>
    );
  }
}

NoteSelector.propTypes = {
};

export default NoteSelector;
