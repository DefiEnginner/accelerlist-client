import React from "react";
import Dropzone from "react-dropzone";
import { withRouter } from "react-router-dom";

import { backendHost, request } from "../../../helpers/apiConfig";
import { upload_icon, excelImage } from "../../../assets/images";
import { DropzoneContainer } from "./common.style";

class TransactionReportUploader extends React.Component {
  constructor() {
    super();
    this.state = {
      disabled: false,
      accepted: [],
      rejected: [],
      showFailureMessage: false
    };
  }

  pollUploadProcessingStatus(processingJobUuid) {
    let self = this;

    request
      .get(
        backendHost +
        "/api/v1/profit_analytics/upload?batch_upload_job_id=" +
        processingJobUuid
      )
      .then(res => {
        let response = res.body;

        if (response.status !== "failed" && response.status !== "processed") {
          setTimeout(function () {
            self.pollUploadProcessingStatus(processingJobUuid);
          }, 1000);
          console.log("not done, still wokrin on it....");
        } else {
          console.log("proceed");
          if (response.status === "processed") {
            console.log("processed", processingJobUuid);
            self.props.history.push(
              `/dashboard/profit_analytics/report_viewer/${response.generated_report_id}`
            );
            // window.location.href =
            //   "/transaction_report/v2/" + processingJobUuid + "/";
          }
          if (response.status === "failed") {
            this.setState({
              showFailureMessage: true
            });
          }
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  onDrop(accepted, rejected) {
    var callback = function (err, res) {
      console.log(res);
      if (err || !res.ok) {
        //alert('Oh no! error');
      } else {
        var accepted = this.state.accepted;
        var fileStatusMap = JSON.parse(res.text).file_data;
        var processingJobUuid = JSON.parse(res.text).batch_upload_id;
        console.log("processing", processingJobUuid);

        for (var fileName in fileStatusMap) {
          for (var c = 0; c < accepted.length; c++) {
            if (accepted[c].name === fileName) {
              accepted[c].meta = fileStatusMap[fileName];
              console.log(
                "this is the file",
                accepted[c].name,
                accepted[c].meta
              );
            }
          }
        }
        this.pollUploadProcessingStatus(processingJobUuid);

        this.setState({
          accepted: accepted
        });
      }
    };
    var req = request.post(backendHost + "/api/v1/profit_analytics/upload");

    //var overrideRadioValue = $("input[name='override-radio']:checked").val();
    var overrideRadioValue = "override_always";
    req.field("overrideOption", overrideRadioValue);

    accepted.forEach(file => {
      req.attach(file.name, file);
    });
    req.end(callback.bind(this));

    var currAccepted = this.state.accepted;
    for (let c = 0; c < accepted.length; c++) {
      accepted[c].job_status = "Uploading...";
      currAccepted.push(accepted[c]);
    }

    var currRejected = this.state.rejected;
    for (let c = 0; c < rejected.length; c++) {
      currRejected.push(rejected[c]);
    }

    this.setState({
      accepted: currAccepted,
      rejected: currRejected
    });
  }

  startOver() {
    this.setState({
      accepted: [],
      rejected: [],
      showFailureMessage: false
    });
  }

  jsUcfirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  generateFileView(file) {
    var status;
    if (
      file.meta &&
      file.meta.job_status &&
      file.meta.job_status.toLocaleLowerCase().indexOf("error") !== -1
    ) {
      status = (
        <div className="col-sm-11" style={{ textAlign: "left" }}>
          <i className="fa fa-times-circle-o fa-2x fa-fw pull-right" />
          <h5
            style={{
              fontWeight: "600",
              fontFamily: "Open Sans",
              marginTop: "0px"
            }}
          >
            Filename: {file.name}
          </h5>
          <p style={{ fontWeight: "300", fontFamily: "Open Sans" }}>
            Status:{" "}
            {this.jsUcfirst(file.meta.job_status) +
              ". " +
              file.meta.error_message}
          </p>
          <div className="progress">
            <div
              className="determinate"
              style={{ width: "100%", backgroundColor: "#e74c3c" }}
            />
          </div>
        </div>
      );
    } else if (
      file.meta &&
      file.meta.job_status &&
      file.meta.job_status.toLocaleLowerCase().indexOf("processed") !== -1
    ) {
      console.log("this is file meta");
      console.log(file.meta);
      var statusText;
      if (
        file.meta.output_metadata &&
        JSON.parse(file.meta.output_metadata).warn_rows &&
        JSON.parse(file.meta.output_metadata).warn_rows.length > 0
      ) {
        statusText =
          "Status: " +
          file.meta.job_status +
          ". We have some entries to process that need your attention";
      } else {
        statusText = "Status: " + file.meta.job_status;
      }
      status = (
        <div className="col-sm-11" style={{ textAlign: "left" }}>
          <i className="fa fa-thumbs-o-up fa-2x fa-fw pull-right" />
          <h5
            style={{
              fontWeight: "600",
              fontFamily: "Open Sans",
              marginTop: "0px"
            }}
          >
            Filename: {file.name}
          </h5>
          <p style={{ fontWeight: "300", fontFamily: "Open Sans" }}>
            {statusText}.
          </p>
          <div className="progress">
            <div className="determinate" style={{ width: "100%" }} />
          </div>
        </div>
      );
    } else {
      status = (
        <div className="col-sm-11" style={{ textAlign: "left" }}>
          <i className="fa fa-spinner fa-spin fa-2x fa-fw pull-right" />
          <h5
            style={{
              fontWeight: "600",
              fontFamily: "Open Sans",
              marginTop: "0px"
            }}
          >
            Filename: {file.name}
          </h5>
          <p
            style={{
              fontWeight: "300",
              fontFamily: "Open Sans",
              marginBottom: "0px"
            }}
          >
            Status: {file.meta ? file.meta.job_status : "Uploading..."}
          </p>
          <div className="progress">
            <div className="indeterminate" />
          </div>
        </div>
      );
    }

    return (
      <div className="hpanel" style={{ marginBottom: "20px" }}>
        <div
          className="panel-body"
          style={{
            padding: "0px",
            paddingLeft: "10px",
            paddingRight: "10px",
            border: "0px"
          }}
        >
          <div className="row">
            <div className="col-sm-1">
              <img
                src={excelImage}
                style={{ opacity: 0.5, width: "100%" }}
                alt="excel_image"
              />
            </div>

            {status}
          </div>
        </div>
      </div>
    );
  }

  render() {
    if (this.state.showFailureMessage) {
      return (
        <div className="row">
          <div className="col-lg-12">
            <div
              className="alert alert-danger text-left"
              style={{ fontSize: "12px" }}
            >
              <strong>Uh Oh!</strong> We could not visualize your uploaded
              reports correctly. Most likely, you uploaded the incorrect
              transaction reports, or there is no data in the file to use to
              generate the report.
              <br />
              <br />
              If the problem persists, please message support.
            </div>
            <br />
            <div className="text-center">
              <button
                className="btn btn-primary"
                onClick={this.startOver.bind(this)}
              >
                START OVER
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (this.state.accepted.length > 0) {
      var acceptedFiles = this.state.accepted.map(f =>
        this.generateFileView(f)
      );
      return (
        <div className="row">
          <div className="col-lg-12">{acceptedFiles}</div>
        </div>
      );
    }

    return (
      <div className="row" style={{ height: "100%" }}>
        <div className="col-lg-12" style={{ height: "100%" }}>
          <DropzoneContainer>
            <Dropzone
              className="dropzone-component"
              activeClassName="dropzone-component-active"
              onDrop={this.onDrop.bind(this)}
              disabled={this.state.disabled}
            >
              <img
                src={upload_icon}
                style={{ opacity: 0.5, width: "100px" }}
                alt="upload_icon"
              />
              <h1 style={{ marginBottom: "0px" }}>Drag & Drop</h1>
              <p style={{ fontWeight: 600, color: "#aaa" }}>
                YOUR TRANSACTION REPORT HERE
                <br />
              </p>
            </Dropzone>
          </DropzoneContainer>
        </div>
      </div>
    );
  }
}

export default withRouter(TransactionReportUploader);
