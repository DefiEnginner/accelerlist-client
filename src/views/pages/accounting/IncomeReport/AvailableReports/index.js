import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { CardTitle, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
import {
  IoIosPaper as IconReport,
  IoCloseCircled as IconDelete
} from 'react-icons/lib/io';
import {
  MdCheck as IconSave,
  MdClose as IconCancel,
  MdEdit as IconEdit
} from 'react-icons/lib/md';
import {
  FaAngleLeft as ArrowLeft,
  FaAngleRight as ArrowRight,
} from 'react-icons/lib/fa';
import accountingActions from "../../../../../redux/accounting/actions";
import LoadingIndicator from '../../../../../shared/components/LoadingIndicator';
import SweetAlert from 'sweetalert2-react';
import { ArrowButton, StyledReportItem } from "./styles";
import { incomeReportUrl } from "../../../../../config/mediaLinks";

const {
	getAvailableReports,
	getAvailableReportsByLink,
	clearUploadedTransactionReportData,
	deleteReport,
	updateReport,
} = accountingActions;

const paginationOptions = [
  1, 5, 10, 30, 50
];

class AvailableReports extends Component {
  state = {
    paginationValue: 5,
    currentPage: 1,
    editId: -1,
    deleteId: -1
  }
  componentDidMount() {
    const { paginationValue } = this.state;
    this.props.getAvailableReports(1, paginationValue);
  }

  getAvailableReportsList = () => {
    const { availableReports, clearUploadedTransactionReportData } = this.props;
    const { editId, deleteId } = this.state;
    let availableReportsList = null;

    if (availableReports && availableReports.results && availableReports.results.length > 0) {
      availableReportsList = availableReports.results.map(el => (
        <StyledReportItem
          key={`availableReportsListoption-${el.id}`}
          className="report-item"
        >
          <span
            className="d-inline-block m-auto"
            onClick={ () => {
              clearUploadedTransactionReportData();
              this.props.history.push(
                `${incomeReportUrl}/${el.id}`
              );
            }}
          >
            <div className="icon-report">
              <IconReport
                size="64"
                className="text-success"
              />
              <IconDelete size="20" className="text-danger icon-delete" onClick={(e) => this.confirmDelete(e, el.id)} />
              <SweetAlert
                show={deleteId >= 0}
                title="Confirm Delete"
                type="error"
                text={ el !== null &&
                  `Do you really want to delete report ${deleteId}?`
                }
                showCancelButton
                onConfirm={this.deleteReport}
                confirmButtonText="Delete"
                confirmButtonColor="#f5250f"
                onCancel={() => this.setState({ deleteId: -1 })}
              />
            </div>
            {editId !== el.id &&
              <Fragment>
                <span className="title">
                  {el.name}
                </span>
                <IconEdit className="text-muted icon-edit" onClick={(e) => this.toggleEdit(e, el)} />
              </Fragment>
            }
          </span>
				{/* defaultValue={el.id} */}
				{/* onKeyDown={(e) => {if(e.keyCode === 13) this.toggleEdit(e, el.id)}} */}
          {editId === el.id &&
            <InputGroup size="sm">
              <Input
				  type="text"
				  defaultValue={el.name}
				  onChange={(e) => this.updateState(e, "report_name_"+el.id.toString())}
              />
              <InputGroupAddon addonType="append">
				  <Button
					  color="link"
					  onClick={(e) => this.renameReport(el)}
				  >
                  <IconSave size="18" className="text-success" />
                </Button>
              </InputGroupAddon>
              <InputGroupAddon addonType="append">
				  <Button
					  color="link"
					  className="text-muted"
					  onClick={(e) => this.toggleEdit(e, el)}
				  >
                  <IconCancel size="18" />
                </Button>
              </InputGroupAddon>
            </InputGroup>
          }
        </StyledReportItem>
      ))
    }

    if (!availableReportsList) {
      availableReportsList = (
        <div>
          No available reports
        </div>
      )
    }

    return availableReportsList;
  }

	updateState = (e, state) => {
		this.setState({[state]: e.target.value});
	}

	renameReport = (item) => {
		const data = {
			generatedReportId: item.id,
			name: this.state['report_name_'+item.id.toString()]
		}
		this.props.updateReport(data);

	    let prevId = this.state.editId;

		this.setState({
			editId: item.id !== prevId ? item.id : -1,
		})
	}

	deleteReportAction = () => {
		this.props.deleteReport(
			{id: this.state.deleteId}
		);
	}

  changePaginationValue = (e) => {
    const newPaginationValue = e.target.value || null;
    if (newPaginationValue) {
      this.setState({
        paginationValue: newPaginationValue
      })
    }
    this.props.getAvailableReports(1, newPaginationValue);
  }

  goToPage = (pageLink) => {
    const { getAvailableReportsByLink } = this.props;
    if (pageLink) {
      getAvailableReportsByLink(pageLink);
    }
  }

  toggleEdit = (e, item) => {
    e.stopPropagation();

    let prevId = this.state.editId;

    this.setState({
		editId: item.id !== prevId ? item.id : -1,
		['report_name_'+item.id.toString()]: item.name,
    })
  }

  confirmDelete = (e, id) => {
    e.stopPropagation();
    this.setState({ deleteId: id });
  }

  deleteReport = () => {
	  this.deleteReportAction();
    this.setState({ deleteId: -1 });
  }

  render() {
    const { availableReportsStatus, availableReports } = this.props;
    const { paginationValue } = this.state;

    return (
      <Fragment>
        <CardTitle>Recently Uploaded Reports</CardTitle>
        {
          availableReportsStatus ? (
            <LoadingIndicator title="Loading Available Reports..." />
          ) : (
            <Fragment>
              <div className="d-flex mt-4">
                {this.getAvailableReportsList()}
              </div>

              <hr />

              <div className="d-flex justify-content-between">
                <Input
                  className="w-auto"
                  type="select"
                  placeholder="Select Size per Page"
                  value={paginationValue}
                  name="limit"
                  onChange={this.changePaginationValue}
                >
                  {
                    paginationOptions.map(el => <option key={`paginationOptions-${el}`} value={el}>{el}</option>)
                  }
                </Input>
                <div>
                  <ArrowButton
                    onClick={() => this.goToPage(availableReports.prev)}
                  >
                    <ArrowLeft size="20px" />
                  </ArrowButton>
                  {`x / ${availableReports && availableReports.pages ? availableReports.pages : "N/A"}`}
                  <ArrowButton
                    onClick={() => this.goToPage(availableReports.next)}
                  >
                    <ArrowRight size="20px" />
                  </ArrowButton>
                </div>
              </div>
            </Fragment>
          )
        }
      </Fragment>
    )
  }
}

AvailableReports.propTypes = {
  availableReports: PropTypes.object,
  getAvailableReports: PropTypes.func,
  getAvailableReportsByLink: PropTypes.func,
  clearUploadedTransactionReportData: PropTypes.func,
};

export default withRouter(connect(
  state => ({
    availableReports: state.Accounting.get("availableReports"),
    availableReportsStatus: state.Accounting.get("availableReportsStatus"),
  }),
  {
    getAvailableReports,
    getAvailableReportsByLink,
	  clearUploadedTransactionReportData,
	  deleteReport,
	  updateReport,
  }
)(AvailableReports));
