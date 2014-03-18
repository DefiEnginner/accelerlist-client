import React, { Component, Fragment } from 'react';
import {
  InputGroup, InputGroupAddon, Input, Button
} from 'reactstrap';
import DatePicker from 'react-datepicker';
import IconRemove from 'react-icons/lib/md/remove-circle';
//import IconAdd from 'react-icons/lib/md/add-circle';
import Select from 'react-select';
import PropTypes from 'prop-types';
import Moment from 'moment';
import moment from 'moment';
import styled from 'styled-components';

const StyledRow = styled.tr`
  .date {
    width: 9em;
  }

  .amount {
    width: 7em;
  }

  > td:first-child {
    max-width: 24px;
  }

  .new-category {
    font-size: 13px;
  }
`;

/*
const expenseCategories = [
  {
    value: {action: 'add-category'},
    label: <strong className="new-category"><IconAdd className="text-success" /> New Category</strong>
  }
];
*/

const expenseRepeat = [
  { value: 'one-time', label: 'One-time' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
]

class ExpenseRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      category: null,
      date: null,
      endDate: null,
      amount: 0,
      description: '',
      repeat: null,
      createNewCategory: false,
		newCategoryName: '',
		expenseAdded: false,
		expenseUpdated: false,
    }
  }

  componentDidMount() {
    const {
		data,
		expenseCategories,
    } = this.props;

    this.setState({
      category: expenseCategories.filter( obj => obj.value === data.category_id)[0],
      date: data.start_date ? Moment(data.start_date) : null,
      amount: data.amount,
      description: data.description,
	  repeat: expenseRepeat.filter( obj => obj.value === data.interval)[0],
      endDate: data.end_date ? Moment(data.end_date) : null,
	  expenseAdded: data.id ? true : false,
	  id: data.id ? data.id : null,
    });
  }

	UNSAFE_componentWillReceiveProps(np){
		const {
			data,
	    } = this.props;

		if(np.expenseCategories){
			if(np.expenseCategories !== this.props.expenseCategories){
				this.setState({
					category: np.expenseCategories.filter(
						obj => obj.value === data.category_id)[0],
				});
			}
		}
	}

  selectCategory = (selected) => {
    if(selected) {
      if(!selected.value.action) {
        this.setState({
          category: selected
        });
      } else if(selected.value.action && selected.value.action === 'add-category') {
        this.setState({
          createNewCategory: true
        });
      }
	}
	this.setState({ expenseUpdated: true });
  }

  selectDate = (selected) => {
    this.setState({
		date: selected
    })
	this.setState({ expenseUpdated: true });
  }

  selectEndDate = (selected) => {
    this.setState({
	  endDate: selected
    })
	this.setState({ expenseUpdated: true });
  }

  selectRepeat = (selected) => {
    this.setState({
      repeat: selected
    })
	this.setState({ expenseUpdated: true });
  }

  changeAmount = (e) => {
    this.setState({
      amount: e.target.value
    });
	this.setState({ expenseUpdated: true });
  }

  changeDescription = (e) => {
    this.setState({
      description: e.target.value
    });
	this.setState({ expenseUpdated: true });
  }

  newCategoryNameChanged = (e) => {
    this.setState({
      newCategoryName: e.target.value
    });
  }

  createNewCategory = () => {
    const {
		expenseCategories,
    } = this.props;
    let name = this.state.newCategoryName;
    let newCategory;

    if( name !== '') {
      let categories = expenseCategories;
      newCategory = {
        value: name.replace(/ +/g, ""),
        label: name
      }

      categories.push(newCategory);

      this.setState({
        category: newCategory,
        createNewCategory: false,
        newCategoryName: ''
      });
    }
  }

	addExpenseRow() {
		const {
			category,
			date,
			amount,
			description,
			repeat,
			endDate} = this.state;
		const expense = {
			categoryId: category.value,
			startDate: moment.utc(date).utcOffset(moment().utcOffset()).toISOString(true),
			endDate: endDate ? endDate : '',
			amount: Number(amount),
			description: description,
			interval: repeat.value,
			idx: this.props.idx,
		}
		this.props.addExpense(expense);
		this.setState({ expenseAdded: true });
		this.setState({ expenseUpdated: false });
	}


	updateExpenseRow(){
		const {
			id,
			category,
			date,
			amount,
			description,
			repeat,
			endDate} = this.state;
		const expense = {
			expenseId: id,
			categoryId: category.value,
			startDate: moment.utc(date).utcOffset(moment().utcOffset()).toISOString(true),
			endDate: endDate ? endDate : '',
			amount: Number(amount),
			description: description,
			interval: repeat.value,
			idx: this.props.idx,
		}
		this.props.updateExpense(expense);
		this.setState({ expenseAdded: true });
		this.setState({ expenseUpdated: false });
	}


  render() {
    const {
	    deleteExpense,
		expenseCategories,
    } = this.props;


    return (
      <Fragment>
        <StyledRow>
            <td>
              <Button color="link" className="text-danger" onClick={deleteExpense}>
                <IconRemove size="22" />
              </Button>
            </td>
            <td>
              <Select
                options={expenseCategories}
                onChange={this.selectCategory}
                value={this.state.category}
              />
              {this.state.createNewCategory &&
                <InputGroup size="sm" className="mt-2">
                  <Input
                    type="text"
                    placeholder="Enter category name"
                    value={this.state.newCategoryName}
                    onChange={this.newCategoryNameChanged}
                    onKeyPress={(e) => {
                      let code = (e.keyCode ? e.keyCode : e.which);
                      if(code === 13) this.createNewCategory();
                    }}
                  />
                  <InputGroupAddon addonType="append">
                    <Button
                      color="primary"
                      onClick={this.createNewCategory}
                    >
                      Add
                    </Button>
                  </InputGroupAddon>
                </InputGroup>
              }
            </td>
            <td>
              <DatePicker
                selected={this.state.date}
                onChange={this.selectDate}
                maxDate={this.state.endDate !== null ? new Date(this.state.endDate - 1) : null}
                className="date"
                placeholderText="Pick date"
              />
            </td>
            <td>
              <InputGroup className="amount">
                <InputGroupAddon addonType="prepend">$</InputGroupAddon>
                <Input
                  value={this.state.amount}
                  onChange={this.changeAmount}
                  //placeholder="Amount"
                  type="number"
                  step="0.01"
                />
              </InputGroup>
            </td>
            <td>
              <Input
                value={this.state.description}
                onChange={this.changeDescription}
                type="text"
              />
            </td>
            <td>
              <div className="d-flex align-items-center">
                <Select
                  options={expenseRepeat}
                  onChange={this.selectRepeat}
                  value={this.state.repeat}
                />
                {this.state.repeat && this.state.repeat.value !== 'One-time' &&
                  <Fragment>
                    <DatePicker
                      selected={this.state.endDate}
                      onChange={this.selectEndDate}
                      placeholderText="End date (optional)"
                      className="date ml-2"
                    />
                  </Fragment>
                }
              </div>
            </td>
			{this.state.expenseAdded ? (null):(
				<td>
					<Button
						color="success"
						onClick={() => this.addExpenseRow()}
					>Add</Button>
				</td>
			)}
			{this.state.expenseUpdated && this.state.expenseAdded ? (
				<td>
					<Button
						color="success"
						onClick={() => this.updateExpenseRow()}
					>update</Button>
				</td>
			):(null)}
          </StyledRow>
      </Fragment>
    )
  }
}

ExpenseRow.propTypes = {
  data: PropTypes.object.isRequired,
  deleteExpense: PropTypes.func.isRequired,
  addExpenseCategory: PropTypes.func.isRequired,
  expenseCategories: PropTypes.array.isRequired,
  addExpense: PropTypes.func.isRequired,
  updateExpense: PropTypes.func.isRequired,
}

export default ExpenseRow;
