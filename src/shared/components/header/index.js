import React from "react";
import screenfull from "screenfull";
import { NavLink } from "react-router-dom";
import { UncontrolledTooltip } from 'reactstrap';
// icons
import IconFullScreen from "react-icons/lib/md/crop-free";
import IconMenu from "react-icons/lib/md/menu";
import IconNotification from "react-icons/lib/md/notifications-none";
import IconGuide from "react-icons/lib/md/help";
import IconBulb from "react-icons/lib/fa/lightbulb-o";
import IconManual from "react-icons/lib/md/help";
import { HeadwayAccount, accelerlistHelpDocsURL, featureRequestsURL } from "../../../config/mediaLinks";

// style
import "./style.css";
class Header extends React.Component {
  state = {
    unseenNotificationCount: 0,
    showWidget: false
  }
  componentDidMount() {
    const self = this;
    self.initNotificationsWidget();
    setInterval(() => {
      self.initNotificationsWidget();
    }, 1 * 60 * 1000);
  }

  initNotificationsWidget = () => {
    const self = this;
    const { showWidget } = this.state;
    const HW_config = {
      selector: ".iconNotification",
      account: HeadwayAccount,
      trigger: ".triggerNotificationPopover",
      callbacks: {
        onWidgetReady: () => self.getNotifications(),
        onShowWidget: () => self.setShowWidgetValue(true),
        onHideWidget: () => {
          self.setShowWidgetValue(false);
          self.getNotifications();
        }
      }
    }
    if (!showWidget) {
      window.Headway.init(HW_config);
    }
  }
  setShowWidgetValue = (value) => {
    if (value) {
      this.setState({
        showWidget: true
      })
    } else {
      this.setState({
        showWidget: false
      })
    }
  }
  getNotifications = () => {
    const { unseenNotificationCount } = this.state;
    const currentUnseenNotificationCount = window.Headway.getUnseenCount();
    if (unseenNotificationCount !== currentUnseenNotificationCount) {
        this.setState({
          unseenNotificationCount: currentUnseenNotificationCount
        })
    }
  }
  render() {
    const { unseenNotificationCount } = this.state;
    return (
      <header className="site-head d-flex align-items-center justify-content-between">
        <div className="wrap mr-4">
          <IconMenu size="28" color="#fff" onClick={this.props.toggleNav} style={{cursor: "pointer"}}/>
        </div>
        <div className="right-elems ml-auto d-flex">
          <div className="wrap">
            <div>
              <NavLink
                to="/dashboard/guide"
              >
                <IconGuide
                  size="20"
                  color="#fff"
                  className="icon"
                />
                <span className="text">Watch Beginner Tutorials</span>
              </NavLink>
            </div>
		  </div>
          <div className="wrap hidden-sm-down">
            <a href={accelerlistHelpDocsURL} target="_blank" rel="noopener noreferrer" id="manual">
              <IconManual size="28" color="#fff" />
            </a>
            <UncontrolledTooltip placement="left" delay={{hide: 0}} target="manual">Go to Manual</UncontrolledTooltip>
          </div>
          <div className="wrap hidden-sm-down">
            <a href={featureRequestsURL} target="_blank" rel="noopener noreferrer" id="feature-request">
              <IconBulb size="28" color="#fff" />
            </a>
            <UncontrolledTooltip placement="left" delay={{hide: 0}} target="feature-request">Suggest a Feature</UncontrolledTooltip>
          </div>
          <div className="wrap notify hidden-sm-down">
            <div>
              <IconNotification
                size="28"
                color="#fff"
                className="triggerNotificationPopover"
                id="notificationToggle"
              />
              {
                unseenNotificationCount && unseenNotificationCount > 0
                ? (
                  <span className="badge badge-danger">{unseenNotificationCount}</span>
                )
                : ""
              }
              <div className="iconNotification" />
            </div>
            <UncontrolledTooltip placement="left" delay={{hide: 0}} target="notificationToggle">Show Notification</UncontrolledTooltip>
          </div>
          <div className="wrap hidden-sm-down">
            <IconFullScreen size="28" color="#fff" onClick={() => screenfull.toggle()} id="toggleFullscreen" />
            <UncontrolledTooltip placement="left" delay={{hide: 0}} target="toggleFullscreen">Toggle Fullscreen</UncontrolledTooltip>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;

