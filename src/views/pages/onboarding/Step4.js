import TimePicker from 'rc-time-picker';
import React, { Fragment } from 'react';
import TextField from '../template_editor/components/Form/TextField';
const Step4 = ({ templateName, scheduleTime, changeState }) => (
  <Fragment>
        <div className="inner-body">
            <div className="form-group">
                <p className="description">We have preconfigure all the settings based on your previous selections. Now let’s save it as template and schedule it.</p>
                <div className="text-center">
                    <TextField
                        className="form-control"
                        removeInputColumn={false}
                        name="templateName"
                        value={templateName}
                        handleChange={(name, value) => changeState(name, value)}
                        style={{ margin: "0 auto", width: "55%" }}
                        hasLabel={false}
                    />
                </div>
            </div>

            <div className="form-group mb-0">
                <p className="description">When do you want to schedule this template?</p>
                <TimePicker 
                    showSecond={false} 
                    format={'h:mm a'} 
                    defaultValue={scheduleTime} 
                    onChange={(value) => changeState("schduleTime", value)}
                    use12Hours
                    id={"time-input"}
                    minuteStep={15}
                    placement={"bottomRight"}
                    popupClassName={"custom-timepicker-popup"}
                />
            </div>
        </div>
    </Fragment>
)

export default Step4;