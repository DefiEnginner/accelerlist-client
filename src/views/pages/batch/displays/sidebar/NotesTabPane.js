import React from "react";
import { Label, FormGroup, Row, Col, TabPane, Input } from "reactstrap";
import Select from "react-select";
import PropTypes from "prop-types";
import {getConditionOptions, getCategoryOptions, checkConditionIsUsedOrNew} from '../../../../../helpers/batch/utility';
//import SideBarNoteButtonPopover from "../shared/SideBarNoteButtonPopover";
import NoteButtonPopover from "../shared/NoteButtonPopover";
import Tooltip from "../../../../../shared/components/Tooltip";
/*
This component is used display the condition notes pane, where the user the user
can easily select their default condition and default condition note.
It is a child component used by the SideBar.

props field expects:
1) tabId: string corresponding to the tab number i.e. "1", "2"
2) batchListingDefaults data corresponding to defaults the user has selected
3) updateListingDefaultsData function that updates redux store with new form changes
*/

const NotesTabPane = props => {
  let {
    tabId,
    conditionNotes,
    batchListingDefaults,
    updateListingDefaultsData,
    updateNote,
    userError
  } = props;
  let subcategories = new Set();
  conditionNotes.forEach(note => {
    if (note.category === batchListingDefaults.noteCategory) {
      subcategories.add(note.subcategory);
    }
  });
  subcategories.add("All Subcategories")

  let subCategoryOptions = Array.from(subcategories).map(subcategory => {
    return {
      label: subcategory,
      value: subcategory
    };
  });

  let filteredNotes = conditionNotes.filter(note => {
    let category = batchListingDefaults.noteCategory;
    let matchingCategory = category === note.category || category === "All Categories";
    let subcategory = batchListingDefaults.noteSubcategory;
    let matchingSubcategory = subcategory === note.subcategory || subcategory === "All Subcategories";
    if (!matchingCategory || !matchingSubcategory) {
      return false;
    }
    return true;
  })
  
  const updateCondition = (event, userErrorCall) => {
    if(batchListingDefaults.listPriceRuleType === 'match_buy_box_price' || ["higher_than_buy_box", "lower_than_buy_box"].indexOf(batchListingDefaults.priceRuleDirection) > -1)
    {
      if(!event || !checkConditionIsUsedOrNew(event.value)) {
        userErrorCall("Invalid condition because the auto-price calculation requires a Used/New condition. Please change the auto-price rule first on the workflow tab.");
        return;
      }
    }
    updateListingDefaultsData("condition", event)
  }

  return (
    <TabPane tabId={tabId}>
      <br />
      <Row>
        <Col lg="12">
          <FormGroup>
            <label><strong>Condition</strong></label>
            <Tooltip
              tooltipId="Condition"
              tooltipText="Condition"
            />
            <br />
            <Select
              name="form-field-name"
              value={{
                value: batchListingDefaults.condition,
                label: batchListingDefaults.condition
              }}
              options={getConditionOptions().concat([{label: "NoDefault", value: "NoDefault"}])}
              onChange={ (event) => updateCondition(event, userError)}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <strong>Note Category</strong>
              <Tooltip
                tooltipId="NoteCategory"
                tooltipText="Note Category"
              />
            </Label>
            <Select
              name="form-field-name"
              value={{
                value: batchListingDefaults.noteCategory,
                label: batchListingDefaults.noteCategory
              }}
              options={getCategoryOptions()}
              onChange={updateListingDefaultsData.bind(this, "noteCategory")}
            />
          </FormGroup>
          <FormGroup>
            <Label>
              <strong>Note SubCategory</strong>
              <Tooltip
                tooltipId="NoteSubCategory"
                tooltipText="Note SubCategory"
              />
            </Label>
            <Select
              name="form-field-name"
              value={{
                value: batchListingDefaults.noteSubcategory,
                label: batchListingDefaults.noteSubcategory
              }}
              options={subCategoryOptions}
              onChange={updateListingDefaultsData.bind(this, "noteSubcategory")}
            />
          </FormGroup>
          <FormGroup>
            {filteredNotes && filteredNotes.length > 0 ? filteredNotes.map(note => {
              let category = batchListingDefaults.noteCategory;
              let matchingCategory = category === note.category || category === "All Categories";
              let subcategory = batchListingDefaults.noteSubcategory;
              let matchingSubcategory = subcategory === note.subcategory || subcategory === "All Subcategories";
              if (!matchingCategory || !matchingSubcategory) {
                return false;
              }
              return (
                <NoteButtonPopover
                  key={note.id}
                  content={note.note_text}
                  id={String(note.id)}
                  buttonText={note.nickname}
                  buttonStyle="full-width light-bottom-margin note-btn-popover"
                  action={() =>
                    updateNote(`${note.note_text}`)
                  }
                />
              );
            }) : 
              <p>No condition notes snippets found.</p>
            }
          </FormGroup>
          <FormGroup>
            <Label>
              <strong>Default Note</strong>
              <Tooltip
                tooltipId="DefaultNote"
                tooltipText="Default Note"
              />
            </Label>
            <br />
            <Input
              type="textarea"
              className="full-width"
              rows="8"
              value={batchListingDefaults.note}
              onChange={updateListingDefaultsData.bind(this, "note")}
            />
          </FormGroup>
          <br />
        </Col>
      </Row>
    </TabPane>
  );
};

NotesTabPane.propTypes = {
  tabId: PropTypes.string.isRequired,
  updateListingDefaultsData: PropTypes.func.isRequired,
  batchListingDefaults: PropTypes.object.isRequired,
  updateNote: PropTypes.func.isRequired,
  userError: PropTypes.func.isRequired
};

export default NotesTabPane;
