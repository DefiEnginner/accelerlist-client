import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Card,
  CardBody
} from 'reactstrap';
import BootstrapTable from 'react-bootstrap-table-next';
//import paginationFactory from 'react-bootstrap-table2-paginator';
import { digitСonversion } from '../../../helpers/utility';
import {
	MdArrowUpward as IconUp,
	MdArrowDownward as IconDown,
	MdRemove as IconNone
} from "react-icons/lib/md";
import { trophy1st, trophy2nd, trophy3rd } from "../../../assets/images";
import "./style.css";
import leaderboardActions from '../../../redux/leaderboard/actions';
import ExampleComponent from "react-rounded-image";
import LoadingIndicator from "../../../shared/components/LoadingIndicator";

const { getLeaderboard } = leaderboardActions;

const ViewHeader = () => (
  <div className="view-header">
    <header className="text-white">
      <h1 className="h5 title text-uppercase">Leaderboard</h1>
    </header>
  </div>
);

const ViewContent = ({ children }) => (
  <div className="view-content view-dashboard">
    <Card>
      <CardBody className="p-0">{children}</CardBody>
    </Card>
  </div>
);

class Leaderboard extends Component {

  movementFormatter = (cell, row, rowIndex) => {
	  let cell_data = null;
	  switch(cell){
		  case 'up':
			  cell_data = <IconUp color="#00C853" size="20" />;
			  break;
		  case 'down':
			  cell_data = <IconDown color="#F22F2F" size="20" />
			  break;
		  case 'no':
			  cell_data = <IconNone color="" size="20" />
			  break;
		  default:
			  cell_data = <IconNone color="#00C853" size="20" />;
		}
	  return (
		  <span className="text-center">
			  { cell_data }
		  </span>
	  )
  }

  userFormatter = (cell, row, rowIndex) => {
    return (
      <div className="user">
		  <ExampleComponent
			image={cell.avatar_url}
			roundedSize="0"
			imageWidth="30"
			imageHeight="30"
			alt={cell.name}
			className="avatar"
		  /><span className="name">&nbsp; {cell.name}</span>
      </div>
    );
  }

  rankFormatter = (cell, row, rowIndex) => {
    const trophies = [ trophy1st, trophy2nd, trophy3rd ];
    if(trophies[cell-1]) {
      return <span className="rank-trophy"><img src={trophies[cell-1]} alt={cell} /></span>
    } else {
      return <span className="rank-number">{cell}</span>;
    }
  }

  numberFormatter = (cell, row, rowIndex) => {
    return digitСonversion(cell, "decimal");
  }

  moneyFormatter = (cell, row, rowIndex) => {
    return <span className="text-success">{digitСonversion(cell, "currency", "USD")}</span>
  }

  usernameFormatter = (cell, row, rowIndex) => {
    return cell.username;
  }

	UNSAFE_componentWillMount(){
		this.props.getLeaderboard();
	}

  render() {

    let columns = [
      {
        dataField: 'rank',
        text: 'Rank',
        headerStyle: {
          width: '5%'
        },
        formatter: this.rankFormatter
      },
      {
        dataField: 'user',
        text: 'Seller Name',
        formatter: this.userFormatter
      },
      {
        dataField: 'products_listed',
        text: 'Products Listed',
        formatter: this.numberFormatter
      },
      {
        dataField: 'batches_listed',
        text: 'Batches Listed',
        formatter: this.numberFormatter
      },
      {
        dataField: 'net_profit',
        text: 'Est. Total Net Profit',
        formatter: this.moneyFormatter
      },
      {
        dataField: 'weekly_movement',
        text: 'Weekly Movement',
        formatter: this.movementFormatter
      },
    ];

	if(this.props.userData && this.props.userData.role === "admin"){
		columns.splice(
			2,
			0,
			{
				dataField: 'user',
		        text: 'Username',
				formatter: this.usernameFormatter

			});
	}

    const myRankRowStyle = (row, rowIndex) => {
      const style = {};

		if(!this.props.userData){
			return style;
		}
      if(row.user.username === this.props.userData.userName) {
        style.backgroundColor = 'rgba(239, 240, 21, .23)';
        style.color = '#4D4D3B';
        style.fontWeight = '700';
      }

      return style;
    }

    return (
      <div className="view">
        <ViewHeader />
        <ViewContent>
          <BootstrapTable
            keyField='rank'
            data={this.props.leaderboardData}
            columns={columns}
            bordered={false}
            classes="leaderboard-table"
            rowStyle={myRankRowStyle}
            noDataIndication={() => <LoadingIndicator title="Loading..." />}
          />
        </ViewContent>

      </div>
    );
  }
}

export default connect(
  state => ({
	  leaderboardData: state.Leaderboard.get("leaderboard"),
	  userData: state.Auth.get("userData"),
  }),
  {
	getLeaderboard,
  }
)(Leaderboard);
