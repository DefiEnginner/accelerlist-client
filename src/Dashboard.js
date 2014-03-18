import React from "react";
import { connect } from "react-redux";
import { object } from "prop-types";
import { withRouter } from "react-router";
import Nav from "./shared/components/nav";
import SiteHead from "./shared/components/header";
import MWSAuthorizeModal from "./shared/components/mwsAuthorizeModal";
import CreateBatchModal from "./shared/components/createBatchModal";
import PrintServiceComponent from "./shared/components/PrintServiceComponent";
//import { sha256 } from 'js-sha256';
import authActions from "./redux/auth/actions";
/*
import {
	//frontChatUserIdentity,
	wootricAccountToken } from "./config/mediaLinks";
*/
import "./app.css";
import { Button } from "reactstrap";
import { clearToken } from "./helpers/utility";

const {
  refreshToken,
  getUserInternationalizationConfig,
	openMwsAuthorizeModal,
	redirectToOnboarding,
	getUser,
} = authActions;

class Dashboard extends React.Component {
  static propTypes = {
    location: object.isRequired
  }

  constructor(props) {
	  super(props);
	  this.state = {
		  navMini: false,
		  showRefreshButton: false,
	  };
  }

  UNSAFE_componentWillReceiveProps(newProps) {
    const { token_valid } = this.props;
    if (!token_valid && newProps.token_valid) {
        this.props.getUserInternationalizationConfig();
      }
  }

  UNSAFE_componentWillMount() {
	if(!this.props.token_valid){
		this.props.refreshToken();
	}

    setTimeout(() => {
		this.setState({showRefreshButton: true});
    }, 15000);
  }

  UNSAFE_componentDidMount() {
    this.props.refreshToken();

    setInterval(() => {
      this.authClientMiddleware();
    }, 1 * 60 * 1000);
    };

  componentDidUpdate(prevProps) {
	if(this.props.userData && this.props.userData.settings){
		if(!this.props.userData.settings.is_onboarded
			&& this.props.location.pathname !== "/dashboard/onboarding"){
			this.checkMWSAuthorization();
		}
	}
		  /*
    if (this.props.credentialVerified !== prevProps.credentialVerified) {
      this.checkMWSAuthorization();
	}*/

    if (!prevProps.userData && this.props.userData && this.props.userData.email) {
      const { email, userName,  } = this.props.userData;
		//var hash = sha256.hmac(frontChatUserIdentity, email);
      if (email) {
        // init FrontChat
	    //window.FrontChat('identity', { email: email, userHash: hash });
		window.Intercom('boot', {
			app_id: 'u101fkvi',
			name: userName, // Full name
			email: email, // Email address
		});

        //init wootric
		/*
        window.wootricSettings = {
          email: email,
          created_at: Math.round((new Date()).getTime() / 1000),
          account_token: wootricAccountToken
        };
		window.wootric('run');
		*/
      };
    }
  };

  authClientMiddleware = () => {
    if (new Date(localStorage.getItem("expires_in")) <= new Date()) {
      this.props.refreshToken();
    }
  };

  toggleNav = e => {
    e.preventDefault();
    this.setState({ navMini: !this.state.navMini });
  };

  hideNav = e => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ navMini: true });
  };

  checkMWSAuthorization = () => {
	  /*
    const { credentialVerified, openMwsAuthorizeModal } = this.props;
    if (credentialVerified === false) {
          openMwsAuthorizeModal();
	}
	*/
	if(!this.props.userData.settings.is_onboarded){
		this.props.redirectToOnboarding();
	}
  };

  loginRefresh = () => {
	  /*
	   * [15-04-2019]
	   * handle 401 on refresh token issue
	   * manifest as stall on login... [blankscren]
	   * will try to clear token and force login again
	   */
	  clearToken();
	  this.props.refreshToken();
	  window.location.reload(true);
  };

  render = () => {
    let navMini = this.state.navMini;
    const { token_valid } = this.props;
	  console.log('token_valid', token_valid);

    return token_valid === true ? (
      <div className="app-wrapper">
        <Nav mini={navMini} toggleNav={this.toggleNav} />
        <PrintServiceComponent />
        <MWSAuthorizeModal />
        <CreateBatchModal history={this.props.history} />

        <div className={`content-container ${navMini ? "full" : ""}`}>
          {/* dropshadow for mobile nav triggering */}
          <div
            className="menu-dropshadow"
            style={{ display: navMini ? "block" : "none" }}
            onClick={this.hideNav}
          />
          <SiteHead toggleNav={this.toggleNav} />

          {this.props.children}
        </div>
      </div>
    ) : (
      <div className="app-wrapper">
		<p>loading...&nbsp;
		{ this.state.showRefreshButton
			? (
				<Button
					type="button"
					color="success"
					onClick={this.loginRefresh}
				>Click here to refresh</Button>)
			: (null)
		}
		</p>
      </div>
    );
  };
}

export default withRouter(
  connect(
    state => ({
      token_valid: state.Auth.get("token_valid"),
      credentialVerified: state.Auth.get("credentialVerified"),
      userData: state.Auth.get("userData"),
    }),
    {
      refreshToken,
      getUserInternationalizationConfig,
		openMwsAuthorizeModal,
		redirectToOnboarding,
		getUser,
    }
  )(Dashboard)
);
