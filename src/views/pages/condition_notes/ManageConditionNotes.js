import React from "react";
import { connect } from "react-redux";
import ConditionNotesFlow from "./ConditionNotesFlow";
import { Card, CardBody, Col, Input } from "reactstrap";
import conditionNoteAction from "../../../redux/condition_notes/actions";
import PropTypes from 'prop-types';
import Tooltip from "../../../shared/components/Tooltip";
import "./style.css";

const { fetchConditionNoteList, deleteConditionNote, updateLocalConditionPriority, syncLocalConditionNotePriority } = conditionNoteAction;

class ManageConditionNotes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        this.props.fetchConditionNoteList();
    }
    getUniqueParamByKey(key) {
        let list = [...new Set(this.props.conditionNoteList.filter(note => {
            return (note[key] !== "All Categories") || key !== "category"
        }).map((note) => {
            return note[key]
        }))];
        if (key === "category") {
          list.unshift("All Categories");
        }
        list.sort();
        if (!this.state.selectedCategory && key === "category") {
          this.setState({
            selectedCategory: list[0]
          })
        }
        return list;
    }
    removeNote = id => {
        this.props.deleteConditionNote(id);
    }
    renderConditionNotes() {
        const {
            conditionNoteList,
            conditionNoteLocalPriorityList,
            editNote,
            updateLocalConditionPriority
        } = this.props;

        const {
            selectedCategory,
            selectedSubCategory
        } = this.state;

        if (!conditionNoteList) {
            return (
                <CardBody>
                    <p>Loading...</p>
                </CardBody>
            )
        }
        if (conditionNoteList.length === 0) {
            return (
                <CardBody>
                    <p>No condition notes found</p>
                </CardBody>
            )
        }

        const filteredconditionNoteList = conditionNoteList.sort((note1, note2) => {
            return (note1.priority - note2.priority);
        }).filter((note) => {
            return (!selectedCategory || selectedCategory === "All Categories"
                || note.category === selectedCategory) && (
                    !selectedSubCategory ||
                    note.subcategory === selectedSubCategory
                )
        }).map(note => {
            const updatedPriority = conditionNoteLocalPriorityList.find(notePriority => {
                return notePriority.id === note.id;
            }) || {
                priority: note.priority
            };
            return {
                ...note,
                ...updatedPriority
            }
        })

        return (
          <ConditionNotesFlow
            filteredconditionNoteList={filteredconditionNoteList}
            removeNote={this.removeNote}
            editNote={editNote}
            updateLocalConditionPriority={updateLocalConditionPriority}
            syncLocalConditionNotePriority={this.syncLocalConditionNotePriority}
          />
        )
    }
    syncLocalConditionNotePriority = () => {
        this.props.syncLocalConditionNotePriority(this.props.conditionNoteLocalPriorityList)
    }
    render() {
        const {
            conditionNoteList,
            disableForm
        } = this.props;
        return (
            <Card className="mb-4">
                <CardBody>
                    <div className="row">
                        <Col sm={4} className="section-title">
                            Manage Condition Notes
                    </Col>
                        {conditionNoteList && (<Col sm={4} style={{ display: "flex"}}>
                            <Tooltip
                              tooltipId="ManageConditionNotes"
                              tooltipText="Manage Condition Notes"
                            />
                            <Input
                                type="select"
                                disabled={disableForm}
                                name="selected_category"
                                id="selected_category"
                                onChange={(e) => {
                                    this.setState({
                                        selectedCategory: e.target.value
                                    })
                                }} >
                                {this.getUniqueParamByKey('category').map(category => {
                                    return (
                                        <option key={category} value={category}>{category}</option>
                                    )
                                })}
                            </Input>
                        </Col>)}
                        {conditionNoteList && (<Col sm={4}>
                            <Input
                                type="select"
                                disabled={disableForm}
                                name="selected_subcategory"
                                id="selected_subcategory"
                                onChange={(e) => {
                                    this.setState({
                                        selectedSubCategory: e.target.value
                                    })
                                }} >
                                <option value="">All (Sub Category)</option>
                                {this.getUniqueParamByKey('subcategory').map(category => {
                                    return (
                                        <option key={category} value={category}>{category}</option>
                                    )
                                })}
                            </Input>
                        </Col>)}
                    </div>
                </CardBody>
                {this.renderConditionNotes()}
            </Card>
        )
    }
}


ManageConditionNotes.propTypes = {
    editNote: PropTypes.func,
};

export default connect(
    state => ({
        ...state.ConditionNotes.toJS()
    }),
    { fetchConditionNoteList, deleteConditionNote, updateLocalConditionPriority, syncLocalConditionNotePriority }
)(ManageConditionNotes);