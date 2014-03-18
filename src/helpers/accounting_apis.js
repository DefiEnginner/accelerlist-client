import { client } from "./apiConfig";

function getAvailableReportsAPI(page, page_size, additionalFields) {
  const currentPage = page || 1;
  const currentPageSize = page_size || 10;
  const body = {
    keys: additionalFields || []
  }
  return client
    .post(`/api/v1/profit_analytics/history?page=${currentPage}&page_size=${currentPageSize}`, body)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getAvailableReportsByLinkAPI(link, additionalFields) {
  const reportURL = link || "/api/v1/profit_analytics/history";
  const body = {
    keys: additionalFields || []
  }
  return client
    .post(reportURL, body)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function uploadTransactionReportAPI(file) {
  return client
    .post("/api/v1/profit_analytics/upload",  file)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getStatusOfUploadingTransactionReportAPI(processingJobUuid) {
  return client
    .get(`/api/v1/profit_analytics/upload?batch_upload_job_id=${processingJobUuid}`)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function getGeneratedReportAPI(uuid) {
  return client
    .get(`/api/v1/profit_analytics/?generated_report_id=${uuid}`)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function reuploadTransactionReportAPI(data) {
  return client
    .post(`/api/v1/profit_analytics/reupload_v2`, data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseCategoryAddAPI(data) {
  return client
		.post(`/api/v1/expense/category`, data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseCategoryDeleteAPI(data) {
  return client
		.delete('/api/v1/expense/category?categoryId='+data.id)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseCategoriesGetAPI() {
  return client
		.get(`/api/v1/expense/category`)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseCategoryUpdateAPI(data) {
  return client
		.put('/api/v1/expense/category', data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseGetAPI() {
  return client
		.get(`/api/v1/expense`)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseAddAPI(data) {
  return client
		.post(`/api/v1/expense`, data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseDeleteAPI(data) {
  return client
		.delete('/api/v1/expense?id='+data.id)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseUpdateAPI(data) {
  return client
		.put('/api/v1/expense', data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function expenseGetForPeriodAPI(data) {
  return client
		.post('/api/v1/expense/incurred_expenses', data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function updateReportAPI(data) {
  return client
		.put('/api/v1/profit_analytics/report', data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

function deleteReportAPI(data) {
  return client
		.delete('/api/v1/profit_analytics/report?id=' + data)
    .then(response => {
      return response;
    })
    .catch(err => {
      throw err;
    });
}

export {
  uploadTransactionReportAPI,
  getStatusOfUploadingTransactionReportAPI,
  getGeneratedReportAPI,
  getAvailableReportsAPI,
  getAvailableReportsByLinkAPI,
	reuploadTransactionReportAPI,
	expenseCategoryAddAPI,
	expenseCategoriesGetAPI,
	expenseCategoryDeleteAPI,
	expenseCategoryUpdateAPI,
	expenseGetAPI,
	expenseAddAPI,
	expenseDeleteAPI,
	expenseUpdateAPI,
	expenseGetForPeriodAPI,
	deleteReportAPI,
	updateReportAPI,
};
