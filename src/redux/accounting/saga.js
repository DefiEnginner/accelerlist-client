import { all, takeLatest, put, fork, call } from 'redux-saga/effects';
import {
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
} from '../../helpers/accounting_apis'

import actions from './actions'
import appActions from "../app/actions";
import { logError } from "../../helpers/utility";

export function* UploadTransactionReportRequest() {
  yield takeLatest('UPLOAD_TRANSACTION_REPORT', function* (payload) {
    const { file } = payload;
    try {
      const data = new FormData();
      data.append('source', file, file.name);

      const response = yield call(uploadTransactionReportAPI, data);
      if (response.status === 200 && response.data) {
        yield put(actions.uploadTransactionReportSuccess(response.data));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Upload Transaction Report api error"));
      logError(error, {
        tags: {
          exceptionType: "UPLOAD_TRANSACTION_REPORT_ERROR"
        }
      });
    }
  })
}

export function* GetStatusOfUploadingTransactionReportRequest() {
  yield takeLatest('GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT', function* (payload) {
    const { processingJobUuid } = payload;
    try {
      const response = yield call(getStatusOfUploadingTransactionReportAPI, processingJobUuid);
      if (response.status === 200 && response.data) {
        let data = response.data;
          data.processingJobUuid = processingJobUuid;
        yield put(actions.getStatusOfUploadingTransactionReportSuccess(data));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Get Status Of Uploading Transaction Report api error"));
      logError(error, {
        tags: {
          exceptionType: "GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT"
        }
      });
    }
  })
}

export function* GetStatusOfReuploadingTransactionReportRequest() {
  yield takeLatest('GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT', function* (payload) {
    const { processingJobUuid } = payload;
    try {
      const response = yield call(getStatusOfUploadingTransactionReportAPI, processingJobUuid);
      if (response.status === 200 && response.data) {
        let data = response.data;
          data.processingJobUuid = processingJobUuid;
        yield put(actions.getStatusOfReuploadingTransactionReportSuccess(data));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Get Status Of Reuploading Transaction Report api error"));
      logError(error, {
        tags: {
          exceptionType: "GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT"
        }
      });
    }
  })
}

export function* GetGeneratedReportRequest() {
  yield takeLatest('GET_GENERATED_REPORT', function* (payload) {
    const { uuid } = payload;
    try {
      const response = yield call(getGeneratedReportAPI, uuid);
      if (response.status === 200 && response.data && response.data.report) {
        const data = JSON.parse(response.data.report)
        yield put(actions.getGeneratedReportSuccess(data));
      } else {
        console.log(response.data);
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Get Generated Report api error"));
      logError(error, {
        tags: {
          exceptionType: "GET_GENERATED_REPORT"
        }
      });
    }
  })
}

export function* GetAvailableReportsRequest() {
  yield takeLatest('GET_AVAILABLE_REPORTS', function* (payload) {
    const { page, page_size } = payload;
    try {
      yield put(actions.setAvailableReportsStatus(true));
      const response = yield call(getAvailableReportsAPI, page, page_size);

      if (response.status === 200 && !response.data.error) {
        yield put(actions.getAvailableReportsSuccess(response.data.report));
      } else {
        console.log(response.data);
        yield put(actions.setAvailableReportsStatus(false));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Get Available Reports api error"));
      yield put(actions.setAvailableReportsStatus(false));
      logError(error, {
        tags: {
          exceptionType: "GET_AVAILABLE_REPORTS"
        }
      });
    }
  })
}

export function* GetAvailableReportsByLinkRequest() {
  yield takeLatest('GET_AVAILABLE_REPORTS_BY_LINK', function* (payload) {
    const { link } = payload;
    try {
      yield put(actions.setAvailableReportsStatus(true));
      const response = yield call(getAvailableReportsByLinkAPI, link);

      if (response.status === 200 && !response.data.error) {
        yield put(actions.getAvailableReportsSuccess(response.data.report));
      } else {
        console.log(response.data);
        yield put(actions.setAvailableReportsStatus(false));
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Get Available Reports api error"));
      yield put(actions.setAvailableReportsStatus(false));
      logError(error, {
        tags: {
          exceptionType: "GET_AVAILABLE_REPORTS"
        }
      });
    }
  })
}

export function* ReuploadTransactionReportRequest() {
  yield takeLatest('REUPLOAD_TRANSACTION_REPORT', function* (payload) {
    const { id, fieldsData } = payload;
    try {
      yield put(actions.setRecalculateIsProcessing(true));
      const data = {
        generatedReportId: Number(id),
        fields: fieldsData || [],
      }
      const response = yield call(reuploadTransactionReportAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.reuploadTransactionReportSuccess(response.data));
      } else {
        yield put(actions.setRecalculateIsProcessing(false));
        if (response.data.error) {
          yield put(appActions.apiCallFailed(`Error! ${response.data.error}`));
        } else {
          yield put(appActions.apiCallFailed("Error! Reupload Transaction Report api error"));
        }
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Reupload Transaction Report api error"));
      yield put(actions.setRecalculateIsProcessing(false));
      logError(error, {
        tags: {
          exceptionType: "REUPLOAD_TRANSACTION_REPORT_ERROR"
        }
      });
    }
  })
}

export function* expenseCategoryAdd() {
  yield takeLatest('EXPENSE_ADD_CATEGORY', function* (payload) {
    const { data } = payload;
    try {
      const response = yield call(expenseCategoryAddAPI, data);
      if (response.status === 201 && !response.data.error) {
        yield put(actions.expenseAddCategorySuccess(response.data.category));
      } else {
        yield put(actions.expenseAddCategoryError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense add api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_ADD_CATEGORY_ERROR"
        }
      });
    }
  })
}

export function* expenseCategoriesLoad() {
  yield takeLatest('EXPENSE_LOAD_CATEGORIES', function* (payload) {
    try {
      const response = yield call(expenseCategoriesGetAPI);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expenseLoadCategoriesSuccess(response.data.categories));
      } else {
        yield put(actions.expenseLoadCategoriesError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense load categories api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_LOAD_CATEGORIES_ERROR"
        }
      });
    }
  })
}

export function* expenseCategoryDelete() {
  yield takeLatest('EXPENSE_DELETE_CATEGORY', function* (payload) {
    const { data } = payload;
    try {
      const response = yield call(expenseCategoryDeleteAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expenseDeleteCategorySuccess(data));
      } else {
        yield put(actions.expenseDeleteCategoryError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense delete api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_DELETE_CATEGORY_ERROR"
        }
      });
    }
  })
}

