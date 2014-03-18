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
  fetchScoutList,
  addScoutToList,
  delScoutFromList,
  editScoutFromList
} = settingsActions;

class ScoutList extends Component {
  state = {
    scoutName: "",
    isOpenCollapse: true,
    editScoutId: null,
    editScoutName: null
  }

  static propTypes = {
    fetchScoutList: func.isRequired,
    addScoutToList: func.isRequired,
    delScoutFromList: func.isRequired,
    editScoutFromList: func.isRequired,
    scoutList: array
  }

  componentDidMount() {
    this.props.fetchScoutList();
  }

  handleAddScoutToList = scoutName => {
    const { addScoutToList } = this.props;
    addScoutToList(scoutName);
    this.setState({
      scoutName: "",
    });
  }

  editScoutFromList = (id, scoutName) => {
    this.setState({
      editScoutId: id,
      editScoutName: scoutName
    })
  }

  editScoutFromListDone = (id, scoutName) => {
    const { editScoutFromList } = this.props;
    editScoutFromList(id, scoutName);
    this.setState({
      editScoutId: null,
      editScoutName: null
    })
  }

  scoutRow = scout => {
    const { delScoutFromList } = this.props;
    const { editScoutId, editScoutName } = this.state;
    return (
      <React.Fragment key={scout.id}>
        <InputGroup>
          <Input
            style={{ cursor: "auto"}}
            disabled={!(editScoutId === scout.id)}
            placeholder="Enter Scout"
            value={editScoutId === scout.id ? editScoutName : scout.scout_name}
            onChange={(e) => this.setState({ editScoutName: e.target.value })}
          />
          <InputGroupAddon addonType="prepend">
            {
              editScoutId === scout.id ? (
                <React.Fragment>
                  <Button
                    disabled={editScoutName.length === 0}
                    color="success"
                    onClick={() => this.editScoutFromListDone(editScoutId, editScoutName)}
                  >
                    <IconEditDone size="20px" />
                  </Button>
                  <Button
                    color="success"
                    onClick={() => this.setState({ editScoutId: null, editScoutName: null })}
                  >
                    <IconEditCancel size="20px" />
                  </Button>
                </React.Fragment>
              ) : (
                <Button
                  color="success"
                  onClick={() => this.editScoutFromList(scout.id, scout.scout_name)}
                >
                  <IconEdit size="20px" />
                </Button>
              )
            }

            <Button
              color="danger"
              onClick={() => delScoutFromList(scout.id)}
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
    const { scoutList } = this.props;
    const { scoutName, isOpenCollapse } = this.state;
    return (
      <Card>
        <CardBody>
		  <CardTitle>Scout Settings</CardTitle>
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
                  ? "Hide Scout List"
                  : "Show Scout List"
                }
              </Button>
            </Col>
          </Row>
          <hr />
          <Collapse isOpen={isOpenCollapse}>
            { scoutList ? scoutList.map(element => (
                this.scoutRow(element)
              )): ""
            }
          </Collapse>
          <InputGroup>
            <Input
              placeholder="Enter New Scout"
              value={scoutName}
              onChange={(e) => this.setState({ scoutName: e.target.value })}
            />
            <InputGroupAddon addonType="prepend">
              <Button
                color="success"
                onClick={() => this.handleAddScoutToList(scoutName)}
                disabled={scoutName.length === 0}
              >
                Add Scout
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
    scoutList: state.Settings.get("scoutList"),
  };
}, {
  fetchScoutList,
  addScoutToList,
  delScoutFromList,
  editScoutFromList
})(ScoutList);
