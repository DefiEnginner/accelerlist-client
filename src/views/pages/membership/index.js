import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Col,
  Card,
  CardBody,
  Row
} from 'reactstrap';
import membershipActions from '../../../redux/membership/actions';
import PlanCard from './displays/PlanCard';
import BillingCard from './displays/BillingCard';
import SweetAlert from 'sweetalert2-react';

const ViewHeader = () => (
  <div className="view-header">
      <header className="text-white">
          <h1 className="h5 title text-uppercase">Membership</h1>
      </header>
  </div>
);

const ViewContent = ({children}) => (
  <div className="view-content view-components">
    <Card>
      <CardBody>
        {children}
      </CardBody>
    </Card>
  </div>
);

class Membership extends Component {
  componentDidMount(){
    this.props.fetchMembership();
  }

	render() {
    const {
      source, subscription, updateMembershipBilling,
      closeMembershipAlert, showMembershipAlert, currentAlert,
      resetCardReplacementRequestStatus, cardReplacementRequestStatus
    } = this.props;
		return (
      <div className="view">
        <ViewHeader />
        <ViewContent>
          <Row>
            <Col xs="6">
              <PlanCard subscription={subscription}/>
            </Col>
            <Col xs="6">
             <BillingCard
              source={source}
              updateMembershipBilling={updateMembershipBilling}
              showMembershipAlert={showMembershipAlert}
              cardReplacementRequestStatus={cardReplacementRequestStatus}
              resetCardReplacementRequestStatus={resetCardReplacementRequestStatus}
            />
            </Col>
          </Row>
        </ViewContent>
        {
          (currentAlert) &&
          (
            <SweetAlert
              show={currentAlert !== null}
              title={currentAlert.type}
              icon="warning"
              text={currentAlert.message}
              confirmButtonColor={"#3085d6"}
              onConfirm={closeMembershipAlert}
            />
          )
        }
      </div>
		);
	}
}

Membership.propTypes = {
  fetchMembership: PropTypes.func.isRequired,
  source: PropTypes.object,
  subscription: PropTypes.object.isRequired,
  updateMembershipBilling: PropTypes.func.isRequired,
  showMembershipAlert: PropTypes.func.isRequired,
  closeMembershipAlert: PropTypes.func.isRequired,
  resetCardReplacementRequestStatus: PropTypes.func.isRequired,
  currentAlert: PropTypes.object,
  cardReplacementRequestStatus: PropTypes.string
};

const mapStateToProps = state => ({
  source: state.Membership.get('source'),
  subscription: state.Membership.get('subscription'),
  currentAlert: state.Membership.get('currentAlert'),
  cardReplacementRequestStatus: state.Membership.get('cardReplacementRequestStatus')
})


export default connect( mapStateToProps, membershipActions )(Membership);
