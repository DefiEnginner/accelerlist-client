import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import {
  Table, Button
} from 'reactstrap';
import ExpenseRow from './ExpenseRow';
import ExpenseCalendar from './ExpenseCalendar';
import IconAdd from 'react-icons/lib/md/add-circle';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import accountingActions from '../../../../../redux/accounting/actions';
import moment from 'moment';

const {
	expenseLoadCategories,
	expenseAddCategory,
	expenseLoad,
	expenseAdd,
	expenseDelete,
	expenseUpdate,
	expensesGetDataForPeriod,
} = accountingActions;

const StyledTable = styled(Table)`
  > tfoot > tr > td {
    border-top: 0;
  }
`;

class ExpenseTable extends Component {

	state = {
		expenses: [],
		startDateCalendar: null,
		endDateCalendar: null,
	}

	componentDidMount(){
		const data = {
			startDate: moment().startOf('month').toISOString(),
			endDate: moment().add(6, 'M').toISOString(),
		}
		this.setState({startDateCalendar: data.startDate});
		this.setState({endDateCalendar: data.endDate});
		this.props.expenseLoadCategories();
		this.props.expenseLoad();
		this.props.expensesGetDataForPeriod(data);
	}

	getMonthsData = (monthBeingViewed) => {
		let m = monthBeingViewed;
		const data = {
			startDate: m.startOf('month').toISOString(),
			endDate: moment(m.startOf('month').toISOString()).add(6, 'M').toISOString(),
		}
		this.setState({startDateCalendar: data.startDate});
		this.setState({endDateCalendar: data.endDate});
		this.props.expensesGetDataForPeriod(data);
	}

  addExpense = () => {
    let expenses = this.state.expenses;
    expenses.push({
      category: '',
      date: new Date(),
      amount: 0,
      description: '',
      repeat: ''
    });
    this.setState({
      expenses: expenses
    });
  }

  deleteUncreatedExpense = (idx) => {
    this.setState(prevState => ({
      expenses: prevState.expenses.filter((obj,index) => index !== idx)
    }));
  }

	addExpenseCategory(){

	}

	addExpenseFromRow = (expense) => {
		const { startDateCalendar, endDateCalendar } = this.state;
		this.props.expenseAdd(expense, startDateCalendar, endDateCalendar);
		this.setState(prevState => ({
		  expenses: prevState.expenses.filter((obj,index) => index !== expense.idx)
		}));
	}

	updateExpenseFromRow = (expense) => {
		const { startDateCalendar, endDateCalendar } = this.state;
		this.props.expenseUpdate(expense, startDateCalendar, endDateCalendar);
	}

	deleteExpense(id){
		const { startDateCalendar, endDateCalendar } = this.state;
		this.props.expenseDelete({id: id}, startDateCalendar, endDateCalendar);
	}

  render() {
    const {
		toggleView,
		expenseCategories,
		expenseData,
    } = this.props;


    return (
      <Fragment>
        <div className="text-right">
          <Button color="primary" className="mb-5" onClick={toggleView}>Manage Expense Category</Button>
        </div>
		<ExpenseCalendar
			expenseDates={this.props.expensesCalendarData}
			getMonthsData={this.getMonthsData}
		/>
        <StyledTable className="acc-table acc-table-left">
          <thead>
            <tr>
              <th>&nbsp;</th>
              <th>Expense Category</th>
              <th>Date of Expense</th>
              <th>Amount</th>
              <th>Description</th>
              <th>Repeat Expense</th>
            </tr>
          </thead>
          <tbody>
			{ expenseData.length > 0 ? (
              expenseData.map((expense, idx) => (
				  <ExpenseRow
					key={expense.id}
					idx={idx}
					data={expense}
					deleteExpense={() => this.deleteExpense(expense.id)}
					addExpenseCategory={this.addExpenseCategory}
					addExpense={this.addExpenseFromRow}
					updateExpense={this.updateExpenseFromRow}
					expenseCategories={expenseCategories.map(item => {
						return {value: item.id, label: item.name}
					})}
				  />
			  ))
			) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">There are no expenses to display, click <IconAdd size="24" className="text-success" /> icon below to add them.</td>
			</tr>
			  )
            }
			{this.state.expenses.map((expense, idx) => (
				  <ExpenseRow
					key={idx+'a'}
					data={expense}
					idx={idx}
					deleteExpense={() => this.deleteUncreatedExpense(idx)}
					addExpenseCategory={this.addExpenseCategory}
					addExpense={this.addExpenseFromRow}
					updateExpense={null}
					expenseCategories={expenseCategories.map(item => {
						return {value: item.id, label: item.name}
					})}
				  />
              ))
			}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="6">
                <Button color="link" className="text-success ml-2" onClick={this.addExpense}>
                  <IconAdd size="24" />
                </Button>
              </td>
            </tr>
          </tfoot>
        </StyledTable>
      </Fragment>
    )
  }
}

ExpenseTable.propTypes = {
  toggleView: PropTypes.func.isRequired
}

export default connect(
  state => {
    return {
      expenseCategories: state.Accounting.get("expenseCategories"),
      expenseData: state.Accounting.get("expenseData"),
		expensesCalendarData: state.Accounting.get("expensesCalendarData"),
    };
  },
  {
	  expenseLoadCategories,
	  expenseAddCategory,
	  expenseLoad,
	  expenseAdd,
	  expenseDelete,
	  expenseUpdate,
	  expensesGetDataForPeriod,
  }
)(ExpenseTable);
