import React from 'react';
import Barcode from 'react-barcode';
import { Row } from 'reactstrap';
import './styles.css';

const ColShow = ({ data }) => (
	data ?
	<div
		style={
			{
				overflow: "hidden",
				"padding-left": "3.55mm",
				height: "25.4mm",
				width: "68.675mm",
			}
		}
	>
		<div className="text-center" >
		<Barcode
			value={data.fnsku}
			format="CODE128B"
			width={1.5}
			height={32}
			margin={1}
			fontSize={15}
			textMargin={0}
		/>
		</div>
		<div
			className="text-left"
			style={{ "white-space": "nowrap", overflow: "hidden" }}
		>
			{data.title}
		</div>
		<div className="text-right"><b>{data.id.toString().padStart(4, '0')}</b></div>
	</div>
	:
	<div className="col-md">
	</div>
)

const RowShow = ({ data }) => (
	<Row>
		<ColShow data={ data[0] }/>
		<ColShow data={ data[1] }/>
		<ColShow data={ data[2] }/>
	</Row>
)

export class Template30up extends React.Component {
	render(){
	  var row = [];
	  var printData = [];
	  this.props.products.forEach((d, i) => {
		row.push(
			{
				title: d.name,
				fnsku: d.fnsku,
				id: i + 1,
			}
		);
		if(i>0 && (i+1) % 3 === 0){
			if(row){
				printData.push(row);
			}
			row = [];
		}
	  });
	  if(row){
		  printData.push(row);
	  }
		//console.log(printData);

		return (
			<div>
				<div>
					{printData.map(d => {
						return <RowShow data={d}/>
					})}
				</div>
			</div>
		)
	}
}
