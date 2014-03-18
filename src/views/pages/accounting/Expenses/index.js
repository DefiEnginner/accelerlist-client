import React, { Component } from 'react';
import ExpenseTable from './ExpenseTable';
import ManageExpenseCategory from './ManageExpenseCategory';

const ViewHeader = (props) => (
  <div className="view-header">
    <header className="title text-white">
      <h1 className="h4 text-uppercase">{props.title}</h1>
      <p className="subtitle">{props.subtitle}</p>
    </header>
  </div>
);

const ViewContent = ({children}) => (
  <div className="view-content view-components">
      {children}
  </div>
);

class Expenses extends Component {
  constructor(props) {
    super(props);

    this.state = {
      view: 'expenses',
      title: 'Manage Expenses',
      subtitle: 'Manage all of your business expenses'
    }
  }

  toggleView = (view) => {
    this.setState({
      view: view,
      title: view === 'expenses' ? 'Manage Expenses' : 'Manage Expense Category',
      subtitle: view === 'expenses' ? 'Manage all of your business expenses' : 'Add, edit and delete expense category',
    })
  }

  render() {
    const {
      view
    } = this.state;

    return (
      <div className="view">
        <ViewHeader
          title={this.state.title}
          subtitle={this.state.subtitle}
        />
        <ViewContent className="mt-1">
          {view === 'expenses' && <ExpenseTable toggleView={() => this.toggleView('category')} />}
          {view === 'category' && <ManageExpenseCategory toggleView={() => this.toggleView('expenses')} />}
        </ViewContent>
      </div>
    )
  }
}

export default Expenses;
