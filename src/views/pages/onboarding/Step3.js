import React, { Fragment } from 'react';
import TextField from '../template_editor/components/Form/TextField';
const Step3 = ({ minPrice, maxPrice, changeState }) => (
    <Fragment>
        <div className="inner-body">
            <p className="description">Set your guard rails by determining minimal and maximal price threshold</p>
            <div className="price-threshold">
                <TextField
                    hasLabel={false}
                    iconPosition="left"
                    icon="$"
                    inputXS={4}
                    inputGroup
                    value={minPrice}
                    removeInputColumn
                    name="minPrice"
                    handleChange={(name, value) => changeState(name, value)}
                />

                <hr className="divider" />
                
                <TextField
                    hasLabel={false}
                    iconPosition="left"
                    icon="$"
                    inputXS={4}
                    inputGroup
                    value={maxPrice}
                    removeInputColumn
                    name="maxPrice"
                    handleChange={(name, value) => changeState(name, value)}
                />
            </div>
        </div>
    </Fragment>
)

export default Step3;