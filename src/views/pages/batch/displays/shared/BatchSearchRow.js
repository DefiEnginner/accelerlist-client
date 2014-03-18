import React from "react";
import { Input } from "reactstrap";
import Tooltip from "../../../../../shared/components/Tooltip";
import { connect } from "react-redux";
import { broomSearch } from "../../../../../assets/images";

class BatchSearchRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
		searchText: "",
    };
    this.clearSearch = this.clearSearch.bind(this);
  }

  clearSearch(){
	this.setState({searchText: ""});
	this.props.searchBatch("");
  }

  handleSearchChange(event) {
	this.props.searchBatch(event.target.value);
	this.setState({searchText: event.target.value});
  }

  render() {
	let { isLoading } = this.props;
    return (
      <div style={{ display: "flex", alignItems: "center" }}>
			<Tooltip
			  tooltipId="BatchSearchBar"
			  tooltipText={`
				Enter search term to search in the batch.
				Click broom  button if you want to reset your search.`}
			/>
		<Input
			value={this.state.searchText}
            autoComplete="off"
            type="text"
			placeholder="SEARCH TITLE / ASIN / SKU / PRICE..."
            className="form-control"
            style={isLoading ? { cursor: "progress" } : {}}
            onChange={this.handleSearchChange.bind(this)}
            id="batch-search"
            ref={el => this.inputSearch = el}
            disabled={isLoading} // please set disabled true for completed batch
          />
          {isLoading ? <span className="toggle-dot" /> : ""}
			<img
				style={{ maxWidth: "24px", cursor:"pointer" }}
				src={broomSearch}
				alt="Clear search"
				onClick={this.clearSearch}
			/>
	</div>

    );
  }
}

export default connect(
  state => ({
  }),
  {
  }
)(BatchSearchRow);
