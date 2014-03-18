import React, { Component, Fragment } from 'react';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Input,
  Button,
  Tooltip
} from 'reactstrap';
import { connect } from "react-redux";
import cloneDeep from "lodash/cloneDeep";
import filter from "lodash/filter";
import map from "lodash/map";

import './index.css';
import customSKUSelectorInitialTags from "../../../helpers/settings/custom_sku_selector_initial_tags";
import AddCircle from 'react-icons/lib/md/add-circle';
import RemoveCircle from 'react-icons/lib/md/remove-circle';
import SwapCircle from 'react-icons/lib/md/swap-horiz';
import NavigateBeforeCircle from 'react-icons/lib/md/navigate-before';
import NavigateNextCircle from 'react-icons/lib/md/navigate-next';

import userTagsActions from "../../../redux/settings/user_tags/actions";
import authActions from "../../../redux/auth/actions";

const { addUserTag, deleteUserTag, getUserTag } = userTagsActions;
const { updateUserData } = authActions;

class CustomSKUSelector extends Component {
    constructor () {
        super();
        this.state = {
            loadedForFirstTime: true,
            customTagsInput: '',
            unusedTags: [...customSKUSelectorInitialTags.unusedTags],
            SKUTemplate: [...customSKUSelectorInitialTags.SKUTemplate],
			invalidTagName: false,
			saveMessageFlashing: false,
			userTags: [],
        }
    }

    UNSAFE_componentWillMount() {
		const { listingDefaults} = this.props;
        this.updateSKUs(listingDefaults)
    }

    UNSAFE_componentWillReceiveProps(newProps) {
		const { listingDefaults, userTags} = newProps;
		this.setState({userTags: userTags});
        this.updateSKUs(listingDefaults)
	}

	componentDidMount() {
		this.props.getUserTag();
	}

	updateUserDataTag(tags){
		const { userData } = this.props;
		if(userData){
			let ud = userData;
			ud.settings["custom_sku_tags"] = tags;
			this.props.updateUserData(ud);
		}
	}

    updateSKUs = (listingDefaults) => {
        const { loadedForFirstTime, unusedTags } = this.state;
        if(loadedForFirstTime && !!listingDefaults) {
            if(!!listingDefaults.sku_prefix) {
                if(listingDefaults.should_use_custom_sku_template) {
                    let SKUs = listingDefaults.sku_prefix.split("-");
                    let parsedSKUs = [];
                    let preDefinedSKUs = [];
                    map(SKUs, sku => {
                        if(sku.length > 2) {
                            if(sku[0] === "{" && sku[sku.length -1 ] === "}") {
                                let value = sku.substring(1, sku.length -1);
                                let label = filter(customSKUSelectorInitialTags.unusedTags, tag => tag.value === value);
                                //accomodate custom added tags [text]
                                if(label.length > 0){
                                  label = label[0].label;
                                } else {
                                  label = sku.substring(
                                    1, sku.length -1).replace(/-/g, '');
                                  value = value.replace(/-/g, '');
                                }
                                parsedSKUs.push({ value, label });
                                preDefinedSKUs.push(value);
                            } else {
                                parsedSKUs.push({ value: sku, label: sku });
                            }
                        } else {
                            parsedSKUs.push({ value: sku, label: sku });
                        }
                    });
                    this.setState({ SKUTemplate: parsedSKUs }, () => {
                        const unusedSKUs = filter(unusedTags, tag => !preDefinedSKUs.includes(tag.value));
                        this.setState({ unusedTags: unusedSKUs });
                    });
                }
                this.setState({ loadedForFirstTime: false });
            }
        }
    }

