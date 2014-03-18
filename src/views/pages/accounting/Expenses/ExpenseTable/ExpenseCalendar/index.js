import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import './style.css';

class ExpenseCalendar extends Component {

  render() {
    return (
      <div className="text-center">
      <DatePicker
        inline
        highlightDates={this.props.expenseDates}
        monthsShown={5}
        calendarClassName="expense-calendar"
		onMonthChange={this.props.getMonthsData}
      />
      </div>
    );
  }
}

export default ExpenseCalendar;
