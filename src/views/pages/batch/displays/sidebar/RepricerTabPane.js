import React, { Component } from "react";
import { TabPane } from "reactstrap";

class RepricerTabPane extends Component {

  render(){
	const { tabId } = this.props;

    return (
      <TabPane tabId={tabId}>
        <br />
        <div style={{textAlign: "center", color: "grey"}}>
			COMING SOON!
        </div>
        <br />
      </TabPane>
    );
  }
}

export default RepricerTabPane;
