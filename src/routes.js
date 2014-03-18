import React, { Component } from "react";
import { Route, Redirect } from "react-router";
import { Switch, Router } from "react-router-dom";
import { connect } from "react-redux";

import Landing from "./views/pages/landing";
import SignIn from "./views/pages/signin";
import Register from "./views/pages/register";
import Page404 from "./views/pages/404";
import Reset from "./views/pages/reset";
import ForgetPass from "./views/pages/forget";
import IncomeReport from "./views/pages/accounting/IncomeReport";
import ReportViewer from "./views/pages/accounting/IncomeReport/ReportViewer";
import Expenses from "./views/pages/accounting/Expenses";
import ThankYou from "./views/pages/thankyou";


// dashboard pages
import Dashboard from "./Dashboard";
import BoxContents from "./views/pages/box_contents";
import Address from "./views/pages/address";
import History from "./views/pages/history";
import ListingFlow from "./views/pages/batch";
//import HoldingArea from "./views/pages/holding_area";
import ConditionNotes from "./views/pages/condition_notes";
import Settings from "./views/pages/settings";
import Notification from "./shared/components/notification";
import Membership from "./views/pages/membership";
import ProfitAnalytics from "./views/pages/profit_analytics";
import ProfitReportViewer from "./views/pages/profit_analytics/reportViewer";
import Inventory from "./views/pages/inventory";
import Stats from "./views/pages/stats";
import MainDashboard from "./views/pages/main_dashboard";
import Leaderboard from "./views/pages/leaderboard";
import Guide from "./views/pages/guide";

import FBShare from "./views/pages/fb_share";
import Onboarding_v2 from "./views/pages/onboarding_v2";


// global modals
import BugReportingModal from "./shared/components/bugReportingModal";

import authActions from './redux/auth/actions';

let {adminLogin} = authActions;

const RestrictedRoute = ({ component: Component, isLoggedIn, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      isLoggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

class PublicRoutes extends Component {

  constructor(props) {
    super(props);
    this.ref = {};
  }

  renderAdminLoginRoute(match) {
    let id = match.params.id;
    let authData = {id};
    this.props.adminLogin(authData);
    return null;
  }

  render() {
    const { history, isLoggedIn } = this.props;

    return (
      <div>
        <Notification />
        <BugReportingModal />
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route path="/signin" render={() => (
              isLoggedIn ? (
                <Redirect to="/dashboard/history?limit=15"/>
              ) : (
                <SignIn />
              )
            )}/>
            <Route exact path="/thankyou" component={ ThankYou } />
            <Route path="/admin_login/:id" render={(props) => this.renderAdminLoginRoute(props.match)} />
            <Route exact path="/register" component={Register} />
            <Route path="/register/:offer" component={Register} />
            <Route path="/reset_password"  component={Reset} />
            <Route path="/forget_password"  component={ForgetPass} />
			<Route path="/fbshare/:user_id/:image_id"  component={FBShare} />
            <Route component={Page404} path="/pages/404" />
            <Route path="/dashboard">
              <Dashboard>
                <Switch>
                  <RestrictedRoute
                    path="/dashboard/stats"
                    component={Stats}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/home"
                    component={MainDashboard}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/settings"
                    component={Settings}
                    isLoggedIn={isLoggedIn}
                  />
				  {/*
                  <RestrictedRoute
                    path="/dashboard/holding_area"
                    component={HoldingArea}
                    isLoggedIn={isLoggedIn}
				  />
				  */}
                  <RestrictedRoute
                    path="/dashboard/box_contents"
                    component={BoxContents}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/history"
                    component={History}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/batch/:id"
                    component={ListingFlow}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/address"
                    component={Address}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/condition_notes"
                    component={ConditionNotes}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/inventory"
                    component={Inventory}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/membership"
                    component={Membership}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    exact
                    path="/dashboard/profit_analytics"
                    component={ProfitAnalytics}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/profit_analytics/report_viewer/:uuid"
                    component={ProfitReportViewer}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    exact
                    path="/dashboard/accounting/income_report"
                    component={IncomeReport}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/accounting/income_report/view/:uuid"
                    component={ReportViewer}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/accounting/expenses"
                    component={Expenses}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/onboarding"
                    component={Onboarding_v2}
                    isLoggedIn={isLoggedIn}
				  />
                  <RestrictedRoute
                    path="/dashboard/leaderboard"
                    component={Leaderboard}
                    isLoggedIn={isLoggedIn}
                  />
                  <RestrictedRoute
                    path="/dashboard/guide"
                    component={Guide}
                    isLoggedIn={isLoggedIn}
                  />
                </Switch>
              </Dashboard>
            </Route>
            {/* default */}
            <Route component={Page404} path="/404" />
            <Redirect from="*" to="/404" />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.get("access_token") !== null,
    ...state.Auth.toJS(),
    printerDefaults: state.Settings.get("printerDefaults"),
  }),
  {adminLogin}
)(PublicRoutes);
