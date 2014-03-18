import { backendHost, request } from "../../../helpers/apiConfig";

export async function pollUploadProcessingStatus(processingJobUuid) {
  try {
    let res = await request.get(
      backendHost + "/api/v1/profit_analytics/upload?batch_upload_job_id=" +
      processingJobUuid
    );

    let response = res.body;

    if (response.status !== "failed" && response.status !== "processed") {
      setTimeout(function () {
        pollUploadProcessingStatus(processingJobUuid);
      }, 1000);
      console.log("not done, still wokrin on it....");
    } else {
      console.log('done');
      if (response.status === "processed") {
        return 'processed';
        // self.props.history.push('/dashboard/profit_analytics/report_viewer')
        // window.location.href =
        //   "/transaction_report/v2/" + processingJobUuid + "/";
      }
      if (response.status === "failed") {
        return 'failed';
        // self.setState({
        //   showFailureMessage: true
        // });
      }

      return 'not done';
    }
  } catch (err) {
    return;
  }
}