    addTagSKUTemplate = (element, user_tag=false) => {
        let unusedBuffArr = this.state.unusedTags;
        let skuTemplateBuffArr = cloneDeep(this.state.SKUTemplate);
        const buffElement = filter(unusedBuffArr, sku => sku.value !== element.value);
		if(user_tag){
			if(skuTemplateBuffArr.find(x => x.value === element.value)){
				return;
			}
		}
		//integer count add at start initialy (as per current settings)
		if(element.value === 'sku_number'){
	        skuTemplateBuffArr.unshift(element);
		} else {
			//if integer count is at the end move it to back when adding
			if(skuTemplateBuffArr.length > 0){
				if(skuTemplateBuffArr[skuTemplateBuffArr.length-1].value === 'sku_number'){
					let t = element;
					element = skuTemplateBuffArr.pop();
					skuTemplateBuffArr.push(t);
				}
			}
	        skuTemplateBuffArr.push(element);
		}
        this.setState({
			unusedTags: buffElement,
	        SKUTemplate: skuTemplateBuffArr
        })
    }


    addCustomTagSKUTemplate = () => {
		let val = this.state.customTagsInput.trim();
		if(this.state.userTags.includes(val)){
			return;
		}
        if (this.state.customTagsInput.trim().length > 0) {
	        let buffArr = cloneDeep(this.state.SKUTemplate);
			let label = this.state.customTagsInput.trim();
			let count_at_end = false;
			val = val.replace(/-/g, '');
			val = val.replace(/\|/g, '');
			label = label.replace(/-/g, '');
			label = label.replace(/\|/g, '');
			let element = { value: `${val}`, label: label };
			let t = element;
			if(buffArr.length > 0){
				if(buffArr[buffArr.length-1].value === 'sku_number'){
					element = buffArr.pop();
					buffArr.push(t);
					count_at_end = true;
				}
			}
			buffArr.push(element);
			if(count_at_end){
				this.addToUserTags(t);
			} else {
				this.addToUserTags(element);
			}
		    this.setState({
			    SKUTemplate: buffArr,
				customTagsInput: ''
	        })
        }
    }

	delFromUserTags = (element) => {
		let tags = this.state.userTags;
		var x = tags.indexOf(element.value);
		if(x !== -1){
			tags.splice(x, 1);
		}
		this.props.deleteUserTag(tags.join('|'));
		this.updateUserDataTag(tags.join('|'));
		this.setState({userTags: tags});
	}

	addToUserTags = (element) => {
		let tags = this.state.userTags;
		tags.push(element.value);
		this.props.addUserTag(tags.join('|'));
		this.updateUserDataTag(tags.join('|'));
		this.setState({userTags: tags});
	}

    delSKUTemplateElement = (element) => {
        let unusedBuffArr = this.state.unusedTags;
        let skuTemplateBuffArr = cloneDeep(this.state.SKUTemplate);

        skuTemplateBuffArr = filter(skuTemplateBuffArr, sku => sku.value !== element.value);

        if (customSKUSelectorInitialTags.unusedTags.some(el => element.value === el.value)) {
            if (unusedBuffArr.some(el => element.value === el.value)) {
                return;
            } else {
                unusedBuffArr.push(element);
            }
		}
        this.setState({
            unusedTags: unusedBuffArr,
            SKUTemplate: skuTemplateBuffArr
        })
    }

	/*
	 * move integer count just to start or end
	 */
    moveIntegerCount = (element) => {
        let skuTemplateBuffArr = cloneDeep(this.state.SKUTemplate);
		if(skuTemplateBuffArr.length > 0){
			if(skuTemplateBuffArr[skuTemplateBuffArr.length-1].value === 'sku_number'){
				const d = skuTemplateBuffArr.pop();
				skuTemplateBuffArr.unshift(d);
			} else if(skuTemplateBuffArr[0].value === 'sku_number'){
				const d = skuTemplateBuffArr.shift();
				skuTemplateBuffArr.push(d)
			}
		}
		this.setState({
			SKUTemplate: skuTemplateBuffArr
		})
    }

