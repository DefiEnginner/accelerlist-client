import React from "react";
import { Card, CardBody, Button, Input } from "reactstrap";
import PropTypes from 'prop-types';
import categories from "../../../helpers/batch/amazon_categories";
import Tooltip from "../../../shared/components/Tooltip";
import "./style.css";

const ConditionNoteForm = props => (
    <Card className="mb-4">
        <CardBody className="section-title">
            {props.editingId ? 'Edit' : 'Create'} Condition Note
        </CardBody>
        <CardBody className="pt-0">
            <form id="form" className="condition-form">
                <ol>
                    <li>
                        <span>Pick Amazon Category</span>
                        <div className={props.hasError("category")} style={{ display: "flex"}}>
                            <Input
                                type="select"
                                disabled={props.disableForm}
                                name="category"
                                id="category"
                                onClick={props.handleChange}
                                onChange={props.handleChange} >
                                <option value="" />
                                {categories.map((category, idx) => {
                                    return (
                                        <option key={'cat-' + idx} value={category}>{category}</option>
                                    )
                                })}
                            </Input>
                            <Tooltip
                              tooltipId="AmazonCategory"
                              tooltipText="Amazon Category"
                            />
                        </div>
                    </li>
                    <li>
                        <span>Create unique sub-category</span>
                        <div className={props.hasError("subcategory")} style={{ display: "flex"}}>
                            <Input
                                name="subcategory"
                                disabled={props.disableForm}
                                id="subcategory"
                                onBlur={props.handleChange}
                            />
                            <Tooltip
                              tooltipId="uniqueSubCategory"
                              tooltipText="Unique sub-category"
                            />
                        </div>
                    </li>
                    <li>
                        <span>Assign comment nickname</span>
                        <div className={props.hasError("nickname")} style={{ display: "flex"}}>
                            <Input
                                name="nickname"
                                disabled={props.disableForm}
                                id="nickname"
                                onBlur={props.handleChange}
                            />
                            <Tooltip
                              tooltipId="commentNickname"
                              tooltipText="Comment nickname"
                            />
                        </div>
                    </li>
                    <li>
                        <span>ADD or EDIT condition note</span>
                        <div className={props.hasError("note_text")} style={{ display: "flex"}}>
                            <Input
                                type="textarea"
                                name="note_text"
                                disabled={props.disableForm}
                                id="note_text"
                                onBlur={props.handleChange}
                            />
                             <Tooltip
                              tooltipId="conditionNote"
                              tooltipText="Condition note"
                            />
                        </div>
                    </li>
                </ol>
                <div>
                    {props.editingId && (
                        <Button
                            type="button"
                            disabled={props.disableForm}
                            color="default"
                            onClick={props.cancelUpdate}
                        >
                            Cancel
                </Button>
                    )}
                    <Button
                        className="float-right"
                        type="button"
                        disabled={props.disableForm || props.savingConditionNote}
                        color="success"
                        onClick={props.submitForm}
                    >
                        Apply to Favorites
              </Button>{" "}
                </div>
            </form>
        </CardBody>
    </Card>
)

ConditionNoteForm.propTypes = {
    submitForm: PropTypes.func,
    handleChange: PropTypes.func,
    cancelUpdate: PropTypes.func,
    hasError: PropTypes.func,
    editingId: PropTypes.number
};

export default ConditionNoteForm;