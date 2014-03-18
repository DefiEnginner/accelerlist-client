import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";

import { report_image } from "../../../assets/images";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
`;

const GenerateReportAnchorContainer = styled.div`
  margin-top: 30px;
  border-top: 1px solid lightgrey;
  padding: 30px;
  text-align: center;

  img {
    height: 400px;
  }
`;

class TransactionReportGenerator extends Component {
  render() {
    const { internationalization_config, userData } = this.props;
    console.log(internationalization_config, userData);

    return (
      <Container>
        {internationalization_config &&
          userData && (
            <div className="row">
              <a
                className="btn btn-primary text-uppercase mb-2"
                href={`https://${
                  internationalization_config.seller_central_url
                }/gp/payments-account/date-range-reports.html/ref=ag_xx_cont_payments`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Seller Central
              </a>
              <GenerateReportAnchorContainer>
                <p>
                  Click on "Generate a report" and select the "Transaction"
                  option, as pictured below:
                </p>
                <img className="col-md-12" src={report_image} alt="report_image" />
              </GenerateReportAnchorContainer>
            </div>
          )}
      </Container>
    );
  }
}

export default connect(
  state => ({
    internationalization_config: state.Auth.get("internationalization_config"),
    userData: state.Auth.get("userData")
  }),
  {}
)(TransactionReportGenerator);
