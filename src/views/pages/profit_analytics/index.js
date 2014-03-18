import React, { Component } from "react";
import { CardGroup, Card, CardBody } from "reactstrap";
import styled from "styled-components";

import ViewContent from "./ViewContent";
import ViewHeader from "./ViewHeader";
import TransactionReportUploader from "./TransactionReportUploader";
import TransactionReportGenerator from "./TransactionReportGenerator";

const Container = styled.div`
  .card-group {
    .card {
      .card-body {
        height: 100%;
      }
    }
  }
`;

class ProfitAnalytics extends Component {
  render() {
    return (
      <div className="view">
        <ViewHeader />
        <ViewContent>
          <Container>
            <CardGroup>
              <Card>
                <CardBody>
                  <h6 className="mb-4">
                    Step1:&nbsp;&nbsp;
                    <span className="text-primary">
                      Request Transaction Report From Amazon
                    </span>
                  </h6>
                  <TransactionReportGenerator />
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <h6 className="mb-4">
                    Step2:&nbsp;&nbsp;
                    <span className="text-primary">Visualize Analytics</span>
                  </h6>
                  <TransactionReportUploader />
                </CardBody>
              </Card>
            </CardGroup>
          </Container>
        </ViewContent>
      </div>
    );
  }
}

export default ProfitAnalytics;
