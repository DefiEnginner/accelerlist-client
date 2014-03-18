import React, { Component } from 'react';
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  Label,
  Col
} from 'reactstrap';
import Toggle from '../../../shared/components/Toggle';

class LeaderboardForm extends Component {
  optOutToggleChanged = () => {
	  const { userData } = this.props;
		if(userData){
			let ud = userData;
			if(ud.settings["leaderboard_opt_out"] === "true"){
				ud.settings["leaderboard_opt_out"] = "false";
			} else {
				ud.settings["leaderboard_opt_out"] = "true";
			}
			this.props.updateUserData(ud);
			let data = {leaderboard_opt_out: ud.settings["leaderboard_opt_out"]};
			this.props.updateUserSettings(data);
		}
  }

  replaceNameToggleChanged = () => {
	  const { userData } = this.props;
		if(userData){
			let ud = userData;
			if(ud.settings["leaderboard_replace_name"] === "true"){
				ud.settings["leaderboard_replace_name"] = "false";
			} else {
				ud.settings["leaderboard_replace_name"] = "true";
			}
			this.props.updateUserData(ud);
			let data = {leaderboard_replace_name: ud.settings["leaderboard_replace_name"]};
			this.props.updateUserSettings(data);
		}
  }

  render() {
    return(
      <Card className="mt-4">
        <CardBody>
          <h6 className="card-title text-uppercase">
            Leaderboard Settings
          </h6>

          <Form>
            <FormGroup row>
              <Label sm={4}>Do not include me in rankings:</Label>
              <Col sm={8}>
                <div className="d-flex">
					<Toggle
						checked={this.props.userData.settings.leaderboard_opt_out === 'true'}
						onChange={() => this.optOutToggleChanged()}
					/>
                </div>
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label sm={4}>Do not use my real name:</Label>
              <Col sm={8}>
                <div className="d-flex">
					<Toggle
						checked={this.props.userData.settings.leaderboard_replace_name === 'true'}
						onChange={() => this.replaceNameToggleChanged()} />
                </div>
              </Col>
            </FormGroup>
          </Form>
        </CardBody>

      </Card>
    );
  }
}

export default LeaderboardForm;
