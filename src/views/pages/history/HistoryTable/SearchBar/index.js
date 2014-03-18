import React from 'react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import Actions from '../../../../../redux/history/actions';
import ClearIcon from "react-icons/lib/md/clear";
import './index.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
      isFilterOpen: false
    }
  }

  toggleDropDown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    })
  }
  selectFilter = (e) => {
    e.preventDefault();
    const value = e.target.innerHTML;
    this.setState({
      isFilterOpen: false
    }, () => {
      this.props.changeState("filter_method", value, false);
    });
  }
  handleChangeFilterQuery= (e) => {
    e.preventDefault();
    this.props.changeState("filter_query", e.target.value, false);
  }
  searchBatch = () => {
    const {
      filter_query
    } = this.props;
    this.props.changeHistoryTableState("parentPageResetCheck", true)
    this.props.changeState("filter_query", filter_query);
  }
  render(){
    const { isFilterOpen } = this.state;
    const {
      filter_method,
      filter_query,
      clearSearch
    } = this.props;
    return(
      <div className="table-top-controls">
        <div className="input-group">
            <div className={`input-group-btn ${isFilterOpen && 'show'}`}>
                <button onClick={() => this.setState({ isFilterOpen: !isFilterOpen })} type="button" className="btn btn-secondary dropdown-toggle" data-toggle="dropdown">
                    Filter by: <strong className="filter-by">{filter_method}</strong>
                </button>
                <div className="dropdown-menu">
                    <a onClick={this.selectFilter} className="dropdown-item">name</a>
                    <a onClick={this.selectFilter} className="dropdown-item">sku</a>
                    <a onClick={this.selectFilter} className="dropdown-item">asin</a>
                </div>
            </div>
            <input type="text" onChange={this.handleChangeFilterQuery} value={filter_query} className="form-control" />
            <div className="input-group-addon" style={{ display: "block" }}>
                <button onClick={clearSearch} className="btn btn-link" style={{ marginRight: "10px" }}>
                  <ClearIcon size="20px" color="#858C82" />
                </button>
                <button onClick={this.searchBatch} className="btn btn-link">
                    <svg width="19" height="18" style={{ position: "relative", top: "4px" }} viewBox="759 11 19 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M772.497968 22h-.815695l-.289108-.27c1.011876-1.14 1.621066-2.62 1.621066-4.23 0-3.59-3.00465-6.5-6.711417-6.5s-6.711417 2.91-6.711417 6.5 3.00465 6.5 6.711417 6.5c1.662366 0 3.190504-.59 4.367583-1.57l.278782.28v.79l5.162629 4.99 1.538463-1.49-5.152303-5zm-6.195154 0c-2.570989 0-4.646366-2.01-4.646366-4.5s2.075377-4.5 4.646366-4.5c2.570989 0 4.646365 2.01 4.646365 4.5s-2.075376 4.5-4.646365 4.5z" fill="#858C82" fillRule="evenodd" />
                    </svg>
                </button>
            </div>
        </div>
      </div>
    )
  };
}

SearchBar.propTypes = {
  fetchBatchList: PropTypes.func.isRequired,
  changeHistoryTableState: PropTypes.func,
  changeState: PropTypes.func,
  filter_method: PropTypes.string,
  filter_query:  PropTypes.string,
  clearSearch: PropTypes.func.isRequired
};

export default connect(null, Actions)(SearchBar);