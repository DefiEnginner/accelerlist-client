import React from "react";

const Toggle = ({ label, checked, onText, offText, onChange }) => {
    return (
        <div className={`form-group d-flex justify-content-between align-items-center switch-${onText}-${offText}`}>
            <label className="m-0">{label}</label>
            <label className="switch-checkbox">
                <input type="checkbox" checked={checked} onChange={onChange} />
                <i data-swon-text={onText !== undefined ? onText : 'ON'} data-swoff-text={offText !== undefined ? offText : 'OFF'}></i>
            </label>
        </div>
    )
}

export default Toggle;