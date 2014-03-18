import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import authAction from "../../../redux/auth/actions";

import { logo } from "../../../assets/images";
import "../style.css";

const { updatePassword } = authAction;

class ResetPasssword extends Component {
  state = {
    password: "",
    password_2: ""
  };

  handleSubmit = (e, formType) => {
    e.preventDefault();

    this.props.updatePassword({
      ...this.state,
      token_str: (window.location.search.match(
        new RegExp("[?&]token=([^&]+)")
      ) || ["", null])[1]
    });
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
          <p className="title">SUCCESS</p>
          <p className="subtitle">{resetMessage}</p>
          <Link to="/signin" className="button green">
            SIGN IN
          </Link>
        </div>
      );
    } else {
      return (
        <div className="f-card">
          <p className="title">RESET PASSWORD</p>
          <p className="subtitle">Please enter new password</p>
          <div className="f-container">
            <label htmlFor="#">New Password</label>
            <div className="f-row">
              <input
                type="password"
                placeholder="new password"
                name="password"
                value={this.state.emailOrMobile}
                onChange={e => this.handleInputChange("password", e)}
              />
              <i className="fas fa-lock" />
            </div>
            <p className="f-text">* your new password</p>
          </div>
          <div className="f-container">
            <label htmlFor="#">Confirm Password</label>
            <div className="f-row">
              <input
                type="password"
                placeholder="new passsword"
                name="password_2"
                value={this.state.emailOrMobile}
                onChange={e => this.handleInputChange("password_2", e)}
              />
              <i className="fas fa-lock" />
            </div>
            <p className="f-text">* re-enter new password</p>
          </div>
          <button
            style={{ width: "100%" }}
            type="submit"
            className="button green"
          >
            UPDATE PASSWORD
          </button>
        </div>
      );
    }
  }
}

export default connect(
  state => ({
    passwordResetMessage: state.Auth.get("passwordResetMessage")
  }),
  { updatePassword }
)(ResetPasssword);
