import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Card,
  CardBody,
  CardTitle,
} from "reactstrap";
import { getLabelContent } from "../../../../../../shared/components/PrintServiceComponent/al_print/label_template";
import { labelsTypeList } from "../../../../../../helpers/print_service/labelsTypeList";
import { testPrintLabel } from "../../../../../../helpers/print_service/utility";

class PrintALPreview extends Component {
  componentDidMount() {
    this.renderPreview();
  }
  
  componentDidUpdate() {
    this.renderPreview();
  }

  renderPreview = () => {
    let container = window.document.getElementById('containerPP');
    const labelFindIndex = labelsTypeList.findIndex(el => el.lableName === this.props.printerDefaults.label_type);
    const labelType = labelFindIndex !== -1 ? this.props.printerDefaults.label_type : labelsTypeList[0].lableName;
    const labelWidth = labelFindIndex !== -1 ? labelsTypeList[labelFindIndex].width : Number(this.props.printerDefaults.label_width);
    const labelHeight = labelFindIndex !== -1 ? labelsTypeList[labelFindIndex].height : Number(this.props.printerDefaults.label_height);
    const fontSizeCoefficient = this.props.printerDefaults.font_size_coefficient ? Number(this.props.printerDefaults.font_size_coefficient) : 0.9;
    const barCodeType = this.props.printerDefaults.barcode_type ? this.props.printerDefaults.barcode_type : "CODE39";

    if (!labelType || !labelWidth || !labelHeight) {
      return;
    }
    if (container) {
      container.innerHTML = getLabelContent(testPrintLabel,
      {
        width: labelWidth,
        height: labelHeight,
        fontSizeCoefficient: fontSizeCoefficient,
        barCodeType: barCodeType
      }
      );
    }
  }
  render() {
    return (
      <Card style={{ height: "100%" }}>
        <CardBody style={{ height: "100%" }}>
          <CardTitle>Print Preview</CardTitle>
          <div
           
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "90%",
              position: "relative"
            }
          }>
            <div 
              id="containerPP"
              style={{ border: "1px solid black", borderRadius: "10px", overflow: "hidden" }}
            />
          </div>
        </CardBody>
      </Card>
    );
  }
}

PrintALPreview.propTypes = {
  printerDefaults: PropTypes.object.isRequired,
};

export default PrintALPreview;
