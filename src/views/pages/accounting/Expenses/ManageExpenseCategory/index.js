import React, { Component, Fragment } from 'react';
import { connect } from "react-redux";
import {
  Input, Button,
  Card, CardBody, CardTitle,
  Row, Col,
  FormGroup
} from 'reactstrap';
import IconAdd from 'react-icons/lib/md/add-circle';
import IconRemove from 'react-icons/lib/md/remove-circle';
import PropTypes from 'prop-types';
import accountingActions from '../../../../../redux/accounting/actions';

const {
	expenseLoadCategories,
	expenseAddCategory,
	expenseDeleteCategory,
	expenseUpdateCategory,
} = accountingActions;

class ManageExpenseCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      newCategoryName: '',
    }
  }

	componentDidMount(){
		this.props.expenseLoadCategories();
	}

  setCategoryName = (e) => {
    this.setState({
      newCategoryName: e.target.value
    });
  }

	addCategory = () => {
		const { newCategoryName } = this.state;
	    if(newCategoryName !== '') {
			this.props.expenseAddCategory({categoryName: newCategoryName});
			this.setState({ newCategoryName: '' });
		}
	}

	deleteCategory = (id) => {
		this.props.expenseDeleteCategory({id: id});
	}

  changeCategoryName = (idx, e) => {
    if(e.target.value !== '') {
      let categories = this.state.categories;

      categories.map((obj, index) => {
        if(index === idx) {
          obj.name = e.target.value;
        }
        return obj;
      });

      this.setState({
        categories: categories
      });
    }
  }

  render() {
    const {
		toggleView,
		expenseCategories,
    } = this.props;

    return (
      <Fragment>
        <div className="text-right mb-5">
          <Button color="primary" className="mb-3" onClick={toggleView}>Manage Expenses</Button>
        </div>
        <Row>
          <Col md="6">
            <Card>
              <CardBody>
                <CardTitle>Manage Expense Category</CardTitle>
                {expenseCategories.map((category) => (
                  <FormGroup key={category.id} className="d-flex">
					  <Input
						  type="text"
						  value={category.name}
						  //onChange={(e) => this.changeCategoryName(category.id, e)}
					  />
                    <Button color="link" className="text-danger ml-2" onClick={() => this.deleteCategory(category.id)}>
                      <IconRemove size="22" />
                    </Button>
                  </FormGroup>
                ))}
                <FormGroup className="d-flex">
                  <Input
                    type="text"
                    onChange={this.setCategoryName}
                    onKeyPress={(e) => {
                      let code = (e.keyCode ? e.keyCode : e.which);
                      if(code === 13) this.addCategory();
                    }}
                    value={this.state.newCategoryName}
                    placeholder="Enter category name"
                  />
                  <Button
                    color="link"
                    className="text-success ml-2"
                    onClick={this.addCategory}
                  >
                    <IconAdd size="22" />
                  </Button>
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Fragment>
    )
  }
}

ManageExpenseCategory.propTypes = {
  toggleView: PropTypes.func.isRequired
}

export default connect(
  state => {
    return {
      expenseCategories: state.Accounting.get("expenseCategories"),
    };
  },
  {
	  expenseLoadCategories,
	  expenseAddCategory,
	  expenseDeleteCategory,
	  expenseUpdateCategory,
  }
)(ManageExpenseCategory);
