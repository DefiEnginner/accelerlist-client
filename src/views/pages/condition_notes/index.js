import React from "react";
import { connect } from "react-redux";
import conditionNoteAction from "../../../redux/condition_notes/actions";
import { Card, CardBody, Col } from "reactstrap";
import "./style.css";
import ManageConditionNotes from "./ManageConditionNotes";
import ConditionNoteForm from "./ConditionNoteForm";

const { startConditionEdit, saveConditionNote } = conditionNoteAction;

const ViewHeader = () => <div className="view-header" />;

const ViewContent = ({ children }) => (
  <div className="view-content view-components">{children}</div>
);

const defaultFormValues = {
  category: "",
  subcategory: "",
  nickname: "",
  note_text: ""
};

class ConditionNotes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formValues: {
        ...defaultFormValues
      },
      touched: {}
    }
  }
  cancelUpdate = () => {
    this.setState({
      formValues: {
        ...defaultFormValues
      },
      touched: {}
    });
    document.getElementById("form").reset();
    this.props.startConditionEdit(null);
  }
  submitForm = () => {
    const { category, subcategory, nickname, note_text } = this.state.formValues;
    if (!category || !subcategory || !nickname || !note_text) {
      this.setState({
        touched: {
          category: true,
          subcategory: true,
          nickname: true,
          note_text: true
        }
      })
      return;
    }
    this.props.saveConditionNote(this.state.formValues, "form", this.props.editingId);
    this.setState({
      touched: {}
    })
  }
  handleChange = event => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      formValues: {
        ...this.state.formValues,
        [name]: value
      },
      touched: {
        ...this.state.touched,
        [name]: true
      }
    });
  }
  editNote = note => {
    const { id, category, subcategory, nickname, note_text } = note;
    this.props.startConditionEdit(id);
    this.setState({
      formValues: {
        category: (category || ""),
        subcategory: (subcategory || ""),
        nickname: (nickname || ""),
        note_text: (note_text || "")
      }
    });

    Object.keys(note).map(key => {
      let element = document.getElementById(key);
      if (element) {
        element.value = note[key];
      }
      return element;
    })
  }
  hasErrorClass = name => {
    const hasError = this.state.touched[name] && !this.state.formValues[name]
    if (hasError) {
      return "error"
    }
    return ""
  }
  render() {
    return (
      <div className="view address-view">
        <ViewHeader />
        <ViewContent>
          <div className="row">
            <Col sm={12}>
              <Card className="mb-4">
                <CardBody>
                  <h4>Condition Notes</h4>
                </CardBody>
              </Card>
            </Col>
          </div>
          <div className="row">
            <Col sm={4}>
              <ConditionNoteForm
                submitForm={this.submitForm}
                handleChange={this.handleChange}
                cancelUpdate={this.cancelUpdate}
                hasError={this.hasErrorClass}
                editingId={this.props.editingId} />
            </Col>
            <Col sm={8}>
              <ManageConditionNotes
                editNote={this.editNote} />
            </Col>
          </div>
        </ViewContent>
      </div>
    );
  }
}

export default connect(
  state => ({
    ...state.ConditionNotes.toJS()
  }),
  { startConditionEdit, saveConditionNote }
)(ConditionNotes);
