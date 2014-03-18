import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  channelIcon,
  labelIcon,
  workflowIcon
} from "../../../../../assets/images";

class BatchMetadataBadges extends Component {

  convertChannel = (channel) => {
    if (!channel) {
      return ""
    }

    if (channel.startsWith("AMAZON_")) {
      return "FBA";
    }

    if (channel === "DEFAULT") {
      return "MF";
    }

    return "";
  }

  convertLabelingPreference = (labelingPreference) => {
    switch(labelingPreference){
      case "SELLER_LABEL":
        return "Seller Labels";
      case "AMAZON_LABEL_ONLY":
        return "Amazon Labels";
      default:
        return "";
    }
  }

  render() {
    const { batchMetadata } = this.props;
    return (
      <div className="text-right">
        { batchMetadata.workflowType && (
            <span className="batch-metadata-badges">
              <img src={workflowIcon} alt="workflowIcon" />
              <span>{batchMetadata.workflowType} Workflow</span>
            </span>
          )
        }
        { batchMetadata.channel && (
            <span className="batch-metadata-badges">
              <img src={channelIcon} alt="workflowIcon" />
              <span>{this.convertChannel(batchMetadata.channel)}</span>
            </span>
          )
        }
        { batchMetadata.labelingPreference && (
            <span className="batch-metadata-badges">
              <img src={labelIcon} alt="workflowIcon" />
              <span>{this.convertLabelingPreference(batchMetadata.labelingPreference)}</span>
            </span>
          )
        }
      </div>
    );
  }
}

BatchMetadataBadges.propTypes = {
  batchMetadata: PropTypes.object.isRequired
};

export default BatchMetadataBadges;
