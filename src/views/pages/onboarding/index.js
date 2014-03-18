import React, { Fragment } from 'react';
import Modal from '../../../shared/components/Modal';
import IconChevronRight from 'react-icons/lib/md/chevron-right';
import IconChevronLeft from 'react-icons/lib/md/chevron-left';
import IconCalendar from 'react-icons/lib/go/calendar';

import '../../../app.css';
import 'rc-time-picker/assets/index.css';

import Step1 from'./Step1';
import Step2 from'./Step2';
import Step3 from'./Step3';
import Step4 from'./Step4';
import Step5 from'./Step5';
import moment from 'moment';
class Onboarding extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            navMini: false,
            step: 0,
            titles: [
                "What’s your goal?",
                "Who’s Your Target Audience?",
                "Set Your Guard Rails",
                "Save Your Template & Schedule"
            ],
            onboardingModalOpen: true,
            modalClass: 'modalRapid',
            goal: "",
            targetAudiences: [],
            minPrice: 0,
            maxPrice: 0,
            scheduleTime: moment(),
            templateName: 'My Template 1'
            
        }
    }

    
    selectAudience = (e) => {
        const el = e.target.closest('.audience-box');
        const audienceId = el.dataset.id;
        const currentAudiences = this.state.targetAudiences;

        if(!el.classList.contains('selected')) {
            currentAudiences.push(audienceId);
            el.classList.add('selected');
        } else {
            const idx = currentAudiences.indexOf(audienceId);
            if(idx > -1) currentAudiences.splice(idx, 1);
            el.classList.remove('selected');
        }

        this.setState({ targetAudiences: currentAudiences });

        
    }

    closeModal = () => this.setState({ onboardingModalOpen: false });
    nextStep = () => {
        const { step } = this.state;
        this.setState({ step: step + 1 });
    }
    previousStep = () => {
        const { step } = this.state;
        if(step > 0) this.setState({ step: step - 1 });
    }
    submitForm = () => {
        const { templateName, scheduleTime, minPrice, maxPrice, goal, targetAudiences } = this.state;
        const onboardingData = {
            templateName,
            scheduleTime: scheduleTime.format("h:mm a"),
            minPrice,
            maxPrice,
            goal,
            targetAudiences
        };
        console.log("DaTA",onboardingData);
        this.nextStep();
    }
    changeState = (name, value) => this.setState({ [name]: value });
    render() {
        const { step, titles, onboardingModalOpen, goal, targetAudiences, minPrice, maxPrice, templateName, scheduleTime } = this.state
        let actions = [
            { colour: "default", className: "btn btn-outline-secondary", onClick: () => this.previousStep(), label: <Fragment> <span className="addon"><IconChevronLeft size="36" color="#000" /></span><span>BACK</span></Fragment> },
            { colour: "primary", className: "btn btn-primary", onClick: () => this.nextStep(), label: <Fragment><span>NEXT</span> <span className="addon"><IconChevronRight size="36" color="#fff" /></span></Fragment> }
        ];

        if(step === 3) actions[1] = { colour: "primary", className: "btn btn-primary", onClick: () => this.submitForm(), label: <Fragment><span>SAVE &amp; SCHEDULE</span> <span className="addon"><IconCalendar size="36" color="#fff" /></span></Fragment> }
        if(step === 4) actions = [
            { colour: "primary", className: "btn btn-primary", onClick: () => this.changeState("onboardingModalOpen", false), label: <Fragment><span>SEE MY SCHEDULES</span> <span className="addon"><IconCalendar size="36" color="#fff" /></span></Fragment> }
        ];
            
        return (
            <div className="app-wrapper">
                <Modal
                    className={`onboarding ` + this.state.modalClass}
                    heading={titles[step]}
                    onClose={false}
                    open={onboardingModalOpen}
                    actions={actions}
                    bodyClassName="d-flex align-items-center"
                >
                    { step === 0 ? <Step1 changeState={this.changeState} goal={goal} />
                    : step === 1 ? <Step2 selectAudience={this.selectAudience} targetAudiences={targetAudiences} />
                    : step === 2 ? <Step3 changeState={this.changeState} minPrice={minPrice} maxPrice={maxPrice} />
                    : step === 3 ? <Step4 changeState={this.changeState} templateName={templateName} scheduleTime={scheduleTime} />
                    : step === 4 ?  <Step5 templateName={templateName} scheduleTime={scheduleTime} />
                    : <div></div>
                    }
                </Modal>
              
            </div>
        )
    }
}
export default Onboarding;