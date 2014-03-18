import React from "react";
class ConditionSelector extends React.Component {

  render() {
    const { name, conditions, selectedCondition, onChangeCondition, buttonColor } = this.props;
    return (
      <div className="form-group">
          <label className="control-label">Condition</label>
          <div className="btn-condition-group mb-4">
              {
				  !!conditions && conditions.map(
					(condition, i) =>
						<button
							key={`condition_notes_${condition.value}_${i}`}
							onClick={() => onChangeCondition(name, condition.value)}
							type="button"
							className={`btn btn-outline-${buttonColor} btn-condition ${selectedCondition === condition.value ? 'selected' : ''}`}
							data-toggle="tooltip" data-title={condition.title}>{condition.label}
						</button>
				  )
              }
          </div>
      </div>
    );
  }
}

ConditionSelector.propTypes = {
};

export default ConditionSelector;
