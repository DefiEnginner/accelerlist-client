import React from "react";
import { connect } from "react-redux";
import addressAction from "../../../redux/address/actions";
import { Card, CardBody, CardTitle, Col, Button } from "reactstrap";
import IconTrash from "react-icons/lib/fa/trash-o";
import RenderForm from "../../forms/renderForm";
import formSpecs from "./formSpecs";
import "./style.css";

const { fetchAdressList, createAddress, deleteAddress } = addressAction;

const AddedAddresses = ({ addressStore, deletingId, removeAddress, addressDisplayFormat }) => (
  <React.Fragment>
    {addressStore && addressStore.length > 0 ? (
      addressStore.map(address => {
        return (
          <div className="row added-address" key={address.id}>
            <Col sm="9">
              {addressDisplayFormat(address).map((addressLine, idx) => {
                  return <p className="mb-0" key={address.id+"-"+idx}>{addressLine}</p>
              })}
            </Col>
            {deletingId !== address.id && (
              <Col
                sm="3"
                className="icon-btn-container"
                onClick={() => {
                  removeAddress(address.id);
                }}
              >
                <div className="icon-btn">
                  <IconTrash size="18" />
                </div>
              </Col>
            )}
          </div>
        );
      })
    ) : (
      <div>No added address</div>
    )}
  </React.Fragment>
);

class Address extends React.Component {
  constructor(props) {
    let country = "US";
    if (props.internationalization_config && props.internationalization_config.ship_to_country_code) {
      country = props.internationalization_config.ship_to_country_code;
    }

    super(props);
    this.state = {
      country: country
    }
  }
  componentDidMount() {
    this.props.fetchAdressList();
  }
  removeAddress = id => {
    this.props.deleteAddress(id);
  };
  submitFormValues = values => {
    values.countryCode = this.state.country;
    this.props.createAddress(values, formSpecs[this.state.country].form.id);
  };
  render() {
    let countryButtons = ["US", "CA", "GB"].map(country => {
      return (
        <Button
          size="sm"
          color={this.state.country === country ? "success": "primary"}
          className="light-right-margin"
          onClick={() => this.setState({country})}
        >Display {country} Address Form</Button>
      )
    })
    return (
          <Card>
            <CardBody>
			  <CardTitle>Address Settings</CardTitle>
              <div className="row">
                <Col sm={8}>
                  <p>
                    Click here to add a new address, that you can find any time
                    you work with any of your batches.
                  </p>
                  {countryButtons}
                  <hr />
                  <RenderForm
                    formSpecs={formSpecs[this.state.country]}
                    disableForm={this.props.savingAddress}
                    submitFormValues={this.submitFormValues.bind(this)}
                  />
                </Col>
                <Col sm={4}>
                  <div className="prev-added-adress">
                    <p className="heading">PREVIOUSLY ADDED ADRESSES</p>
                    {this.props.loadingList ? (
                      <p>Loading...</p>
                    ) : (
                      <AddedAddresses
                        deletingId={this.props.deletingId}
                        addressStore={this.props.addressList}
                        removeAddress={this.removeAddress}
                        addressDisplayFormat={formSpecs[this.state.country].renderAddressData}
                      />
                    )}
                  </div>
                </Col>
              </div>
            </CardBody>
          </Card>
    );
  }
}

export default connect(
  state => ({
    ...state.Address.toJS(),
    internationalization_config: state.Auth.get("internationalization_config")
  }),
  { fetchAdressList, createAddress, deleteAddress }
)(Address);
