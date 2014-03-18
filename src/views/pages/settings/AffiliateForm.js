import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
  Label,
  Col
} from 'reactstrap';
import Toggle from '../../../shared/components/Toggle';

class AffiliateForm extends Component {
  constructor(props) {
    super(props);

	this.state = {
		saved: true,
		affiliateCode: "",
	}
  }

	UNSAFE_componentWillReceiveProps(np){
		this.setState({ affiliateCode: np.userData.settings.affiliate_code });
	}

	updateAffiliateCode = (e) => {
		this.setState({ affiliateCode: e.target.value });
	}

  affililateToggleChanged = () => {
	  const { userData } = this.props;
		if(userData){
			let ud = userData;
			if(ud.settings["affiliate_status"] === "active"){
				ud.settings["affiliate_status"] = "inactive";
			} else {
				ud.settings["affiliate_status"] = "active";
			}
			this.props.updateUserData(ud);
			let data = {affiliate_status: ud.settings["affiliate_status"]};
			this.props.updateUserSettings(data);
		}
  }

  edit = () => {
    this.setState({
      saved: false
    });
  }

  save = () => {
	  const { userData } = this.props;
		if(userData){
			let ud = userData;
			ud.settings["affiliate_code"] = this.state.affiliateCode;
			this.props.updateUserData(ud);
			let data = {affiliate_code: ud.settings["affiliate_code"]};
			this.props.updateUserSettings(data);
		}
    this.setState({
      saved: true
    });
  }

  render() {
    const {
      className
    } = this.props;

    return (
      <Card className={className}>
        <CardBody>
          <h6 className="card-title text-uppercase">
            Affiliate Program
          </h6>
          <Form>
            <FormGroup row>
              <Label sm={3}>Affiliate Status:</Label>
              <Col sm={9}>
				  <div className="d-flex">
					<Toggle
						checked={this.props.userData.settings.affiliate_status === 'active'}
						onText="ACTIVE"
						offText="INACTIVE"
						onChange={this.affililateToggleChanged}
					/>
					</div>
                <span className="text-muted">You will only receive commisions on all link shares if this toggle is active</span>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={3}>Affiliate Link:</Label>
              <Col sm={9}>
				  <Input
					  type="text"
					  placeholder="Copy and paste your affiliate link here..."
					  disabled={this.state.saved}
					  onChange={(e) => this.updateAffiliateCode(e)}
					  value={this.state.affiliateCode}
				  />
              </Col>
            </FormGroup>
            <div className="text-right">
				<Button
					color="secondary"
					onClick={this.edit}>Edit</Button>
				<Button
					color="primary"
					onClick={this.save}
				>Save</Button>
            </div>
          </Form>
        </CardBody>
      </Card>
    );
  }
}

export default AffiliateForm;
