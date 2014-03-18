// CheckoutForm.js
import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router";
import {
  injectStripe,
  CardNumberElement,
  CardCVCElement,
  CardExpiryElement
} from "react-stripe-elements";
import TermsConditions from "../../../shared/components/TermsConditions";
import { Alert } from "reactstrap";
import { digitСonversion } from "../../../helpers/utility";

import authAction from "../../../redux/auth/actions";

import { logo } from "../../../assets/images";
import "./style.css";

const { signup } = authAction;

class CheckoutForm extends React.Component {
  state = {
    username: "",
    password: "",
    verifyPassword: "",
    email: "",
    businessName: "",
    acceptTnc: false,
    registerWithoutAccept: false,
    registerOnGoing: false,
    errorUsername: "",
    errorPassword: "",
    errorEmail: "",
    errorVerifyPassword: "",
    errorCreditCard: "",
    formValid: null,
    creditInfoEmpty: true
  };

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.userEmail) {
      this.setState({
        email: this.props.location.state.userEmail
      });
    }
  }

  validateUsername = username => {
    if (username === "") {
      this.setState({ errorUsername: "Username is required" });
      return false;
    } else {
      this.setState({ errorUsername: "" });
      return true;
    }
  };

  validatePassword = (password, verifyPassword) => {
    if (password === "") {
      this.setState({ errorPassword: "Password is required" });
      return false;
    } else if (verifyPassword === "") {
      this.setState({ errorVerifyPassword: "Confirm password is required" });
      return false;
    } else {
      this.setState({ errorPassword: "", errorVerifyPassword: "" });
      return true;
    }
  };

  validateVerifyPassword = (password, verifyPassword) => {
    if (password !== verifyPassword) {
      this.setState({
        errorPassword: "",
        errorVerifyPassword: "Your passwords are not the same"
      });
      return false;
    } else {
      this.setState({ errorPassword: "", errorVerifyPassword: "" });
      return true;
    }
  };

  validateEmail = email => {
    const regexEmailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if (email === "") {
      this.setState({ errorEmail: "Email is required" });
      return false;
    } else if (!regexEmailValidation.test(String(email).toLowerCase())) {
      this.setState({ errorEmail: "Please enter a valid email address" });
      return false;
    } else {
      this.setState({ errorEmail: "" });
      return true;
    }
  };

  validateCreditNumber = creditNumber => {
    this.setState({ creditInfoEmpty: creditNumber });
    if (creditNumber) {
      this.setState({ errorCreditCard: "Credit card information is required" });
    } else {
      this.setState({ errorCreditCard: "" });
    }
  };

  validateForm = () => {
    const {
      username,
      password,
      verifyPassword,
      email,
      creditInfoEmpty
    } = this.state;

    this.validateUsername(username);
    this.validatePassword(password, verifyPassword);
    if (this.validatePassword(password, verifyPassword)) {
      this.validateVerifyPassword(password, verifyPassword);
    }
    this.validateEmail(email);
    this.validateCreditNumber(creditInfoEmpty);

    if (
      this.validateUsername(username) &&
      this.validatePassword(password, verifyPassword) &&
      this.validateEmail(email) &&
      this.validateVerifyPassword(password, verifyPassword)
    ) {
      this.setState({ formValid: true });
      return true;
    } else {
      this.setState({ formValid: false });
      return false;
    }
  };

  handleSubmit = (e, formType) => {
    const { formValid } = this.state;
    e.preventDefault();

    this.validateForm();

    let registrationPlanId = this.props.plan_name;
    if (!this.state.acceptTnc) {
      this.setState({ registerWithoutAccept: true });
      return;
    } else {
      this.setState({ registerOnGoing: true, errorCreditCard: "" });
    }

    if (formValid) {
      this.props.stripe
        .createToken({ name: this.state.username })
        .then(response => {
          if (response.token) {
            console.log("Received Stripe token:", response.token, response);

            let authData = {
              username: this.state.username,
              businessName: this.state.businessName,
              email: this.state.email,
              password: this.state.password,
              stripeToken: response.token.id,
              phone: this.state.phone,
              registrationPlanId: registrationPlanId
            };

            this.props.signup(authData);
            this.setState({ registerOnGoing: false });
          } else {
            console.log(response.error.message);
            this.setState({
              registerOnGoing: false,
              errorCreditCard: response.error.message
            });
          }
        });
    } else {
      this.setState({ registerOnGoing: false });
    }
  };

  handleInputChange = (inputType, e) => {
    const { username, email, password, verifyPassword } = this.state;
    let change = {};
    const phoneNoRegex = /^\+{0,1}[0-9]{0,14}$/;
    if (inputType === "phone" && !phoneNoRegex.test(e.target.value)) {
      e.target.value = this.state[inputType] || "";
    } else {
      if (
        inputType === "phone" &&
        e.target.value &&
        e.target.value.indexOf("+") === -1
      ) {
        e.target.value = `+${e.target.value}`;
      }
      change[inputType] = e.target.value;
      this.setState(change);
      if (inputType === "username") {
        this.validateUsername(e.target.value);
      } else if (inputType === "email") {
        this.validateEmail(e.target.value);
      } else if (inputType === "password") {
        this.validatePassword(e.target.value);
      }
      if (!!username && !!email && !!password && !!verifyPassword) {
        this.setState({ formValid: true });
      }
    }
  };

  toggleAccept = () => {
    this.setState({
      acceptTnc: !this.state.acceptTnc,
      registerWithoutAccept: this.state.acceptTnc
    });
  };

  renderLoader = () => {
    return (
      <div className="loader-container">
        <div className="loader" />
      </div>
    );
  };

  render() {
    const {
      plan_price,
      trial_days,
      internationalization_config,
      billing_cycle_length,
      signupRequestInProcess
    } = this.props;
    const {
      registerOnGoing,
      errorUsername,
      errorEmail,
      errorPassword,
      errorVerifyPassword,
      errorCreditCard,
      formValid,
      registerWithoutAccept
    } = this.state;

    const stripeStyles = {
      base: {
        fontSize: "18px",
        fontWeight: "100",
        fontFamily: '"Poppins", sans-serif',
        padding: "0 20px 0 48px",
        color: "black",
        "::placeholder": {
          color: "#d3d3d3"
        }
      }
    };

    return (
      <form
        className="main-form register"
        id="registrationForm"
        onSubmit={this.handleSubmit.bind(this)}
        name="registrationForm"
      >
        <div className="container">
          <div className="row">
            <div className="col-10 offset-md-1">
              <div className="logo">
                <img src={logo} alt="logo" />
              </div>
              <div className="f-card">
                <p className="title">
                  PRICING:{" "}
                  <span className="c-green">
                    {digitСonversion(
                      plan_price,
                      "currency",
                      internationalization_config.currency_code
                    )}{" "}
                    /{billing_cycle_length === "monthly" && "Month"}
                    {billing_cycle_length === "annual" && "Year"}
                  </span>{" "}
                  ({trial_days} day free trial)
                </p>
                <hr />
                <br />
                <div className="inline-row">
                  <div className="f-container">
                    <label htmlFor="#">Please pick a username (do not use an email)</label>
                    <div className="f-row">
                      <input
                        name="username"
                        placeholder="Username"
                        type="text"
                        value={this.state.username}
                        onChange={e => {
                          this.handleInputChange("username", e);
                        }}
                      />{" "}
                      <i className="far fa-user-circle" />
                      {!!errorUsername && (
                        <div className="f-row-error">
                          <Alert color="warning">{errorUsername}</Alert>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="f-container">
                    <label htmlFor="#">Please give us your best email (you'll need this for password resets, etc so it's important)</label>
                    <div className="f-row">
                      <input
                        name="email"
                        placeholder="Email Address"
                        type="text"
                        value={this.state.email}
                        onChange={e => this.handleInputChange("email", e)}
                      />{" "}
                      <i className="far fa-envelope" />
                      {!!errorEmail && (
                        <div className="f-row-error">
                          <Alert color="warning">{errorEmail}</Alert>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="inline-row">
                  <div className="f-container">
                    <label htmlFor="#">Pick a password you will remember</label>
                    <div className="f-row">
                      <input
                        name="password"
                        placeholder="Password"
                        type="password"
                        value={this.state.password}
                        onChange={e => this.handleInputChange("password", e)}
                      />{" "}
                      <i className="fas fa-lock" />
                      {!!errorPassword && (
                        <div className="f-row-error">
                          <Alert color="warning">{errorPassword}</Alert>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="f-container">
                    <label htmlFor="#">Let's confirm that password</label>
                    <div className="f-row">
                      <input
                        name="confirm-password"
                        placeholder="Password"
                        type="password"
                        onChange={e =>
                          this.handleInputChange("verifyPassword", e)
                        }
                      />{" "}
                      <i className="fas fa-lock" />
                      {!!errorVerifyPassword && (
                        <div className="f-row-error">
                          <Alert color="warning">{errorVerifyPassword}</Alert>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="inline-row cards-n">
                  <div className="f-container card-n">
                    <label htmlFor="#">Card Number</label>
                    <div className="f-row">
                      <CardNumberElement
                        style={stripeStyles}
                        onChange={element => {
                          this.validateCreditNumber(element.empty);
                        }}
                      />
                    </div>
                    {!!errorCreditCard && (
                      <div className="f-row-error">
                        <Alert color="warning">{errorCreditCard}</Alert>
                      </div>
                    )}
                  </div>
                  <div className="card-secondary">
                    <div className="f-container credit-info">
                      <label htmlFor="#">Exp Month</label>
                      <div className="f-row without-icon">
                        <CardExpiryElement style={stripeStyles} />
                      </div>
                    </div>
                    <div className="f-container credit-info">
                      <label htmlFor="#">CVV/CVV2</label>
                      <div className="f-row without-icon">
                        <CardCVCElement style={stripeStyles} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="inline-row">
                  <div className="f-container">
                    <label htmlFor="#">Business Name (Optional)</label>
                    <div className="f-row">
                      <input
                        name="businessName"
                        placeholder="Business Name"
                        type="text"
                        value={this.state.businessName}
                        onChange={e =>
                          this.handleInputChange("businessName", e)
                        }
                      />{" "}
                      <i className="fas fa-building" />
                    </div>
                  </div>
                  <div className="f-container">
                    <label htmlFor="#">
                      Mobile - with country code (Optional)
                    </label>
                    <div className="f-row">
                      <input
                        name="phone"
                        placeholder="Phone"
                        type="text"
                        value={this.state.phone}
                        onChange={e => this.handleInputChange("phone", e)}
                      />{" "}
                      <i className="fas fa-mobile" />
                    </div>
                  </div>
                </div>
                <div className="f-container">
                  <div className="check">
                    <label className="container-check">
                      I accept the Terms &amp; Conditions
                      <input
                        type="checkbox"
                        defaultChecked={this.state.acceptTnc ? `checked` : ""}
                        onChange={this.toggleAccept}
                      />
                      <span className="checkmark" />
                    </label>
                  </div>
                  <TermsConditions
                    isOpen={this.state.acceptTnc}
                    scroll
                    scrollHeight="300px"
                  />
                  {registerWithoutAccept && (
                    <Alert color="danger">
                      You must accept Terms &amp; Conditions
                    </Alert>
                  )}
                  {formValid === false && (
                    <Alert color="warning">Please complete the form</Alert>
                  )}
                </div>
                <button
                  className="button dark"
                  style={{ width: "100%" }}
                  disabled={signupRequestInProcess || registerOnGoing}
                >
                  {signupRequestInProcess || registerOnGoing
                    ? this.renderLoader()
                    : "REGISTER"}
                </button>{" "}
                <Link className="new-account" to="/signin">
                  Already a member?{" "}
                  <span className="bold">Click to Login.</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="copyright">
          2018 Copyright <span>AccelerList</span>.
        </div>
      </form>
    );
  }
}

CheckoutForm.propTypes = {
  signup: PropTypes.func.isRequired,
  plan_price: PropTypes.number.isRequired,
  trial_days: PropTypes.number.isRequired,
  billing_cycle_length: PropTypes.string.isRequired
};

export default withRouter(
  connect(
    state => ({
      ...state.Auth.toJS(),
      internationalization_config: state.Auth.get("internationalization_config")
    }),
    { signup }
  )(injectStripe(CheckoutForm))
);