export function* expenseCategoryUpdate() {
  yield takeLatest('EXPENSE_UPDATE_CATEGORY', function* (payload) {
    const { data } = payload;
    try {
      const response = yield call(expenseCategoryUpdateAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expenseUpdateCategorySuccess(data));
      } else {
        yield put(actions.expenseUpdateCategoryError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense update api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_UPDATE_CATEGORY_ERROR"
        }
      });
    }
  })
}

export function* expenseLoad() {
  yield takeLatest('EXPENSE_LOAD', function* (payload) {
    try {
      const response = yield call(expenseGetAPI);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expenseLoadSuccess(response.data.expenses));
      } else {
        yield put(actions.expenseLoadError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense load api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_LOAD_ERROR"
        }
      });
    }
  })
}

export function* expenseAdd() {
  yield takeLatest('EXPENSE_ADD', function* (payload) {
	  const { data, calendarStart, calendarEnd } = payload;
    try {
      const response = yield call(expenseAddAPI, data);
      if (response.status === 201 && !response.data.error) {
        yield put(actions.expenseAddSuccess(response.data.expense));
		  yield put(actions.expensesGetDataForPeriod(
			{
				startDate: calendarStart,
				endDate: calendarEnd,
			}
		  ));
      } else {
        yield put(actions.expenseAddError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense add api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_ADD_ERROR"
        }
      });
    }
  })
}

