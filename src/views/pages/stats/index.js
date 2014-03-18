import React, { Component, Fragment } from "react";
import {
  Card,
  CardBody,
  CardGroup,
  CardBlock,
  Col,
  Row,
  Label,
  Input,
  FormGroup
} from "reactstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import moment from "moment";
import './style.css';
import LoadingIndicator from "../../../shared/components/LoadingIndicator";
import {
  momentDateToLocalFormatConversion,
	digitСonversion,
} from "../../../helpers/utility";
import statsActions from "../../../redux/stats/actions";
import UpdateUserPassword from '../../../shared/components/UpdateUserPassword';
import AdminSearchUser from '../../../shared/components/AdminSearchUser';
import AdminUsersPerMarketplace from '../../../shared/components/AdminUsersPerMarketplace';
import AdminUsersErrorLogs from '../../../shared/components/AdminUsersErrorLogs';
import AdminUpdateUserToken from '../../../shared/components/AdminUpdateUserToken';
import AdminBatchCreatedChart from '../../../shared/components/AdminBatchCreatedChart';

const { fetchAggregateData } = statsActions;

const statsRangeOptions = [
  { label: "all-time", value: "0"},
  { label: "7", value: "7" },
  { label: "30", value: "30" },
  { label: "90", value: "90" },
];

const ViewHeader = () => (
  <div className="view-header">
    <header className="text-white">
      <h1 className="h5 title text-uppercase">Admin Dashboard</h1>
    </header>
  </div>
);

const ViewContent = ({ children }) => (
  <div className="view-content view-dashboard">
    <Card>
      <CardBody>{children}</CardBody>
    </Card>
  </div>
);

class Stats extends Component {

  state = {
    startStatsRange: null,
    endStatsRange: null,
    statsRange: statsRangeOptions[0]
  };

  UNSAFE_componentWillMount() {
      this.props.fetchAggregateData();
  }

  handleChangeStatsRange = (e) => {
    const range = Number(statsRangeOptions.find(el => el.label === e.target.value).value);
    const statsRange = statsRangeOptions.find(el => Number(el.value) === range);

    if (range && range > 0) {
      const endStatsRange = moment().toISOString();
      const startStatsRange = moment().subtract(range, 'days').toISOString();
      this.setState({
        startStatsRange: momentDateToLocalFormatConversion(endStatsRange),
        endStatsRange: momentDateToLocalFormatConversion(startStatsRange),
        statsRange: statsRange
      });
      this.props.fetchAggregateData(startStatsRange, endStatsRange);
    } else {
      this.props.fetchAggregateData();
      this.setState({
        startStatsRange: null,
        endStatsRange: null,
        statsRange: statsRange
      });
    }
  }

  render() {
    const {
      aggregateData,
      isFetchingAggregateData
    } = this.props;
    const { startStatsRange, endStatsRange, statsRange } = this.state;

    return (
      <div className="view">
        <ViewHeader></ViewHeader>
        <ViewContent>
		<Row>
			<Col xs="12">
				<AdminBatchCreatedChart />
			</Col>
		</Row>
		<Row>
			<Col xs="4">
				<UpdateUserPassword />
			</Col>
			<Col xs="4">
				<AdminSearchUser />
			</Col>
			<Col xs="4">
				<AdminUpdateUserToken />
			</Col>
		</Row>
		<hr />
		<Row>
			<Col xs="6">
				<AdminUsersErrorLogs />
			</Col>
			<Col xs="4">
				<AdminUsersPerMarketplace />
			</Col>
			<Col xs="2">
			</Col>
		</Row>
		<hr />
        {
          !!aggregateData &&
          <div>
            {
              statsRange && statsRange.value > 0
              ? (
                <h4>Stats for Last {statsRange.value} Days: {endStatsRange} - {startStatsRange}</h4>
              ) : (
                <h4>Stats for {`${statsRange.label}`}</h4>
              )
            }

            <br />
            <Col xs="4" style={{ paddingLeft: "0" }}>
              <FormGroup>
                <Label for="exampleSelect">Stats range:</Label>
                <Input
                  type="select"
                  name="select"
                  id="exampleSelect"
                  value={statsRange.label}
                  onChange={this.handleChangeStatsRange}
                >
                  {
                      statsRangeOptions.map(option => (
                        <option>{option.label}</option>
                      ))
                  }
                </Input>
              </FormGroup>
            </Col>
            <br />
            {
              isFetchingAggregateData ? <LoadingIndicator title="Fetching Aggregate Data..."/> : (
                <Fragment>

                  <CardGroup className="stats mb-4">

                    <Card>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small">Box Contents</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.box_content ? digitСonversion(aggregateData.box_content, 'decimal') : 0}</h4>
                      </CardBlock>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small text-nowrap">FBA Batches</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.fba_batches ? digitСonversion(aggregateData.fba_batches, 'decimal') : 0}</h4>
                      </CardBlock>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small">MF Batches</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.mf_batches ? digitСonversion(aggregateData.mf_batches, 'decimal') : 0}</h4>
                      </CardBlock>
                    </Card>
                    <Card>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small text-nowrap">Seller Labeled Items</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.labels.SELLER_LABEL ? digitСonversion(aggregateData.labels.SELLER_LABEL, 'decimal') : 0}</h4>
                      </CardBlock>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small text-nowrap">Amazon Labeled Items</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.labels.AMAZON_LABEL_ONLY ? digitСonversion(aggregateData.labels.AMAZON_LABEL_ONLY, 'decimal') : 0}</h4>
                      </CardBlock>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small">Items Listed Using Live Mode</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.workflow.live ? digitСonversion(aggregateData.workflow.live, 'decimal') : 0 }</h4>
                      </CardBlock>
                    </Card>
                    <Card>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small text-nowrap">Items Listed Using Private Mode</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.workflow.private ? digitСonversion(aggregateData.workflow.private, 'decimal') : 0}</h4>
                      </CardBlock>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small text-nowrap"># Holding Area Batches Created</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.holding_area_batches ? digitСonversion(aggregateData.holding_area_batches, 'decimal') : 0}</h4>
                      </CardBlock>
                      <CardBlock>
                        <h6 className="text-uppercase title font-weight-bold small text-nowrap"># Batches Using Auto Price Rule</h6>
                        <h4 className="font-weight-normal mb-0">{!!aggregateData.batches_using_auto_price_rule ? digitСonversion(aggregateData.batches_using_auto_price_rule, 'decimal') : 0}</h4>
                      </CardBlock>
                    </Card>
                  </CardGroup>
                </Fragment>
              )
            }
          </div>
        }

        </ViewContent>
      </div>
    );
  }
}

Stats.propTypes = {
  aggregateData: PropTypes.object,
  isFetchingAggregateData: PropTypes.bool.isRequired
};

export default connect(
  state => {
    return {
      aggregateData: state.Stats.get('aggregateData'),
      isFetchingAggregateData: state.Stats.get('isFetchingAggregateData'),
    };
  },
  {
    fetchAggregateData
  }
)(Stats);
