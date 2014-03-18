import React from "react";
import { Row, Col, Badge, Button, Card, CardBody } from "reactstrap";
import ProfitPopover from "./ProfitPopover";
import FulfillmentCenterBadgeWithPopover from "./FulfillmentCenterBadgeWithPopover";
import Tooltip from "../../../../../shared/components/Tooltip";
import PropTypes from "prop-types";
import { digitСonversion } from "../../../../../helpers/utility";
import batchActions from "../../../../../redux/batch/actions";
import { connect } from "react-redux";
import { PulseLoader } from "react-spinners";
import BatchSearchRow from "./BatchSearchRow";
import { FacebookIcon } from 'react-share';
import { Template30up } from '../../../../../shared/components/Print30up/Template30up';
import PrintTemplate from 'react-print';
import ReactToPrint from 'react-to-print';
import IconPdf from 'react-icons/lib/fa/file-pdf-o';

const {
	submitProductFeed,
	createShipmentPlans,
	updateModalDisplay,
	facebookShare,
} = batchActions;

class BatchMetricsRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profitPopoverOpen: false
    };
  }

  toggleProfitPopover() {
    this.setState({
      profitPopoverOpen: !this.state.profitPopoverOpen
    });
  }

  createShipmentPlans() {
    let {batchMetadata} = this.props;
    let batchId = batchMetadata.id;
    let params = {
      batchId
    }
    this.props.createShipmentPlans(this.props.products, params);
  }

  onButtonClickResubmitFeed = () => {
    const { submitProductFeed, products, batchMetadata } = this.props;
    submitProductFeed(products, batchMetadata, true)
  }

	facebookShare = (netProfit, salesRank) => {
        netProfit = digitСonversion(
          netProfit,
          "currency",
          this.props.internationalization_config.currency_code
        );
		const data = {
			'net_profit': netProfit,
			'sales_rank': salesRank,
		}
		this.props.facebookShare(data);
  }

  render() {
    const {
      submitProductFeed,
      products,
      batchMetadata,
      createShipmentPlansRequestStatus,
	  updateModalDisplay,
	  batchLoaded,
	  searchBatch,
    } = this.props;
    let batchListPrice = null;
    let batchBuyCost = null;
    let batchFees = null;
    let batchNetProfit = null;
    let batchRoi = null;
    let batchProfitMargin = null;
    let sumSalesrank = null;
    let batchSalesrank = null;
    let totalBatchProductsListed = null;
    let totalBatchSKUs = null;
    let totalProductsWeight = null;

    if (!!products) {
      batchListPrice = products.reduce((accumulator, element) => {
        return (
          accumulator + parseFloat(element.price) * parseInt(element.qty, 10)
        );
      }, 0);
      batchBuyCost = products.reduce((accumulator, element) => {
        if (element.buyCost) {
          return (
            accumulator + parseFloat(element.buyCost) * parseInt(element.qty, 10)
          );
        }
        return accumulator;
      }, 0);
      batchFees = products.reduce((accumulator, element) => {
        return (
          accumulator +
          ((parseFloat(element.totalFeeEstimate) || 0) + 0.15 * parseFloat(element.price)) *
            parseInt(element.qty, 10)
        );
      }, 0);
      batchNetProfit = batchListPrice - batchBuyCost - batchFees;

      batchRoi = (batchNetProfit * 100. / batchBuyCost).toFixed(2);
      batchProfitMargin = (batchNetProfit * 100. / batchListPrice).toFixed(2);

      let productsContainingSalesrank = products.filter(
        product => !!product.salesrank
      )
      sumSalesrank = productsContainingSalesrank.reduce((accumulator, element) => {
        return accumulator + parseInt(element.salesrank, 10);
      }, 0);
      batchSalesrank = parseInt(sumSalesrank / productsContainingSalesrank.length, 10);
      totalBatchSKUs = products.length;

      totalProductsWeight = products.reduce((acc, item) => {
        if (!!item.itemWeight) {
          return acc + Number(item.itemWeight);
        }
        return acc;
      }, 0);

      totalBatchProductsListed = products.reduce((acc, item) => {
        if (!!item.qty) {
          return acc + Number(item.qty);
        }
        return acc;
      }, 0);
    }

    let submitFeedButton = (
      <Button
        className="light-bottom-margin light-top-margin"
        color="success"
        onClick={submitProductFeed.bind(null, products, batchMetadata, true)}
      >
        SUBMIT FEED & COMPLETE BATCH
      </Button>
    );
    let submitFeedButtonWorkflowPrivate = (
      <React.Fragment>
        {
          batchMetadata.status === "Completed" ||
            (createShipmentPlansRequestStatus === "complete" && batchMetadata.status === "In Progress")
            ? (
              <Button
                className="light-bottom-margin light-top-margin medium-left-margin"
                color="danger"
                onClick={this.onButtonClickResubmitFeed}
              >
                RESUBMIT FEED
              </Button>
            ) : ""
        }
        {
          createShipmentPlansRequestStatus === ""
          && batchMetadata.status === "In Progress"
          && products.length > 0
            ? (
              <Button
                className="light-bottom-margin light-top-margin medium-left-margin"
                color="success"
                onClick={() => updateModalDisplay("submit_product_feed_warning")}
              >
                Submit Feed Only
              </Button>
            ) : ""
        }
      </React.Fragment>

    );

    let createShipmentPlansButton = (
      <div className="d-flex align-items-center">
		<ReactToPrint
			trigger={() => <Button color="link"><IconPdf color="#a9a9a9" size="20" className="mr-2" /></Button>}
			content={() => this.componentRef}
		/>
        <Button
          className="light-bottom-margin light-top-margin"
          color="success"
          onClick={() => this.createShipmentPlans()}
          disabled={createShipmentPlansRequestStatus === "execution"}
          style={{width: '220px'}}
        >{
          createShipmentPlansRequestStatus === "execution" ?
          (
            <div className='sweet-loading'>
              <PulseLoader
                sizeUnit={"px"}
                size={9}
                color={'white'}
                loading={true}
              />
            </div>
          ) : 'Preview Shipment Plans'
          }
        </Button>
      </div>
    );

    if (batchMetadata.workflowType === "live") {
      let { existingShipments } = this.props;
      let fulfillmentCenters = existingShipments.map((fulfillmentCenter, i) => {
        return (
          <FulfillmentCenterBadgeWithPopover
            key={`batch-metrics-row-existing-shipment-${i}`}
            fulfillmentCenter={fulfillmentCenter}
          />
        );
      });
      const fulfillmentCentersFieldEmpty = (
        <Badge color="badge badge-primary warehouse-badge">
          <small>
            <strong>No Fulfillment Centers created yet</strong>
          </small>
        </Badge>
      );

      return (
        <Card>
          <CardBody>
            <Row className="batch-metrics-toolbar">
              <Col className="metric-item">
                <ProfitPopover
                  profitPopoverOpen={this.state.profitPopoverOpen}
                  toggleProfitPopover={this.toggleProfitPopover.bind(this)}
                  batchNetProfit={batchNetProfit}
                  batchListPrice={batchListPrice}
                  batchBuyCost={batchBuyCost}
                  batchFees={batchFees}
                  batchRoi={batchRoi}
                  batchProfitMargin={batchProfitMargin}
                />
              </Col>
              <Col className="metric-item">
                <h4>{digitСonversion(batchSalesrank, "rank") || "N/A"}</h4>
                <p>SALES RANK</p>
              </Col>
              <Col className="metric-item">
                <h4>{ !!totalProductsWeight ? `${digitСonversion(totalProductsWeight)}lbs` : "N/A"}</h4>
                <p>ESTIMATED WEIGHT</p>
              </Col>
              <Col className="metric-item">
                <h4>{digitСonversion(totalBatchProductsListed) || "N/A"}</h4>
                <p>TOTAL PRODUCTS</p>
              </Col>
              <Col className="metric-item">
                <h4>{digitСonversion(totalBatchSKUs) || "N/A"}</h4>
                <p>TOTAL SKUs</p>
              </Col>
            </Row>
            <Row>
              <Col lg="12" className="mt-3">
                <h5>
                  {fulfillmentCenters.length === 0
                    ? fulfillmentCentersFieldEmpty
                    : fulfillmentCenters}
                </h5>
              </Col>
            </Row>
            <hr className="separator-line" />
            <Row>
              <Col>
                <BatchSearchRow
                  isLoading={!batchLoaded}
                  searchBatch={searchBatch}
                />
              </Col>
              <Col style={{ display: "flex", justifyContent: "flex-end" }}>
                {submitFeedButton}
                <Tooltip
                  tooltipId="BatchMetricsRowFBA"
                  tooltipText="BatchMetricsRowFBA"
                />
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    } else {
      let button;
      if (batchMetadata.channel === "DEFAULT") {
        button = submitFeedButton;
      } else {
        button = (
          <React.Fragment>
            {createShipmentPlansButton}
            {submitFeedButtonWorkflowPrivate}
          </React.Fragment>
        )
      }
      return (
        <Card>
          <CardBody>
            <Row className="batch-metrics-toolbar">
              <Col className="metric-item">
                <ProfitPopover
                  profitPopoverOpen={this.state.profitPopoverOpen}
                  toggleProfitPopover={this.toggleProfitPopover.bind(this)}
                  batchNetProfit={batchNetProfit}
                  batchListPrice={batchListPrice}
                  batchBuyCost={batchBuyCost}
                  batchFees={batchFees}
                  batchRoi={batchRoi}
                  batchProfitMargin={batchProfitMargin}
                />
              </Col>
              <Col className="metric-item">
                <h4>{digitСonversion(batchSalesrank, "rank") || "N/A"}</h4>
                <p>SALES RANK</p>
              </Col>
              <Col className="metric-item">
                <h4>{ !!totalProductsWeight ? `${digitСonversion(totalProductsWeight)}lbs` : "N/A"}</h4>
                <p>ESTIMATED WEIGHT</p>
              </Col>
              <Col className="metric-item">
                <h4>{digitСonversion(totalBatchProductsListed) || "N/A"}</h4>
                <p>TOTAL PRODUCTS</p>
              </Col>
              <Col className="metric-item">
                <h4>{digitСonversion(totalBatchSKUs) || "N/A"}</h4>
                <p>TOTAL SKUs</p>
              </Col>
			  <div>
				<div
					onClick={() => this.facebookShare(
						batchNetProfit,
						digitСonversion(batchSalesrank, "rank")
					)}
					style={{cursor:'pointer'}}
					disabled={this.props.facebookShareInProgress}
				>
					<FacebookIcon
						size={20}
						round
					/>
				</div>
			  </div>
			<PrintTemplate>
				<div
					className="printable-accounting"
					ref={el => (this.componentRef = el)}
				>
					<Template30up products={this.props.products}/>
				</div>
             </PrintTemplate>
            </Row>
            <hr className="separator-line" />
            <Row>
  			      <Col md="5">
                <BatchSearchRow
                  isLoading={!batchLoaded}
                  searchBatch={searchBatch}
                />
              </Col>
              <Col style={{ display: "flex", justifyContent: "flex-end" }} md="7">
                  {button}
                  <Tooltip
                    tooltipId="BatchMetricsRowMF"
                    tooltipText="Press this button if you would like to submit your product feed to Amazon Seller Central and create your shipments there"
                  />
              </Col>
            </Row>
          </CardBody>
        </Card>
      );
    }
  }
}

BatchMetricsRow.propTypes = {
  submitProductFeed: PropTypes.func.isRequired,
  existingShipments: PropTypes.array, // Not required if private batch, required if live batch.
  products: PropTypes.array.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  createShipmentPlans: PropTypes.func.isRequired,
  createShipmentPlansRequestStatus: PropTypes.string.isRequired,
  updateModalDisplay: PropTypes.func.isRequired,
};
export default connect(
  state => ({
    createShipmentPlansRequestStatus: state.Batch.get("createShipmentPlansRequestStatus"),
    batchMetadata: state.Batch.get("batchMetadata"),
    shipmentIdToBoxCountMapping: state.Batch.get("shipmentIdToBoxCountMapping"),
    shipmentIdToCurrentBoxMapping: state.Batch.get(
      "shipmentIdToCurrentBoxMapping"
    ),
    products: state.Batch.get("products"),
    internationalization_config: state.Auth.get("internationalization_config"),
    facebookShareInProgress: state.Batch.get("facebookShareInProgress"),
  }),
  {
    submitProductFeed,
    createShipmentPlans,
    updateModalDisplay,
	  facebookShare,
  }
)(BatchMetricsRow);