	/*
	 * move custom SKU element to right
	 */
    moveSKUElementRight = (element) => {
        let skuTemplateBuffArr = cloneDeep(this.state.SKUTemplate);
		const { value } = element;
		let pos = null;
		if(skuTemplateBuffArr.length > 0){
			skuTemplateBuffArr.forEach((e, i) => {
				if(e.value === value){
					pos = i;
				}
			});
			//if not last already
			if(pos+1 < skuTemplateBuffArr.length){
				const d = skuTemplateBuffArr[pos];
				//if not item count as last
				if(skuTemplateBuffArr[pos+1].value !== 'sku_number'){
					skuTemplateBuffArr[pos] = skuTemplateBuffArr[pos+1]
					skuTemplateBuffArr[pos+1] = d;
				}
			}
		}
		this.setState({
			SKUTemplate: skuTemplateBuffArr
		})
    }

	/*
	 * move custom SKU element to left
	 */
    moveSKUElementLeft = (element) => {
        let skuTemplateBuffArr = cloneDeep(this.state.SKUTemplate);
		const { value } = element;
		let pos = null;
		if(skuTemplateBuffArr.length > 0){
			skuTemplateBuffArr.forEach((e, i) => {
				if(e.value === value){
					pos = i;
				}
			});
			//if not first already
			if(pos > 0){
				const d = skuTemplateBuffArr[pos]
				//if not item count as last
				if(skuTemplateBuffArr[pos-1].value !== 'sku_number'){
					skuTemplateBuffArr[pos] = skuTemplateBuffArr[pos-1]
					skuTemplateBuffArr[pos-1] = d;
				}
			}
		}
		this.setState({
			SKUTemplate: skuTemplateBuffArr
		})
    }

	flashSaveMessage(kill=false) {
		//flash message on save
		if(kill){
			this.setState({	saveMessageFlashing: false });
			return;
		}
		setTimeout(() => {
		  this.flashSaveMessage(true);
		}, 2000);
	}

	saveSKUTemplates = () => {
		this.setState({saveMessageFlashing: true});
        const { SKUTemplate } = this.state;
        let sku_prefix = "";
        map(SKUTemplate, SKU => {
			//if(SKU.value !== SKU.label) sku_prefix += `{${SKU.value}}-`;
			//else sku_prefix += `${SKU.value}-`;
			sku_prefix += `{${SKU.value}}-`;
        });
        sku_prefix = sku_prefix.substr(0, sku_prefix.length - 1);
        const submitData = {
          should_use_custom_sku_template: true,
          sku_prefix
        };
		this.props.onSaveListingDefaults(submitData);
		this.flashSaveMessage();
    }

    changeHandleCustomTagInput = (e) => {
        if (customSKUSelectorInitialTags.unusedTags.includes(e.target.value) || this.state.SKUTemplate.includes(e.target.value)) {
          this.setState({
            invalidTagName: true,
            customTagsInput: e.target.value
          })
        } else {
          this.setState({
            invalidTagName: false,
            customTagsInput: e.target.value
          })
        }
      }

