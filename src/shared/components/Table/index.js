import React, { Component, Fragment } from 'react';
import {
    Card, CardBody
} from 'reactstrap';
import { withRouter } from "react-router-dom";
import { Table, Th, Tr, Td, Thead } from 'reactable';
import './style.css';
import SubmitButton from '../../../views/pages/template_editor/components/Form/SubmitButton';

class TableGenerator extends Component {

    addItem = () => {
        const { model, history } = this.props;
        history.replace(`/${model.key}/new`);
    }
    render() {
        const { model, sortable, filterable, data, columns } = this.props;
        return (
            <Card className="mb-4">
                <CardBody className="table-responsive">
                    <h6 className="mb-4 text-uppercase">{model.title}</h6>
                    {!!model.description && <p>{model.description}</p>}
                    {!model.removeAdd && <SubmitButton
                        onSubmit={this.addItem}
                        className="mb-3"
                    >
                        <Fragment>
                            <i className="fa fa-plus" /> {`New ${model.singularName}`}
                        </Fragment>
                    </SubmitButton>}
                    <Table className="table" filterable={filterable} sortable={sortable} itemsPerPage={model.itemsPerPage} pageButtonLimit={model.pageButtonLimit}>
                        <Thead>
                            {
                                !!columns && columns.map((column,i) => {
                                    return <Th key={`table_header_${i}`} column={column.name} ><span>{ column.label }</span></Th>
                                })
                            }
                        </Thead>
                        {
                            !!data && data.map((row, i) => {
                                return <Tr key={`table_row_${i}`} >
                                    {
                                        columns.map((column, j) => (
                                            <Td key={`table_row_detail_${j}`} column={column.name}>
                                                {row[column.name]}
                                            </Td>
                                        ))
                                    }
                                </Tr>
                            })
                        }
                    </Table>
                </CardBody>
            </Card>
        )
    }
}

TableGenerator.defaultProps = {
    sortable: true,
    filterable: []
}
export default withRouter(TableGenerator);