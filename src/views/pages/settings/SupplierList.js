import React, { Component } from "react";
import {
  Card,
  CardBody,
  CardTitle,
  InputGroup,
  InputGroupAddon,
  Input,
  Button,
  Collapse,
  Row,
  Col
} from "reactstrap";
import { func, array } from "prop-types";
import { connect } from "react-redux";
import IconTrash from "react-icons/lib/fa/trash-o";
import IconEdit from "react-icons/lib/md/edit";
import IconEditDone from "react-icons/lib/md/done";
import IconEditCancel from "react-icons/lib/ti/cancel";
import settingsActions from '../../../redux/settings/actions';
import './index.css';

const {
  fetchSupplierList,
  addSupplierToList,
  delSupplierFromList,
  editSupplierFromList
} = settingsActions;

class SupplierList extends Component {
  state = {
    supplierName: "",
    isOpenCollapse: true,
    editSupplierId: null,
    editSupplierName: null
  }

  static propTypes = {
    fetchSupplierList: func.isRequired,
    addSupplierToList: func.isRequired,
    delSupplierFromList: func.isRequired,
    editSupplierFromList: func.isRequired,
    supplierList: array
  }

  componentDidMount() {
    this.props.fetchSupplierList();
  }

  handleAddSupplierToList = supplierName => {
    const { addSupplierToList } = this.props;
    addSupplierToList(supplierName);
    this.setState({
      supplierName: "",
    });
  }

  editSupplierFromList = (id, supplierName) => {
    this.setState({
      editSupplierId: id,
      editSupplierName: supplierName
    })
  }

  editSupplierFromListDone = (id, supplierName) => {
    const { editSupplierFromList } = this.props;
    editSupplierFromList(id, supplierName);
    this.setState({
      editSupplierId: null,
      editSupplierName: null
    })
  }

  supplierRow = supplier => {
    const { delSupplierFromList } = this.props;
    const { editSupplierId, editSupplierName } = this.state;
    return (
      <React.Fragment key={supplier.id}>
        <InputGroup>
          <Input
            style={{ cursor: "auto"}}
            disabled={!(editSupplierId === supplier.id)}
            placeholder="Enter Supplier"
            value={editSupplierId === supplier.id ? editSupplierName : supplier.supplier_name}
            onChange={(e) => this.setState({ editSupplierName: e.target.value })}
          />
          <InputGroupAddon addonType="prepend">
            {
              editSupplierId === supplier.id ? (
                <React.Fragment>
                  <Button
                    disabled={editSupplierName.length === 0}
                    color="success"
                    onClick={() => this.editSupplierFromListDone(editSupplierId, editSupplierName)}
                  >
                    <IconEditDone size="20px" />
                  </Button>
                  <Button
                    color="success"
                    onClick={() => this.setState({ editSupplierId: null, editSupplierName: null })}
                  >
                    <IconEditCancel size="20px" />
                  </Button>
                </React.Fragment>
              ) : (
                <Button
                  color="success"
                  onClick={() => this.editSupplierFromList(supplier.id, supplier.supplier_name)}
                >
                  <IconEdit size="20px" />
                </Button>
              )
            }

            <Button
              color="danger"
              onClick={() => delSupplierFromList(supplier.id)}
            >
              <IconTrash size="20px" />
            </Button>
          </InputGroupAddon>
        </InputGroup>
        <br />
      </React.Fragment>
    )
  }

  toggleCollapse = () => {
    this.setState({ isOpenCollapse: !this.state.isOpenCollapse });
  }

  render() {
    const { supplierList } = this.props;
    const { supplierName, isOpenCollapse } = this.state;
    return (
      <Card>
        <CardBody>
		  <CardTitle>Supplier Settings</CardTitle>
          <Row>
            <Col>
            </Col>
            <Col>
              <Button
                onClick={this.toggleCollapse}
                color="primary "
                className="mb-2 float-right"
              >
                {
                  isOpenCollapse
                  ? "Hide Supplier List"
                  : "Show Supplier List"
                }
              </Button>
            </Col>
          </Row>
          <hr />
          <Collapse isOpen={isOpenCollapse}>
            { supplierList ? supplierList.map(element => (
                this.supplierRow(element)
              )): ""
            }
          </Collapse>
          <InputGroup>
            <Input
              placeholder="Enter New Supplier"
              value={supplierName}
              onChange={(e) => this.setState({ supplierName: e.target.value })}
            />
            <InputGroupAddon addonType="prepend">
              <Button
                color="success"
                onClick={() => this.handleAddSupplierToList(supplierName)}
                disabled={supplierName.length === 0}
              >
                Add Supplier
              </Button>
            </InputGroupAddon>
          </InputGroup>
        </CardBody>
      </Card>
    );
  }
}

export default connect(state => {
  return {
    supplierList: state.Settings.get("supplierList"),
  };
}, {
  fetchSupplierList,
  addSupplierToList,
  delSupplierFromList,
  editSupplierFromList
})(SupplierList);
