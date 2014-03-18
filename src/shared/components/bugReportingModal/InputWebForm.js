import React, { Component } from "react";
import { connect } from "react-redux";
import { func, array, bool } from "prop-types";
import { Input, Row, Col, Button } from "reactstrap";

import { thinking_face, hands_in_celebration } from "../../../assets/images";
import IconPhoto from "react-icons/lib/md/photo-camera";
import IconVideoCam from "react-icons/lib/md/videocam";
import IconCheck from "react-icons/lib/md/check";
import IconTimer from "react-icons/lib/md/timer";
import IconXing from "react-icons/lib/go/x";
import { CustomLabelInputFile, BlinkerDiv } from "./styles";
import bugReportingActions from "../../../redux/bug_reporting/actions";
import { PulseLoader } from "react-spinners";

class InputWebForm extends Component {
  static propTypes = {
    uploadBugReportingImgRequest: func,
    bugReportingImages: array,
    sendTicketToExecution: func,
    sendTicketConfirmation: bool
  }

  state = {
    descriptionOfBug: "",
    videoLink: ""
  }

  onLoadImg = (e) => {
    const files = e.target.files || null;
    const { uploadBugReportingImgRequest } = this.props;
    if (files) {
      Object.keys(files).forEach( element => {
        uploadBugReportingImgRequest(files[element]);
      })
    }
  }

  onSubmitTicket = () => {
    const { descriptionOfBug, videoLink } = this.state;
    this.props.sendTicketToExecution(descriptionOfBug, videoLink);
  }

  render() {
    const { 
      bugReportingImages,
      sendTicketConfirmation,
      sendTicketStatus
    } = this.props;
    return (
      <div>
        <Row>
          <Col>
            <span>What the heck happened? </span>
            <img
              src={thinking_face}
              style={{ width: '20px' }}
              alt="thinking_face_pic"
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col>
            <Input
              type="textarea"
              rows={7}
              onChange={(e) => this.setState({ descriptionOfBug: e.target.value})}
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs="3">
            Attach screenshots. 
            <IconPhoto size={'20px'} style={{ marginLeft: '10px'}} />
          </Col>
          <Col xs="3">
            Share FREE Loom video.  
            <IconVideoCam size={'20px'} style={{ marginLeft: '10px'}} />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs="3">
            <input 
              onChange={this.onLoadImg}
              type="file"
              id="file"
              multiple="multiple"
              accept="image/*"
              style={{ display: 'none'}}
            />
            <CustomLabelInputFile 
              htmlFor="file"
              className="btn btn-primary"
            >
              <span>Upload Images</span>
            </CustomLabelInputFile>
          </Col>
          <Col xs="3">
            <Input 
              placeholder="Paste link here for us to review"
              onChange={(e) => this.setState({ videoLink: e.target.value})}
            />
          </Col>
        </Row>
        <br />
            {
              bugReportingImages.map( element => {
                return(
                  <Row key={Math.random()}>
                    <Col>
                      <div style={{ color: '#e5695e' }}>
                        {element.fileName}
                        <span style={{ marginLeft: '20px' }}>
                          { 
                            element.status === 'loading' && <IconTimer size={'20px'} color="black"/>
                          }
                          {
                            element.status === 'failure' && <IconXing size={'20px'} color="red" />
                          }
                          {
                            element.status === 'loaded' && <IconCheck size={'20px'} color="green" />
                          }
                        </span>
                      </div>
                    </Col>
                  </Row>
                )
              })
            }
        <hr />
        <Row>
          <Col>
            <span>Submit Support Ticket  </span>
            <img
              src={hands_in_celebration}
              style={{ width: '20px', height: '20px'}}
              alt="hands_in_celebration_pic"
            />
          </Col>
        </Row>
        <br />
        <Row>
          <Col xs="2">
            <Button 
              color="success"
              onClick={this.onSubmitTicket}
              disabled={sendTicketStatus === "execution"}
              style={{width: '175px'}}
            >
              {
                sendTicketStatus === "execution" ?
                (
                  <div className='sweet-loading'>
                    <PulseLoader
                      sizeUnit={"px"}
                      size={9}
                      color={'white'}
                      loading={true}
                    />
                  </div>
                ) : 'Submit Ticket'
              }
            </Button>
          </Col>
          <Col xs="10">
            {
              sendTicketConfirmation
              ? 
                <BlinkerDiv>
                  Support tickets with videos or screenshots get solved 3 times as fast, can you add one?
                </BlinkerDiv>
              : ""
            }
          </Col>
        </Row>
      </div>
    );
  }
}

export default connect(
  state => ({
    sendTicketStatus: state.BugReporting.get("sendTicketStatus"),
    bugReportingImages: state.BugReporting.get("bugReportingImages")
  }),
  bugReportingActions
)(InputWebForm);