	render() {
        const {
            customTagsInput,
            unusedTags,
            SKUTemplate,
			invalidTagName,
        } = this.state;
        const {
            isOpen,
        } = this.props;

		return (
            <Fragment>
                { !!isOpen ? (
                    <div>
                    <br/>
                    <Row className="title-row">
                        Choose which things you want to include in your custom SKU!
                    </Row>
                    <br/>
                    <Row>
                        <Card className="full-width">
                        <CardBody>
                            <CardTitle className="text-center">Unused Tags</CardTitle>
                            <Col xs="12" className="dashedZone">
                            <Row style={{ display: 'flex', justifyContent: 'center'}}>
                                {
                                unusedTags.map( element => {
                                    return(
                                    <div
                                        key={element.value + Math.random()}
                                        className="unused-items"
                                    >
                                        {element.label}
                                        <button onClick={() => this.addTagSKUTemplate(element)} className="addTagSKUTemplate">
                                        <AddCircle style={{ cursor: 'pointer' }} />
                                        </button>
                                    </div>
                                    )
                                })
                                }
                            </Row>
                            <br />
                            <Row style={{ display: 'flex', justifyContent: 'center'}}>
                                <Input
                                    onChange={this.changeHandleCustomTagInput}
                                    placeholder="Custom Field Text"
                                    style={{ maxWidth: '200px'}}
                                    id="TagNameInput"
                                    value={customTagsInput}
                                />
                                {
                                invalidTagName && (
                                    <Tooltip placement="left" isOpen={invalidTagName} target="TagNameInput">
                                    Invalid tag name. Such tag name already exists.
                                    </Tooltip>
                                )
                                }
                            <Button
                                color="info"
                                onClick={this.addCustomTagSKUTemplate}
                                disabled={invalidTagName}
                            >Add</Button>
                            </Row>
							<br />
                            <Row style={{ display: 'flex', justifyContent: 'center'}}>
                                {
                                this.state.userTags.map( element => {
                                    return(
                                    <div
                                        key={element + Math.random()}
                                        className="unused-items"
                                    >
                                        {element}
										<button
											onClick={() => this.delFromUserTags(
												{value: element, label: element})}
											className="addTagSKUTemplate">
                                        <RemoveCircle style={{ cursor: 'pointer' }} />
                                        </button>
										<button
											onClick={() => this.addTagSKUTemplate(
												{value: element, label: element}, true)}
											className="addTagSKUTemplate">
                                        <AddCircle style={{ cursor: 'pointer' }} />
                                        </button>
                                    </div>
                                    )
                                })
                                }
                            </Row>
                            </Col>
                        </CardBody>
                        </Card>
                    </Row>
                    <br/>
                    <Row>
                        <Card className="full-width">
                        <CardBody>
                            <CardTitle className="text-center">
                            <div>Generated SKU Template</div>
                            <br />
                            <div className="SKU-titleText">Note that SKUs can only be 39 characters long.</div>
                            <div className="SKU-titleText">We will truncate the end of the SKU if it is too long</div>
                            </CardTitle>
                            <Col xs="12" className="dashedZone">
                            <Row style={{ display: 'flex', justifyContent: 'center'}}>
                                {
                                SKUTemplate.length === 0 ?
                                <div>No tags added to template so far!</div>
                                :
                                SKUTemplate.map( element => {
                                    return(
                                    <div
                                        key={element.value + Math.random()}
                                        className="sku-template"
									>
										{(element.value === 'sku_number') ? (
										null) : (
										<button onClick={() => this.moveSKUElementLeft(element)} className="delSKUTemplateElement">
											<NavigateBeforeCircle style={{ cursor: 'pointer' }} />
										</button>
										)}
                                        {element.label}
										{(element.value === 'sku_number') ? (
											<button onClick={() => this.moveIntegerCount(element)} className="delSKUTemplateElement">
		                                        <SwapCircle style={{ cursor: 'pointer' }} />
			                                </button>
										) : (null)}
                                        <button onClick={() => this.delSKUTemplateElement(element)} className="delSKUTemplateElement">
	                                        <RemoveCircle style={{ cursor: 'pointer' }} />
                                        </button>
										{(element.value === 'sku_number') ? (
										null) : (
										<button onClick={() => this.moveSKUElementRight(element)} className="delSKUTemplateElement">
											<NavigateNextCircle style={{ cursor: 'pointer' }} />
										</button>
										)}
                                    </div>
                                    )
                                })
                                }
                            </Row>
							</Col>
                        </CardBody>
                        </Card>
                    </Row>
                    <Row style={{ display: 'flex', justifyContent: 'flex-end'}}>
						<Button
							onClick={this.saveSKUTemplates}
							style={{ marginTop: '20px' }}
							color="info"
							disabled={this.state.saveMessageFlashing}
						>Save</Button>
                    </Row>
						<div className="text-right">
							{ this.state.saveMessageFlashing
								? (
									<label className="text-right">
										SKU template saved
									</label>
								  )
								: (null)
							}
						</div>
                    </div>
                ) : ''}
            </Fragment>
        )
    }
}

//export default CustomSKUSelector;
export default connect(
  state => ({
		userTags: state.UserTags.get("userTags"),
		userData: state.Auth.get("userData"),
  }),
  {
	addUserTag,
	getUserTag,
	deleteUserTag,
	updateUserData,
  }
)(CustomSKUSelector);
