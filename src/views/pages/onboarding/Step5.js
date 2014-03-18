import React, { Fragment } from 'react';
import IconCheckCircle from 'react-icons/lib/io/ios-checkmark-outline';
const Step5 = ({ templateName, scheduleTime, changeState }) => (
  <Fragment>
        <div className="inner-body">
            <div className="text-center">
                <IconCheckCircle size="200" color="#FF9900" />
                <h4 className="modal-title mb-3">All Done!</h4>
            </div>
            <p className="description">Awesome! You have scheduled <strong>{templateName} (Win BB, Competitive)</strong> at <strong>{`${scheduleTime.format("h:mm a")} PST`}</strong>. 
            The schedule will run in Test Mode. You can turn it to live by visiting schedule page.</p>
        </div>
    </Fragment>
)

export default Step5;