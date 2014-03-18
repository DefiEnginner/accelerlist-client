import React, { Fragment } from "react";
import BatchTabPane from "./BatchTabPane";
import NotesTabPane from "./NotesTabPane";
import WorkflowTabPane from "./WorkflowTabPane";
import RepricerTabPane from "./RepricerTabPane";
import { Nav, NavItem, NavLink, TabContent, Badge } from "reactstrap";
import classnames from "classnames";
import PropTypes from "prop-types";
import batchActions from "../../../../../redux/batch/actions";
import appActions from "../../../../../redux/app/actions";
import settingsActions from "../../../../../redux/settings/actions";
import authActions from "../../../../../redux/auth/actions";
import { connect } from "react-redux";
import { momentDateToISOFormatConversion } from "../../../../../helpers/utility";
import { checkPriceLimit, getBatchFieldsIncludedSKUTemplate } from "../../../../../helpers/batch/utility";
import IconBolt from "react-icons/lib/fa/bolt";

const {
  updateListingDefaultsData,
  setSidebarTabId,
  updateModalDisplay,
  updateCurrentWorkingListingData,
	updateKeyValue,
	batchMetadataUpdate,
} = batchActions;

const { userError } = appActions;
const { updateUserSettings } = settingsActions
const { updateUserData } = authActions;

