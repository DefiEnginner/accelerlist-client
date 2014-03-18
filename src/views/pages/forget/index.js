import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import authAction from "../../../redux/auth/actions";

import { logo } from "../../../assets/images";
import "../style.css";

const { resetPassword } = authAction;

class ForgotPasssword extends Component {
  state = {
    emailOrMobile: "",
    password: ""
  };

  handleSubmit = (e, formType) => {
    e.preventDefault();
    this.props.resetPassword(this.state.emailOrMobile);
  };

  handleInputChange = (inputType, e) => {
    let change = {};
    change[inputType] = e.target.value;
    this.setState(change);
  };

  render() {
    return (
      <div className="view">
        <form className="main-form" onSubmit={this.handleSubmit}>
          <div className="container">
            <div className="row">
              <div className="col-6 offset-md-3">
                <div className="logo">
                  <img src={logo} alt="logo" />
                </div>
                {this.renderForm()}
              </div>
            </div>
            <div className="copyright">
              2018 Copyright <span>AccelerList</span>.
            </div>
          </div>
        </form>
      </div>
    );
  }

  renderForm() {
    const resetMessage = this.props.passwordResetMessage;

    if (resetMessage) {
      return (
        <div className="f-card">
          <p className="title">Forgot Password?</p>
          <p className="subtitle">{resetMessage}</p>
        </div>
      );
    } else {
      return (
        <div className="f-card">
          <p className="title">Forgot Password?</p>
          <p className="subtitle">
            {"Enter your email address or mobile number and we'll send you the instructions for resetting the password."}
          </p>
          <div className="f-container">
            <label htmlFor="#">Use your email or mobile number (with country code)</label>
            <div className="f-row">
              <input
                type="text"
                placeholder="email or mobile"
                name="emailOrMobile"
                value={this.state.emailOrMobile}
                onChange={e => this.handleInputChange("emailOrMobile", e)}
              />
              <i className="far fa-user" />
            </div>
            <p className="f-text">
              *The email OR mobile number you used to sign up for AccelerList.
            </p>
          </div>
          <button
            style={{ width: "100%" }}
            type="submit"
            className="button green"
          >
            RESET
          </button>
          <Link to="/register" className="new-account">
            {"Don't have an account?"}
          </Link>
          <Link to="/register" className="button dark">
            REGISTER
          </Link>
        </div>
      );
    }
  }
}

export default connect(
  state => ({
    passwordResetMessage: state.Auth.get("passwordResetMessage")
  }),
  { resetPassword }
)(ForgotPasssword);
