import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import {
    logo,
} from '../../../assets/images';
import './style.css';


class ThankYou extends Component {
    render() {
        return (
            <div className="view">
                <form className="main-form">
                    <div className="container">
                        <div className="row">
                            <div className="col-6 offset-md-3">
                                <div className="logo"><img src={logo} alt="logo" /></div>
                                <div className="f-card">
                                    <p className="title">Thank You</p>
									<p className="subtitle">Thanks you for joining AccelerList, please check your email (spam folder too <span role="img" aria-label="smile">😬</span>) to activate your subscription and log in.</p>
                                    <div className="f-container">
									</div>
									<Link
										to="/"
										className="button dark"
									>Click here to log in</Link>
                                </div>
                            </div>
                        </div>
                        <div className="copyright">
                            2018 Copyright <span>AccelerList</span>.
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}
export default ThankYou;
