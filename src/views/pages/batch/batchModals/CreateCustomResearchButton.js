import React, { Component } from 'react';
import { connect } from "react-redux";
import {
	Button,
	Col,
	Modal,
	ModalBody,
	ModalHeader,
	ModalFooter,
	Form,
	FormGroup,
	Label,
	Input,
} from "reactstrap";
import PropTypes from 'prop-types'
import Toggle from "../../../../shared/components/Toggle";
import { customResearchButton } from "../../../../assets/images";
import settingsActions from "../../../../redux/settings/actions";
import authActions from "../../../../redux/auth/actions";
const {
	updateUserSettings
} = settingsActions
const { updateUserData } = authActions;

class CreateCustomResearchButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
		customVisible: true,
		customButtonUrl: '',
		customButtonText: '',
		error: '',
		buttonToUpdate: null,
    };
  }

  UNSAFE_componentWillReceiveProps(np){
	if(np.newOpen){
		this.setState({
			customVisible: true,
			customButtonUrl: '',
			customButtonText: '',
			error: '',
			buttonToUpdate: null,
		});
	}
  }

  loadButton = (index, rb) => {
	this.setState({
		customVisible: rb.visible,
		customButtonUrl: rb.originalUrl,
		customButtonText: rb.text,
		error: '',
		buttonToUpdate: index,
	});
  }

  toggleCustomVisible = () => {
    this.setState({ customVisible: !this.state.customVisible })
  }

  updateButtonUrl = (e) => {
    this.setState({ customButtonUrl: e.target.value })
  }

	updateButtonText = (e) => {
		if(e.target.value.length < 3){
			this.setState({ customButtonText: e.target.value.toUpperCase() })
		}
	}

	createNewButton = () => {
		if(!this.state.customButtonUrl || !this.state.customButtonText){
			this.setState({ error: "Insert URL and button text" });
			return;
		}
		const { userData } = this.props;
		var data = {
			visible: this.state.customVisible,
			originalUrl: this.state.customButtonUrl.trim(),
			text: this.state.customButtonText.trim(),
			url: this.state.customButtonUrl.trim(),
		}
		const asins = data.url.match(/([A-Z0-9]{10})/g);
		if(asins){
			asins.forEach(asin => {
				data.url = data.url.replace(asin, '{ASIN}');
			})
		} else {
			this.setState({ error: "No ASIN present" });
			return;
		}
		if(userData){
			let ud = userData;
			if(!ud.settings["custom_research_buttons"]){
				ud.settings["custom_research_buttons"] = '[]';
			}
			let json = JSON.parse(ud.settings["custom_research_buttons"]);
			json.push(data);
			ud.settings["custom_research_buttons"] = JSON.stringify(json);
			this.props.updateUserData(ud);
			const data_ud = {custom_research_buttons: ud.settings["custom_research_buttons"]};
			this.props.updateUserSettings(data_ud);
		}
		this.props.toggle();
	}

	updateButton = () => {
		if(!this.state.customButtonUrl || !this.state.customButtonText){
			this.setState({ error: "Insert URL and button text" });
			return;
		}
		const { userData } = this.props;
		var data = {
			visible: this.state.customVisible,
			originalUrl: this.state.customButtonUrl.trim(),
			text: this.state.customButtonText.trim(),
			url: this.state.customButtonUrl.trim(),
		}
		const asins = data.url.match(/([A-Z0-9]{10})/g);
		if(asins){
			asins.forEach(asin => {
				data.url = data.url.replace(asin, '{ASIN}');
			})
		} else {
			this.setState({ error: "No ASIN present" });
			return;
		}
		if(userData){
			let ud = userData;
			if(!ud.settings["custom_research_buttons"]){
				ud.settings["custom_research_buttons"] = '[]';
			}
			let json = JSON.parse(ud.settings["custom_research_buttons"]);
			json = json.map((j, index) => {
				if(index === this.state.buttonToUpdate){
					return data;
				} else {
					return j;
				}
			});
			ud.settings["custom_research_buttons"] = JSON.stringify(json);
			this.props.updateUserData(ud);
			const data_ud = {custom_research_buttons: ud.settings["custom_research_buttons"]};
			this.props.updateUserSettings(data_ud);
		}
		this.props.toggle();
	}

	deleteButton = () => {
		const { userData } = this.props;
		if(userData){
			let ud = userData;
			if(!ud.settings["custom_research_buttons"]){
				ud.settings["custom_research_buttons"] = '[]';
			}
			let json = JSON.parse(ud.settings["custom_research_buttons"]);
			json = json.filter((j, index) => index !== this.state.buttonToUpdate);
			ud.settings["custom_research_buttons"] = JSON.stringify(json);
			this.props.updateUserData(ud);
			const data_ud = {custom_research_buttons: ud.settings["custom_research_buttons"]};
			this.props.updateUserSettings(data_ud);
			this.setState({ buttonToUpdate: null });
		}
	}

  render() {
	  const { isOpen, toggle, userData } = this.props;

	return (
        <Modal isOpen={isOpen}>
          <ModalHeader toggle={toggle}>
            Create Custom Research Button
          </ModalHeader>
          <ModalBody>
            <p>You can create custom button to your preferred research website.</p>
            <img src={customResearchButton} className="img-fluid my-4" alt="Custom Research Button" />
            <p>To create custom research button, follow steps below:</p>
            <ol className="pl-4">
              <li><Button color="link" onClick={() => window.open("", '_blank').focus()}>Open a new tab</Button> and go to your preferred research website</li>
              <li>On the opened website, search an ASIN (avoid searching for books) </li>
              <li>Copy the entire URL</li>
              <li>Paste the URL to the field below</li>
            </ol>
            <Form>
              <FormGroup row>
                <Label md="3">URL</Label>
                <Col md={9}>
					<Input
						text
						placeholder="Example: https://amazon.com/dp/067003438X"
						value={this.state.customButtonUrl}
						onChange={e => this.updateButtonUrl(e)}
					/>
                </Col>
              </FormGroup>
              <FormGroup row>
              <Label md="3">Button Text</Label>
                <Col md={9}>
					<Input
						text
						value={this.state.customButtonText}
						onChange={e => this.updateButtonText(e)}
					/>
                </Col>
              </FormGroup>
              <FormGroup row>
                <Label md="3">Visible in List</Label>
                <Col md={9}>
                  <div className="d-inline-block">
                    <Toggle
                      checked={this.state.customVisible}
                      onChange={this.toggleCustomVisible}
                    />
                  </div>
                </Col>
              </FormGroup>
			  <FormGroup>
				  <div>
					{userData && userData.settings["custom_research_buttons"].length === 0 ?
					<React.Fragment>
						<Label>Available buttons</Label>
						<br />
						<sup>Click button below to change or delete it</sup>
						<br />
					</React.Fragment>
					: null }
					{userData && userData.settings["custom_research_buttons"] ?
						(JSON.parse(userData.settings["custom_research_buttons"]).map((rb, index) => {
							return (
								  <Button
									onClick={(e) => this.loadButton(index, rb)}
									className="btn-price-tracker"
									size="sm"><b>{rb.text}</b>
								  </Button>
							)
						})) : (null)}
				  </div>
			  </FormGroup>
            </Form>
          </ModalBody>
		  <ModalFooter>
			{this.state.error ?
				<div>
					<Label>
						<b><font color="red">{this.state.error}</font></b>
					</Label>
				</div>
			: null }
            <Button onClick={toggle}>Close</Button>
			{this.state.buttonToUpdate || this.state.buttonToUpdate === 0 ?
				(
				<React.Fragment>
				<Button
					color="danger"
					onClick={this.deleteButton}
				>Delete Button</Button>
				<Button
					color="success"
					onClick={this.updateButton}
				>Update Button</Button>
			</React.Fragment>
				) : (
				<Button
					color="success"
					onClick={this.createNewButton}
				>Create Button</Button>	)
			}
          </ModalFooter>
        </Modal>
	);
  }
}

CreateCustomResearchButton.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
}

export default connect(
  state => ({
    userData: state.Auth.get("userData")
  }),
  {
	updateUserData,
	updateUserSettings,
  }
)(CreateCustomResearchButton);