/*
This component is used display the sidebar, where the user can choose between different panes.
Overall the function of the sidebar in the context of the product, is that they want to use
this to set their defaults for price, condition, etc., and in the future also the workflow options
for listing (for example, do we want to auto-price for the user, etc.)

props field expects:
1) batchListingDefaults data corresponding to defaults the user has selected
2) updateListingDefaultsData function that updates redux store with new form changes
*/
class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onPriceWasChanged = () => {
    const { batchListingDefaults } = this.props;
    const listingDefaultsAfterPriceLimitCheck = checkPriceLimit(batchListingDefaults, batchListingDefaults);
    if (listingDefaultsAfterPriceLimitCheck.minPrice !== batchListingDefaults.minPrice) {
      this.props.updateListingDefaultsData(
        "minPrice",
        listingDefaultsAfterPriceLimitCheck.minPrice
      );
    }
    if (listingDefaultsAfterPriceLimitCheck.maxPrice !== batchListingDefaults.maxPrice) {
      this.props.updateListingDefaultsData(
        "maxPrice",
        listingDefaultsAfterPriceLimitCheck.maxPrice
      );
    }
  }

  togglePresetsNav(tabId) {
    if (this.props.sidebarTabId !== tabId) {
      this.props.setSidebarTabId(tabId);
    }
  }

  updateNote(note) {
    let { updateListingDefaultsData } = this.props;
    updateListingDefaultsData("note", note.trim());
  }

  updateSKUPrefix = data => {
    let { updateListingDefaultsData } = this.props;
    updateListingDefaultsData("skuPrefix", data.sku_prefix);
    updateListingDefaultsData(
      "shouldUseCustomSkuTemplate",
      data.should_use_custom_sku_template
    );
    this.props.closeModal();
  };

  updateListingDefaultsDataWithValue(fieldName, value) {
    let {
      updateListingDefaultsData
    } = this.props;
    updateListingDefaultsData(fieldName, value);
  }

  updateListingDefaultsData(fieldName, event) {
    let {
      updateListingDefaultsData,
      createNewSupplier
    } = this.props;

    if (fieldName === "supplier" && event !== null) {
      let isExists = this.props.suppliers.filter(function(value) {
        return value.supplier_name === event.value;
      });
      if (!Array.isArray(isExists) || !isExists.length) {
        createNewSupplier(event.value);
      }
    }

    if (!event) {
      // in this case, the event was null but that's because of react-datepicker/react-select behavior
      // when the field is empty - it will make the event null.
      // So, in this case it's still ok, and we propogate the null event.
      updateListingDefaultsData(fieldName, null);
    } else if (event.label) {
      // ok then it is a select component.
      if (
        fieldName === "shouldUseCustomSkuTemplate" &&
        event.value === "modify"
      ) {
        this.props.updateModalDisplay("custom_sku_template_modal");
        updateListingDefaultsData(fieldName, event.value);
      } else {
        if (fieldName === "shouldUseCustomSkuTemplate" && !event.value) {
          updateListingDefaultsData("skuPrefix", "");
        }
        updateListingDefaultsData(fieldName, event.value);
      }
    } else if (event._d) {
      // ok then it is a datepicker component (this will be a moment object.)
      // _d field denotes that there is a current date set that can be formatted.
      updateListingDefaultsData(
        fieldName,
        momentDateToISOFormatConversion(event)
      );
    } else {
      // otherwise it is a regular input field.
      updateListingDefaultsData(
        fieldName,
        event.target.value
      );
    }

    // Add extra logic to also reset note subcategory, if note category was changed
    if (fieldName === "noteCategory") {
      updateListingDefaultsData(
        "noteSubcategory",
        "All Subcategories"
      );
    }

    // Add extra logic to turn off auto-price rule, if list price is empty
    if (fieldName === "price" && (!event || !event.target.value)) {
      updateListingDefaultsData(
        "listPriceRuleType",
        "own-price"
      );
    }

    // Add extra logic to turn on fixed-value rule, if list price is not empty
    if (fieldName === "price" && (!!event && !!event.target.value)) {
      updateListingDefaultsData(
        "listPriceRuleType",
        "fixed_value"
      );
    }
  }
  checkRequiredFields = () => {
    const { batchListingDefaults, batchMetadata } = this.props;
    let requiredFieldsArray = [];
    let notValidFieldsArray = [];
    if (batchListingDefaults.skuPrefix) {
      requiredFieldsArray = getBatchFieldsIncludedSKUTemplate(batchListingDefaults.skuPrefix);
    }
    const notRequiredFieldsFromSKUTemplate = [
      "asin",
      "salesrank",
      "condition",
      "price",
	  "listing_date",
    ];

    //qty is added manually because qty is not a part of SKU template but it also is a required field.
    requiredFieldsArray.push("qty");

    if (batchMetadata && batchMetadata.channel === "DEFAULT") {
      requiredFieldsArray.push("shippingTemplate");
    }

    if (batchListingDefaults && batchListingDefaults.priceRuleDirection) {
      if (batchListingDefaults.priceRuleDirection === "roi" || batchListingDefaults.priceRuleDirection === "profit_margin") {
        requiredFieldsArray.push("buyCost");
      }
    }

    requiredFieldsArray.forEach(el => {
      if (!batchListingDefaults[el] || batchListingDefaults[el] === "" || batchListingDefaults[el] === null) {
        if (notRequiredFieldsFromSKUTemplate.indexOf(el) === -1 && notValidFieldsArray.indexOf(el) === -1) {
          notValidFieldsArray.push(el);
        }
      }
    })
    return notValidFieldsArray;
  }
  scrollToField = (fieldID) => {
    const element = document.getElementById(fieldID);
    if (element) {
      element.scrollIntoView();
    }
  }
  render() {
    let {
      sidebarTabId,
      batchListingDefaults,
      conditionNotes,
      listingDefaults,
      saveListingDefaults,
      currentModal,
      internationalConfig,
      batchMetadata,
      currentWorkingListingData,
      updateCurrentWorkingListingData,
      updateKeyValue,
		userError,
		batchMetadataUpdate,
    } = this.props;
    const notValidRequiredFields = this.checkRequiredFields();
    return (
      <Fragment>
        <div className="app-sidebar tab-sidebar">
          <Nav tabs>
            <NavItem>
              <NavLink
                className={classnames({ active: sidebarTabId === "1" })}
                onClick={() => {
                  this.togglePresetsNav("1");
                }}
              >
                Batch {
                  notValidRequiredFields.length > 0 ? (
                    <span>
                      <Badge
                        color="danger"
                        onClick={() => this.scrollToField(`${notValidRequiredFields[0]}`)}
                        style={{ cursor: "pointer" }}
                        pill
                      >
                        {notValidRequiredFields.length}
                      </Badge>
                    </span>
                  ) : ""
                }
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: sidebarTabId === "2" })}
                onClick={() => {
                  this.togglePresetsNav("2");
                }}
              >
                Notes
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: sidebarTabId === "3" })}
                onClick={() => {
                  this.togglePresetsNav("3");
                }}
              >
                Workflow
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: sidebarTabId === "4" })}
                onClick={() => {
                  this.togglePresetsNav("4");
                }}
                title="Repricer"
              >
                <IconBolt size="18" />
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent activeTab={sidebarTabId}>
            <BatchTabPane
              updateListingDefaultsData={this.updateListingDefaultsData.bind(
                this
              )}
              batchListingDefaults={batchListingDefaults}
              listingDefaults={listingDefaults}
              saveListingDefaults={saveListingDefaults}
              showCustomSKUsModal={currentModal === "custom_sku_template_modal"}
              updateSKUPrefix={this.updateSKUPrefix}
              closeCustomSKUModal={() => this.props.closeModal()}
              suppliers={this.props.suppliers}
              scouts={this.props.scouts}
              tabId={"1"}
              internationalConfig={internationalConfig}
              batchChannel={batchMetadata.channel}
              onPriceWasChanged={this.onPriceWasChanged}
              notValidFields={notValidRequiredFields}
              userData={this.props.userData}
              updateUserData={this.props.updateUserData}
              updateUserSettings={this.props.updateUserSettings}
            />
            <NotesTabPane
              updateListingDefaultsData={this.updateListingDefaultsData.bind(
                this
              )}
              batchListingDefaults={batchListingDefaults}
              conditionNotes={conditionNotes}
              updateNote={this.updateNote.bind(this)}
              tabId={"2"}
              userError={userError}
            />
            <WorkflowTabPane
              updateListingDefaultsData={this.updateListingDefaultsDataWithValue.bind(
                this
              )}
              updateCurrentWorkingListingData={updateCurrentWorkingListingData}
              batchListingDefaults={batchListingDefaults}
              updateKeyValue={updateKeyValue}
              currentWorkingListingData={currentWorkingListingData}
			  batchMetadataUpdate={batchMetadataUpdate}
			  batchMetadata={batchMetadata}
              tabId={"3"}
              userError={userError}
            />
            <RepricerTabPane
              tabId={"4"}
            />
          </TabContent>
        </div>
      </Fragment>
    );
  }
}