export function* expenseDelete() {
  yield takeLatest('EXPENSE_DELETE', function* (payload) {
	  const { data, calendarStart, calendarEnd } = payload;
    try {
      const response = yield call(expenseDeleteAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expenseDeleteSuccess(data));
		  yield put(actions.expensesGetDataForPeriod(
			{
				startDate: calendarStart,
				endDate: calendarEnd,
			}
		  ));
      } else {
        yield put(actions.expenseDeleteError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense delete api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_DELETE_ERROR"
        }
      });
    }
  })
}

export function* expenseUpdate() {
  yield takeLatest('EXPENSE_UPDATE', function* (payload) {
	  const { data, calendarStart, calendarEnd } = payload;
    try {
      const response = yield call(expenseUpdateAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expenseUpdateSuccess(data));
		  yield put(actions.expensesGetDataForPeriod(
			{
				startDate: calendarStart,
				endDate: calendarEnd,
			}
		  ));
      } else {
        yield put(actions.expenseUpdateError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense update api error"));
      logError(error, {
        tags: {
          exceptionType: "EXPENSE_UPDATE_ERROR"
        }
      });
    }
  })
}

export function* expenseGetForPeriod() {
  yield takeLatest('GET_EXPENSE_FOR_PERIOD', function* (payload) {
    const { data } = payload;
    try {
      const response = yield call(expenseGetForPeriodAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expensesGetForPeriodSuccess(response.data.expenses));
      } else {
        yield put(actions.expensesGetForPeriodError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense period get api error"));
      logError(error, {
        tags: {
          exceptionType: "GET_EXPENSE_FOR_PERIOD_ERROR"
        }
      });
    }
  })
}

export function* expensesDataGetForPeriod() {
  yield takeLatest('GET_EXPENSES_DATA_FOR_PERIOD', function* (payload) {
    const { data } = payload;
    try {
      const response = yield call(expenseGetForPeriodAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.expensesGetDataForPeriodSuccess(response.data.expenses));
      } else {
        yield put(actions.expensesGetDataForPeriodError());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Expense data for period get api error"));
      logError(error, {
        tags: {
          exceptionType: "GET_EXPENSES_DATA_FOR_PERIOD_ERROR"
        }
      });
    }
  })
}

export function* deleteReport() {
  yield takeLatest('DELETE_REPORT', function* (payload) {
    const { data } = payload;
    try {
      const response = yield call(deleteReportAPI, data['id']);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.deleteReportSuccess(data));
      } else {
        yield put(actions.deleteReportFailed());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Delete report get api error"));
      logError(error, {
        tags: {
          exceptionType: "DELETE_REPORT_ERROR"
        }
      });
    }
  })
}

export function* updateReport() {
  yield takeLatest('UPDATE_REPORT', function* (payload) {
    const { data } = payload;
    try {
      const response = yield call(updateReportAPI, data);
      if (response.status === 200 && !response.data.error) {
        yield put(actions.updateReportSuccess(data));
      } else {
        yield put(actions.updateReportFailed());
      }
    } catch (error) {
      yield put(appActions.apiCallFailed("Error! Update report get api error"));
      logError(error, {
        tags: {
          exceptionType: "UPDATE_REPORT_ERROR"
        }
      });
    }
  })
}

export default function* rootSaga() {
    yield all([
        fork(UploadTransactionReportRequest),
        fork(GetStatusOfUploadingTransactionReportRequest),
        fork(GetStatusOfReuploadingTransactionReportRequest),
        fork(GetGeneratedReportRequest),
        fork(GetAvailableReportsRequest),
        fork(GetAvailableReportsByLinkRequest),
        fork(ReuploadTransactionReportRequest),
		fork(expenseCategoryAdd),
		fork(expenseCategoriesLoad),
		fork(expenseCategoryDelete),
		fork(expenseCategoryUpdate),
		fork(expenseLoad),
		fork(expenseAdd),
		fork(expenseDelete),
		fork(expenseUpdate),
		fork(expenseGetForPeriod),
		fork(expensesDataGetForPeriod),
		fork(updateReport),
		fork(deleteReport),
    ])
}
