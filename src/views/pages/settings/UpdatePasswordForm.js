import React, { Component } from "react";
import {
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
  Button
} from "reactstrap";
import { func, string } from "prop-types";
import settingActions from "../../../redux/settings/actions";
import { connect } from "react-redux";
import { PulseLoader } from 'react-spinners';

let validationMessage = "";

class UpdatePasswordForm extends Component {
  state = {
    oldPass: '',
    newPassword: '',
    newPasswordConfirm: '',
    updatePassworsButtonDisabled: false,
    notValidOldPass: false,
    notValidNewPassword: false,
    notValidNewPasswordConfirm: false
  }
  
  static propTypes = {
    showSettingsAlert: func,
    updateUserPassworsRequest: func,
    resetUpdateUserPassworsRequestStatus: func,
    updatePasswordRequestStatus: string
  }
  
  validationPasswordData = () => {
    const { oldPass, newPassword, newPasswordConfirm } = this.state;

    if (oldPass.length === 0 || newPassword.length === 0 || newPasswordConfirm.length === 0) {
      validationMessage = "One of password field is empty, please check fields.";

      if (oldPass.length === 0) {
        this.setState({
          notValidOldPass: true
        })
      }

      if (newPassword.length === 0) {
        this.setState({
          notValidNewPassword: true
        })
      }
      
      if (newPasswordConfirm.length === 0) {
        this.setState({
          notValidNewPasswordConfirm: true
        })
      }
      return false;
    }
    if (newPassword !== newPasswordConfirm) {
      validationMessage = "New Password and Confirm Password is not match.";
        this.setState({
          notValidNewPassword: true,
          notValidNewPasswordConfirm: true
        })
      return false;
    }
    return true;
  }

  handleClickUpdatePassword = () => {
    const { showSettingsAlert, updateUserPassworsRequest } = this.props;
    const { oldPass, newPassword, newPasswordConfirm } = this.state;
    const isValid = this.validationPasswordData();
    if (isValid) {
      updateUserPassworsRequest(oldPass, newPassword, newPasswordConfirm);
      this.setState({
        updatePassworsButtonDisabled: true
      })
    } else {
      showSettingsAlert({
        title: "Password Validation Error",
        text: validationMessage
      })
    }
  }

  clearStatusAndActivateUpdatePasswordButton = () => {
    this.props.resetUpdateUserPassworsRequestStatus();
    this.setState({
      updatePassworsButtonDisabled: false
    })
  }
  
  render() {
    const { updatePasswordRequestStatus } = this.props;
    const { 
      updatePassworsButtonDisabled,
      oldPass,
      newPassword,
      newPasswordConfirm,
      notValidOldPass,
      notValidNewPassword,
      notValidNewPasswordConfirm
    } = this.state;

    if (updatePasswordRequestStatus === "complete") {
      this.setState({
        oldPass: '',
        newPassword: '',
        newPasswordConfirm: ''
      });
      this.clearStatusAndActivateUpdatePasswordButton();
    }
    
    return (
      <Card>
        <CardBody>
          <h6 className="card-title text-uppercase">
            Update AccelerList Password
          </h6>
          <Form>
            <FormGroup row>
              <Label for="oldPassword" sm={3}>
                Old Password:
              </Label>
              <Col sm={9}>
                <Input
                  className={notValidOldPass ? "is-invalid" : ""}
                  type="password"
                  name="old_password"
                  id="oldPassword"
                  value={oldPass}
                  onChange={(e) => {
                    this.setState({
                      oldPass: e.target.value,
                      notValidOldPass: false
                    })
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="newPassword" sm={3}>
                New Password:
              </Label>
              <Col sm={9}>
                <Input
                  className={notValidNewPassword ? "is-invalid" : ""}
                  type="password"
                  name="new_password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => {
                    this.setState({
                      newPassword: e.target.value,
                      notValidNewPassword: false,
                      notValidNewPasswordConfirm: false
                    })
                  }}
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="confirmPassword" sm={3}>
                Confirm Password:
              </Label>
              <Col sm={9}>
                <Input
                  className={notValidNewPasswordConfirm ? "is-invalid" : ""}
                  type="password"
                  name="confirm_password"
                  id="confirmPassword"
                  value={newPasswordConfirm}
                  onChange={(e) => {
                    this.setState({
                      newPasswordConfirm: e.target.value,
                      notValidNewPassword: false,
                      notValidNewPasswordConfirm: false
                    })
                  }}
                />
              </Col>
            </FormGroup>
            <Button
              color="primary"
              className="mb-2 float-right"
              onClick={this.handleClickUpdatePassword}
              style={{width: '250px'}}
              disabled={updatePassworsButtonDisabled}
            >{
              updatePasswordRequestStatus === "execution" ?
              (
                <div className='sweet-loading'>
                  <PulseLoader
                    sizeUnit={"px"}
                    size={9}
                    color={'white'}
                    loading={true}
                  />
                </div>
              ) : 'Update Password'
              }
            </Button>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default connect(state => {
  return {
    updatePasswordRequestStatus: state.Settings.get("updatePasswordRequestStatus"),
  };
}, settingActions)(UpdatePasswordForm);