SideBar.propTypes = {
  batchListingDefaults: PropTypes.object.isRequired,
  batchMetadata: PropTypes.object.isRequired,
  sidebarTabId: PropTypes.string.isRequired,
  setSidebarTabId: PropTypes.func.isRequired,
  updateListingDefaultsData: PropTypes.func.isRequired,
  conditionNotes: PropTypes.array.isRequired,
  createNewSupplier: PropTypes.func.isRequired,
  suppliers: PropTypes.array.isRequired,
  scouts: PropTypes.array.isRequired,
  updateModalDisplay: PropTypes.func.isRequired,
  internationalConfig: PropTypes.object.isRequired
};

export default connect(
  state => ({
    batchListingDefaults: state.Batch.get("batchListingDefaults"),
    batchMetadata: state.Batch.get("batchMetadata"),
    sidebarTabId: state.Batch.get("sidebarTabId"),
    conditionNotes: state.Batch.get("conditionNotes"),
    internationalConfig: state.Auth.get("internationalization_config"),
    currentWorkingListingData: state.Batch.get("currentWorkingListingData"),
    userData: state.Auth.get("userData"),
  }),
  {
    updateListingDefaultsData,
    setSidebarTabId,
    updateModalDisplay,
    updateCurrentWorkingListingData,
    updateKeyValue,
    userError,
	updateUserData,
	updateUserSettings,
	batchMetadataUpdate,
  }
)(SideBar);
