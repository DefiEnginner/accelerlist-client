import React, { Component } from "react";
import { connect } from "react-redux";
import { Table, Button } from "reactstrap";
import PropTypes from "prop-types";

import batchActions from "../../../../../redux/batch/actions";
import FaSpinner from "react-icons/lib/fa/spinner";
import { 
  momentDateIsValid, 
  momentDateTimeToLocalFormatConversion 
} from "../../../../../helpers/utility";
import {
  feedStatusMappingToFeedButtonStyle,
  feedStatusMappingToFeedButtonText
} from "../../../../../helpers/batch/mapping_data";

const {
  updateModalDisplay,
  setCurrentFeedStatus
} = batchActions;
/*
This display is shown when they have already finished scanning in all their items
and are looking at the submission result to Amazon.
*/

class FeedTable extends Component {

  handleClickViewFeedButton = feed => {
    this.props.setCurrentFeedStatus(feed);
    this.props.updateModalDisplay("feed_status_item");
  };

  sortProductFeedSubmissionsByTimestamp = (productFeedSubmissions) => {
    productFeedSubmissions.sort((a, b)=>{
      a = new Date(a.updated_at);
      b = new Date(b.updated_at);
      return a>b ? -1 : a<b ? 1 : 0;
    })
  }
  render() {
    const { productFeedSubmissions } = this.props;
    this.sortProductFeedSubmissionsByTimestamp(productFeedSubmissions);
    return (
      <Table>
        <thead>
          <tr>
            <th className="align-middle text-center"># SKUs</th>
            <th className="align-middle text-center">Created At</th>
            <th className="align-middle text-center">Updated At</th>
            <th className="align-middle text-center">Status</th>
            <th className="align-middle text-center">Actions</th>
            <th className="align-middle text-center">Feed URL</th>
          </tr>
        </thead>
        <tbody>
          {productFeedSubmissions.map((feed, i) => (
            <tr key={i}>
              <td className="align-middle text-center">{feed.num_skus}</td>
              <td className="align-middle text-center">
                {momentDateIsValid(feed.created_at)
                  ? momentDateTimeToLocalFormatConversion(feed.created_at, true)
                  : "N/A"}
              </td>
              <td className="align-middle text-center">
                {momentDateIsValid(feed.updated_at)
                  ? momentDateTimeToLocalFormatConversion(feed.updated_at, true)
                  : "N/A"}
              </td>
              <td className="align-middle text-center">{feed.status}</td>
              <td className="align-middle text-center">
                <Button
                  color={feedStatusMappingToFeedButtonStyle[feed.status]}
                  disabled={feed.status !== "_DONE_"}
                  onClick={() => this.handleClickViewFeedButton(feed)}
                >
                  {feed.status !== "_DONE_" && (
                    <span>
                      <FaSpinner className="fa-spin" />
                      &nbsp;
                    </span>
                  )}
                  {feedStatusMappingToFeedButtonText[feed.status]}
                </Button>
              </td>
              <td className="align-middle text-center">{feed.url}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

FeedTable.propTypes = {
  productFeedSubmissions: PropTypes.array.isRequired,
  updateModalDisplay: PropTypes.func.isRequired,
  setCurrentFeedStatus: PropTypes.func.isRequired
};

export default connect(
  state => ({
    productFeedSubmissions: state.Batch.get('productFeedSubmissions'),
    batchMetadata: state.Batch.get('batchMetadata')
  }),
  {
    updateModalDisplay,
    setCurrentFeedStatus
  }
)(FeedTable);
