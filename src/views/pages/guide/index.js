import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import './style.css';

const content = [
  { title: 'Settings and Application Walkthrough', video_id: 'xa4040360p' },
  { title: 'Creating your first batch in AccelerList', video_id: 'veu3wjg6yg' },
  { title: 'Creating Condition Notes', video_id: '78wx9uvgud' },
  { title: 'Using the Box Content Manager', video_id: '49nadwuuj9' },
  { title: 'Congratulations! You\'ve completed this guide' }
]

class Guide extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current: 0,
      completed: false
    }
  }

  componentDidMount() {
    if (!document.getElementById("wistia_script")) {
      var wistiaScript = document.createElement("script");
      wistiaScript.id = "wistia_script"
      wistiaScript.type = "text/javascript"
      wistiaScript.src = "https://fast.wistia.com/assets/external/E-v1.js"
      wistiaScript.async = true
      document.body.appendChild(wistiaScript);
    }

  }

  next = () => {
    const current = this.state.current;
    const maxIdxBeforeCompleted = content.length - 2;

    if(current < maxIdxBeforeCompleted) {
      this.setState({
        current: this.state.current + 1
      });
    } else {
      this.setState({
        current: this.state.current + 1,
        completed: true
      })
    }
  }

  go = (idx) => {
    const maxIdxBeforeCompleted = content.length - 2;

    if(idx <= maxIdxBeforeCompleted) {
      this.setState({
        current: idx,
        completed: false
      });
    }
  }

  render() {
    const {
      current,
      completed
    } = this.state;

    return(
      <div className="view">
        <div className="view-content guide mt-0">
          <h2 className="h4">Beginner's Guide</h2>
          <p>Let’s learn everything you need to know about AccelerList</p>

          <Card className="mt-4">
            <Row>
              <Col md={8} className="video-container">
                <CardBody>
                  {completed === false ?
                  <Fragment>
                    <div>
                      <iframe
                        src={`//fast.wistia.net/embed/iframe/${content[current].video_id}?videoFoam=true&playerColor=00c853`}
                        allowtransparency="true"
                        frameborder="0"
                        scrolling="no"
                        class="wistia_embed"
						title="wistia embed"
                        name="wistia_embed" allowfullscreen mozallowfullscreen webkitallowfullscreen oallowfullscreen msallowfullscreen width="720" height="449">
                      </iframe>
                    </div>
                    <Button className="mt-4" onClick={this.next}>Skip this video</Button>
                  </Fragment>
                  :
                    <div className="complete">
                      <div>
                        <h3 className="h4">Congratulations!</h3>
                        <p>You've completed this guide</p>
                        <Link to="/dashboard/home" className="btn btn-primary">Close this guide and go to Dashboard</Link>
                      </div>
                    </div>
                  }
                </CardBody>
              </Col>
              <Col md={4}>
                <CardBody>
                  <h3 className="h5 mb-3">Table of Content</h3>
                  <ListGroup>
                    {
                      content.map((item, idx) => (
                        <ListGroupItem
                          key={idx}
                          tag="button"
                          action
                          active={current === idx}
                          onClick={() => this.go(idx)}
                          disabled={idx === content.length-1}
                          >
                          {idx+1}. {item.title}
                        </ListGroupItem>
                      ))
                    }
                  </ListGroup>
                </CardBody>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    );
  }
}

export default Guide;
