import React from "react";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import { Button, Collapse } from "reactstrap";
// icons
import IconDashboard from "react-icons/lib/md/dashboard";
import ScrollArea from "../scrollbar";
import TiHeartFullOutline from "react-icons/lib/ti/heart-full-outline";
import IconHistory from "react-icons/lib/md/history";
import IconBoxContent from "react-icons/lib/md/check-box-outline-blank";
import IconBolt from "react-icons/lib/fa/bolt";
import IconSettings from "react-icons/lib/md/settings";
import IconConditionNotes from "react-icons/lib/md/note";
import IconInventory from "react-icons/lib/io/ios-box";
import IconLogout from "react-icons/lib/md/power-settings-new";
//import IconHoldingArea from "react-icons/lib/md/pan-tool";
import IconChart from "react-icons/lib/md/insert-chart";
import IconDown from 'react-icons/lib/md/chevron-right';
import IconAdmin from "react-icons/lib/md/account-box";
import IconTrophy from "react-icons/lib/io/trophy";
import batchActions from "../../../redux/batch/actions";
import addressActions from "../../../redux/address/actions";
import authActions from "../../../redux/auth/actions";

import "./style.css";
import { lifetimeBadge } from '../../../assets/images';

const { showBatchModal, hideBatchModal } = batchActions;
const { fetchAdressList } = addressActions;
const { navBarIndexRequest, logout } = authActions;

const NavHead = ({ userData, mini, toggleNav }) => (
  <header className="nav-head">
    <NavLink to="/dashboard">
      <h4>ACCELERLIST</h4>
	  {userData && userData.lifetime_user ?
        <div className="d-flex justify-content-between align-items-center">
          <span>LIFETIME MEMBER</span>
          <span className="ml-1"><img src={lifetimeBadge} alt="Lifetime Badge" /></span>
	    </div>
		: null }
		{userData && userData.lifetime_user ?
			null: (
      userData && userData.businessName ? (
        <p>
          We <TiHeartFullOutline className="heart-icon" />{" "}
          {userData.businessName}
        </p>
      ) : (
        <p style={{ fontSize: "13px" }}>
          Faster <span role="img" aria-label="lightning">⚡️</span> workflows
        </p>
      ))
	}
    </NavLink>
    <div className={`toggle-dot ${mini ? "active" : ""}`} onClick={toggleNav} />
    { userData && !isNaN(userData.trialRemaining) && userData.trialRemaining !== null
        ? (
          <div style={{display: "flex", justifyContent: "center"}}>
            <div className="trial-badge">
              { userData.trialRemaining === 1
                ? `${userData.trialRemaining} day left free trial`
                : `${userData.trialRemaining} days left free trial`
              }
            </div>
          </div>
        ) : ""
    }
  </header>
);

