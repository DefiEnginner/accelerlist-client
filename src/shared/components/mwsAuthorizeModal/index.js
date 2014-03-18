import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormFeedback,
  Label,
  Input,
  Col
} from "reactstrap";
import Select from "react-select";
import FlagIcon from "react-flag-kit/lib/FlagIcon";
import authActions from "../../../redux/auth/actions";
//styles
import "./style.css";
import IconLinkExternal from "react-icons/lib/fa/external-link";

const {
  verifyCredential,
  getUser,
  closeMwsAuthorizeModal
} = authActions;

const marketPlaceOptions = [
  {
    value: "amazon-us",
    label: (
      <span>
        Amazon.com (US) &nbsp;
        <FlagIcon code="US" size={16} />
      </span>
    )
  },
  {
    value: "amazon-uk",
    label: (
      <span>
        Amazon.com.uk (UK) &nbsp;
        <FlagIcon code="GB" size={16} />
      </span>
    )
  },
  {
    value: "amazon-ca",
    label: (
      <span>
        Amazon.com.ca (CA) &nbsp;
        <FlagIcon code="CA" size={16} />
      </span>
    )
  }
];

class MwsAuthorizeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalClass: "modal-mwsAuthorize",
      marketplace: marketPlaceOptions[0],
      sellerId: "",
      authToken: "",
      baseURL: "sellercentral.amazon.com",
      MWSAccountID: "5445-7997-8640",
      amazonURL: null,

      //input validations
      sellerIdValidation: true,
      authTokenValidation: true
    };
  }

  componentDidMount() {
    const { baseURL, MWSAccountID } = this.state;
    let amazonURL =
      "https://" +
      baseURL +
      "/gp/mws/registration/register.html?developerName=AccerList&devMWSAccountId=" +
      MWSAccountID;

    this.props.getUser();

    this.setState({
      amazonURL
    });
  }

  selectMarketplace = selectedOption => {
    this.setState(
      {
        marketplace: selectedOption
      },
      () => {
        let baseURL, MWSAccountID, amazonURL;

        switch (this.state.marketplace.value) {
          case "amazon-us":
            baseURL = "sellercentral.amazon.com";
            MWSAccountID = "5445-7997-8640";
            break;
          case "amazon-uk":
            baseURL = "sellercentral.amazon.co.uk";
            MWSAccountID = "1992-9749-6484";
            break;
          case "amazon-ca":
            baseURL = "sellercentral.amazon.ca";
            MWSAccountID = "5445-7997-8640";
            break;
          default:
            break;
        }

        amazonURL =
          "http://" +
          baseURL +
          "/gp/mws/registration/register.html?developerName=AccerList&devMWSAccountId=" +
          MWSAccountID;

        this.setState({
          baseURL,
          MWSAccountID,
          amazonURL
        });
      }
    );
  };

  handleSubmit = event => {
    const { marketplace, sellerId, authToken } = this.state;
    let marketplaceId;

    switch (marketplace.value) {
      case "amazon-us":
        marketplaceId = "ATVPDKIKX0DER";
        break;
      case "amazon-uk":
        marketplaceId = "A1F83G8C2ARO7P";
        break;
      case "amazon-ca":
        marketplaceId = "A2EUQ1WTGCTBG2";
        break;
      default:
        break;
    }

    this.setState(
      {
        sellerIdValidation: sellerId !== "",
        authTokenValidation: authToken !== ""
      },
      () => {
        const { sellerIdValidation, authTokenValidation } = this.state;

        if (sellerIdValidation && authTokenValidation) {
          let payload = {
            marketplaceId,
            sellerId,
            authToken
          };

          this.props.verifyCredential(payload);
        }
      }
    );
  };

  onInputChange = (inputName, event) => {
    this.setState({
      [inputName]: event.target.value,
      [inputName + "Validation"]: true
    });
  };

  toggle = () => {
    this.setState({
      sellerId: "",
      authToken: ""
    });
   this.props.closeMwsAuthorizeModal();
  };

  render() {
    const {
      sellerId,
      authToken,
      amazonURL,
      marketplace,
      authTokenValidation,
      sellerIdValidation
    } = this.state;
    const {
      isOpenMwsAuthorizeModal
    } =this.props;

    return (
      <Modal
        isOpen={isOpenMwsAuthorizeModal}
        toggle={this.toggle}
        className={this.state.modalClass}
      >
        <ModalHeader>
          MWS Authorization Required!
          <span>
            We need you to authorize AccerList to access your 3rd party seller
            account.
          </span>
        </ModalHeader>
        <ModalBody>
          <Form className="mt-4">
            <FormGroup className="step-field">
              <div>
                <span className="step-number">1</span>
              </div>
              <div className="right">
                <Label for="marketplaceSelector">  
                  Choose your marketplace.
                </Label>
                <Select
                  value={marketplace}
                  onChange={this.selectMarketplace}
                  options={marketPlaceOptions}
                />
              </div>
            </FormGroup>
            <FormGroup className="step-field">
              <div>
                <span className="step-number">2</span>
              </div>
              <div className="right">
                <Label for="signInAmazon">
                  Sign in with your Amazon Seller's account
                </Label>
                <a
                  className="anchor-amazon"
                  href={amazonURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "black" }}
                >
                  Click here to open up Amazon's MWS authorization process in a
                  pop-up
                </a> <IconLinkExternal className="ml-1" />
              </div>
            </FormGroup>
            <FormGroup className="step-field">
              <div>
                <span className="step-number">3</span>
              </div>
              <div className="right">
                <Label>
                  Provide Seller ID and MWS Auth Token
                </Label>
                <p>
                  Go through the authorization flow on the Amazon pop up. Grab your <strong>Seller ID</strong> and{" "}
                  <strong>MWS Auth Token</strong> and then fill below form with those values.
                </p>
                <FormGroup row>
                  <Label for="sellerId" sm={4}>
                    Seller ID
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="text"
                      name="sellerId"
                      id="sellerId"
                      placeholder="Provide Seller Id"
                      value={sellerId}
                      onChange={e => this.onInputChange("sellerId", e)}
                    />
                    {!sellerIdValidation && (
                      <FormFeedback>Seller id is not valid</FormFeedback>
                    )}
                  </Col>
                </FormGroup>
                <FormGroup row>
                  <Label for="authToken" sm={4}>
                    MWS Auth Token
                  </Label>
                  <Col sm={8}>
                    <Input
                      type="text"
                      name="authToken"
                      id="authToken"
                      placeholder="Provide Authorization Token"
                      value={authToken}
                      onChange={e => this.onInputChange("authToken", e)}
                    />
                    {!authTokenValidation && (
                      <FormFeedback>Auth token is not valid</FormFeedback>
                    )}
                  </Col>
                </FormGroup>
              </div>
            </FormGroup>
          </Form>
        </ModalBody>
        <ModalFooter>
          <Button color="success" onClick={this.handleSubmit}>
            Authorize
          </Button>
        </ModalFooter>
      </Modal>
    );
  }
}

MwsAuthorizeModal.propTypes = {
  closeInSettingsPage: PropTypes.func
};

export default connect(
  state => ({
    credentialVerified: state.Auth.get("credentialVerified"),
    isOpenMwsAuthorizeModal: state.Auth.get("isOpenMwsAuthorizeModal")
  }),
  { 
    verifyCredential,
    getUser,
    closeMwsAuthorizeModal
  }
)(MwsAuthorizeModal);