class NavList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: -1,
      submenuOpen: false
    };
  }

  toggleSubmenu = () => {
    this.setState({
      submenuOpen: !this.state.submenuOpen
    });
  }

  handleClick = (index, e) => {
    let c = e.currentTarget.className;
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      selected: c.indexOf("selected") >= 0 ? "" : index
    });
  };

  handleOpen = (index, e) => {
    e.stopPropagation();
    this.setState({
      selected: index
    });
  };

  logoutUser(){
    const {
      logout,
	} = this.props;
	window.Intercom('shutdown');
	window.Intercom('boot', {
		app_id: 'u101fkvi',
	});
	logout();
  }

  showBatchModal = () => {
    this.props.showBatchModal();
    this.props.fetchAdressList();
  };
  render() {
    const {
      navBarIndexRequest,
      navBarIndex,
      userData
    } = this.props;
    console.log("UserData: ", userData);
    return (
      <ScrollArea
        className="nav-list-container"
        horizontal={false}
        verticalScrollbarStyle={{ width: "4px", marginLeft: "10px" }}
      >
        <ul className="list-unstyled nav-list clearfix">
          <li className="batch-button-container">
            <Button color="primary" onClick={this.showBatchModal}>
              Create Batch
            </Button>
          </li>
          <li onClick={() => navBarIndexRequest(0)}>
            <NavLink
              to="/dashboard/home"
              activeClassName={navBarIndex === 0 ? "active" : ""}
            >
              <IconDashboard
                size="18"
                color="#2962FF"
                className="icon-dashboard"
              />
              <span className="name">Dashboard</span>
            </NavLink>
          </li>
          {
            !!userData && !!userData.role && userData.role === 'admin' &&
            <li onClick={() => navBarIndexRequest(10)}>
              <NavLink
                to="/dashboard/stats"
                activeClassName={navBarIndex === 10 ? "active" : ""}
              >
                <IconAdmin
                  size="18"
                  color="#2962FF"
                  className="icon-dashboard"
                />
                <span className="name">Admin</span>
              </NavLink>
            </li>
          }
          <li onClick={() => navBarIndexRequest(1)}>
            <NavLink
              to="/dashboard/history"
              activeClassName={navBarIndex === 1 ? "active" : ""}
            >
              <IconHistory
                size="18"
                color="#2962FF"
                className="icon-history"
              />
              <span className="name">Batch History</span>
            </NavLink>
          </li>
          <li onClick={() => navBarIndexRequest(2)}>
            <NavLink
              to="/dashboard/inventory"
              activeClassName={navBarIndex === 2 ? "active" : ""}
            >
              <IconInventory
                size="18"
                color="#2962FF"
              />
              <span className="name">Inventory</span>
            </NavLink>
          </li>
          <li onClick={() => navBarIndexRequest(3)}>
            <NavLink
              to="/dashboard/box_contents"
              activeClassName={navBarIndex === 3 ? "active" : ""}
            >
              <IconBoxContent
                size="18"
                color="#2962FF"
                className="icon-box-content"
              />
              <span className="name">Box Contents</span>
            </NavLink>
          </li>
		  {/*
          <li onClick={() => navBarIndexRequest(3)}>
            <NavLink
              to="/dashboard/holding_area"
              activeClassName={navBarIndex === 3 ? "active" : ""}
            >
              <IconHoldingArea
                size="18"
                color="#2962FF"
                className="icon-box-content"
              />
              <span className="name">Holding Area</span>
            </NavLink>
		  </li>
		  */}
          <li onClick={(e) => {
               if(!e.target.closest('.submenu')) {
                 this.toggleSubmenu();
               }
             }
           }>
             <a role="button">
               <IconChart
                 size="18"
                 color="#2962FF"
                 className="icon-chart"
               />
               <span className="name">Accounting</span>
               <IconDown size="14" className="icon-down" />
             </a>
             <Collapse
               isOpen={this.state.submenuOpen}
             >
               <ul className="submenu inner-drop list-unstyled">
                 <li>
                   <NavLink
                     to="/dashboard/accounting/income_report"
                     onClick={() => navBarIndexRequest(11)}
                     activeClassName={navBarIndex === 11 ? "active" : ""}
                   >
                     Income Report
                   </NavLink>
                 </li>
                 <li>
                   <NavLink
                     to="/dashboard/accounting/expenses"
                     onClick={() => navBarIndexRequest(12)}
                     activeClassName={navBarIndex === 12 ? "active" : ""}
                     >
                     Add/Track Expenses
                   </NavLink>
                 </li>
               </ul>
             </Collapse>
           </li>
          {/*}
          <li onClick={() => navBarIndexRequest(3)}>
            <NavLink
              to="/dashboard/inventory"
              activeClassName={navBarIndex === 3 ? "active" : ""}
            >
              <IconInventory
                size="18"
                color="#2962FF"
                className="icon-inventory"
              />
              <span className="name">Inventory</span>
            </NavLink>
          </li>
          {*/}
          {/*}
          <li onClick={() => navBarIndexRequest(4)}>
            <NavLink
              to="/dashboard/profit_analytics"
              activeClassName={navBarIndex === 4 ? "active" : ""}
            >
              <IconAnalytics size="18" />
              <span className="name">Analytics</span>
              <IconDown size="14" className="icon-down" />
            </NavLink>
            <Collapse
              isOpen={navBarIndex === 4 ? true : false}
              onClick={() => navBarIndexRequest(4)}
            >
              <ul className="inner-drop list-unstyled">
                <li>
                  <NavLink to="/dashboard/income_report">Income Report</NavLink>
                </li>
                <li>
                  <NavLink to="/ui/typography">Sales</NavLink>
                </li>
                <li>
                  <NavLink to="/ui/cards">Returns</NavLink>
                </li>
                <li>
                  <NavLink to="/ui/modals">Reimbursements</NavLink>
                </li>
                <li>
                  <NavLink to="/dashboard/reprice_report/1">Reprice Report</NavLink>
                </li>
                <li>
                  <NavLink to="/ui/notification">Other Income</NavLink>
                </li>
                <li>
                  <NavLink to="/ui/extras">Other Expenses</NavLink>
                </li>
              </ul>
            </Collapse>
          </li>
          {*/}
          
          <li onClick={() => navBarIndexRequest(6)} >
            <a
              target="_blank"
              rel="noopener noreferrer"
			  disabled={true}
            >
              <IconBolt
                size="18"
                color="#2962FF"
                className="icon-feature-request"
              />
			  <span className="name">Profit Reprice<span role="img" aria-label="TM">™️</span></span>
            </a>
          </li>
          {/*}
                <li onClick={this.handleClick.bind(this, 6)} className={(this.state.selected === 6) ? 'selected': ''}>
                    <NavLink to="/dashboard/create_template">
                        <IconDashboard size="18" color="#2962FF" className="icon-dashboard"/>
                        <span className="name">Templates</span>
                    </NavLink>
                </li>
                */}
          <li onClick={() => navBarIndexRequest(7)}>
            <NavLink
              to="/dashboard/settings"
              activeClassName={navBarIndex === 7 ? "active" : ""}
            >
              <IconSettings
                size="18"
                color="#2962FF"
                className="icon-settings"
              />
              <span className="name">Settings</span>
            </NavLink>
          </li>
          <li onClick={() => navBarIndexRequest(8)}>
            <NavLink
              to="/dashboard/condition_notes"
              activeClassName={navBarIndex === 8 ? "active" : ""}
            >
              <IconConditionNotes
                size="18"
                color="#2962FF"
                className="icon-condition-notes"
              />
              <span className="name">Condition Notes</span>
            </NavLink>
          </li>
          <li onClick={() => navBarIndexRequest(9)}>
            <NavLink
              to="/dashboard/leaderboard"
              activeClassName={navBarIndex === 9 ? "active" : ""}
            >
              <IconTrophy
                size="18"
                color="#2962FF"
                className="icon-leaderboard"
              />
              <span className="name">Leaderboard</span>
            </NavLink>
          </li>          
          <li onClick={this.logoutUser.bind(this)}>
            <a>
              <IconLogout
                size="18"
                color="#2962FF"
              />
              <span className="name">Logout</span>
            </a>
          </li>
        </ul>
        {/* end scroll-area */}
      </ScrollArea>
    );
  }
}

export default connect(
  state => ({
    batchModalVisible: state.Batch.get('batchModalVisible'),
    navBarIndex: state.Auth.get('navBarIndex'),
    userData: state.Auth.get('userData'),
  }),
  {
    showBatchModal,
    hideBatchModal,
    fetchAdressList,
    navBarIndexRequest,
    logout
  }
)(props => {
  console.log(props)
  return (
    <nav className={`site-nav ${props.mini ? "mini" : ""}`}>
      <NavHead {...props} />
      <NavList {...props} />
    </nav>
  )
});
