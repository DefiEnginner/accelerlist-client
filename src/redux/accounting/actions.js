const accountingActions = {

  UPLOAD_TRANSACTION_REPORT: 'UPLOAD_TRANSACTION_REPORT',
  UPLOAD_TRANSACTION_REPORT_SUCCESS: 'UPLOAD_TRANSACTION_REPORT_SUCCESS',
  UPLOAD_TRANSACTION_REPORT_ERROR: "UPLOAD_TRANSACTION_REPORT_ERROR",

  GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT: 'GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT',
  GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT_SUCCESS: 'GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT_SUCCESS',

  GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT: "GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT",
  GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT_SUCCESS: "GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT_SUCCESS",

  GET_GENERATED_REPORT: 'GET_GENERATED_REPORT',
  GET_GENERATED_REPORT_SUCCESS: 'GET_GENERATED_REPORT_SUCCESS',

  GET_AVAILABLE_REPORTS: 'GET_AVAILABLE_REPORTS',
  GET_AVAILABLE_REPORTS_BY_LINK: 'GET_AVAILABLE_REPORTS_BY_LINK',
  GET_AVAILABLE_REPORTS_SUCCESS: 'GET_AVAILABLE_REPORTS_SUCCESS',

  CLEAR_UPLOADED_TRANSACTION_REPORT_DATA: 'CLEAR_UPLOADED_TRANSACTION_REPORT_DATA',
  CLEAR_UPLOAD_REPORT_JOB_DATA: 'CLEAR_UPLOAD_REPORT_JOB_DATA',

  SET_AVAILABLE_REPORTS_STATUS: 'SET_AVAILABLE_REPORTS_STATUS',

  ADD_MISSING_INFO_DATA: "ADD_MISSING_INFO_DATA",

  REUPLOAD_TRANSACTION_REPORT: "REUPLOAD_TRANSACTION_REPORT",
  REUPLOAD_TRANSACTION_REPORT_ERROR: "REUPLOAD_TRANSACTION_REPORT_ERROR",
  REUPLOAD_TRANSACTION_REPORT_SUCCESS: "REUPLOAD_TRANSACTION_REPORT_SUCCESS",

  SET_REUPLOAD_TRANSACTION_REPORT_BY_INVENTORY_ITEMS: "SET_REUPLOAD_TRANSACTION_REPORT_BY_INVENTORY_ITEMS",
  SET_RECALCULATE_IS_PROCESSING: "SET_RECALCULATE_IS_PROCESSING",

	EXPENSE_ADD_CATEGORY: "EXPENSE_ADD_CATEGORY",
	EXPENSE_ADD_CATEGORY_SUCCESS: "EXPENSE_ADD_CATEGORY_SUCCESS",
	EXPENSE_ADD_CATEGORY_ERROR: "EXPENSE_ADD_CATEGORY_ERROR",

	EXPENSE_LOAD_CATEGORIES: "EXPENSE_LOAD_CATEGORIES",
	EXPENSE_LOAD_CATEGORIES_SUCCESS: "EXPENSE_LOAD_CATEGORIES_SUCCESS",
	EXPENSE_LOAD_CATEGORIES_ERROR: "EXPENSE_LOAD_CATEGORIES_ERROR",

	EXPENSE_DELETE_CATEGORY: "EXPENSE_DELETE_CATEGORY",
	EXPENSE_DELETE_CATEGORY_SUCCESS: "EXPENSE_DELETE_CATEGORY_SUCCESS",
	EXPENSE_DELETE_CATEGORY_ERROR: "EXPENSE_DELETE_CATEGORY_ERROR",

	EXPENSE_UPDATE_CATEGORY: "EXPENSE_UPDATE_CATEGORY",
	EXPENSE_UPDATE_CATEGORY_SUCCESS: "EXPENSE_UPDATE_CATEGORY_SUCCESS",
	EXPENSE_UPDATE_CATEGORY_ERROR: "EXPENSE_UPDATE_CATEGORY_ERROR",

	EXPENSE_LOAD: "EXPENSE_LOAD",
	EXPENSE_LOAD_SUCCESS: "EXPENSE_LOAD_SUCCESS",
	EXPENSE_LOAD_ERROR: "EXPENSE_LOAD_ERROR",

	EXPENSE_ADD: "EXPENSE_ADD",
	EXPENSE_ADD_SUCCESS: "EXPENSE_ADD_SUCCES",
	EXPENSE_ADD_ERROR: "EXPENSE_ADD_ERROR",

	EXPENSE_DELETE: "EXPENSE_DELETE",
	EXPENSE_DELETE_SUCCESS: "EXPENSE_DELETE_SUCCESS",
	EXPENSE_DELETE_ERROR: "EXPENSE_DELETE_ERROR",

	EXPENSE_UPDATE: "EXPENSE_UPDATE",
	EXPENSE_UPDATE_SUCCESS: "EXPENSE_UPDATE_SUCCESS",
	EXPENSE_UPDATE_ERROR: "EXPENSE_UPDATE_ERROR",

	GET_EXPENSE_FOR_PERIOD: 'GET_EXPENSE_FOR_PERIOD',
	GET_EXPENSE_FOR_PERIOD_SUCCESS: 'GET_EXPENSE_FOR_PERIOD_SUCCESS',
	GET_EXPENSE_FOR_PERIOD_ERROR: 'GET_EXPENSE_FOR_PERIOD_ERROR',

	GET_EXPENSES_DATA_FOR_PERIOD: 'GET_EXPENSES_DATA_FOR_PERIOD',
	GET_EXPENSES_DATA_FOR_PERIOD_SUCCESS: 'GET_EXPENSES_DATA_FOR_PERIOD_SUCCESS',
	GET_EXPENSES_DATA_FOR_PERIOD_ERROR: 'GET_EXPENSES_DATA_FOR_PERIOD_ERROR',

	UPDATE_REPORT: 'UPDATE_REPORT',
	UPDATE_REPORT_SUCCESS: 'UPDATE_REPORT_SUCCESS',
	UPDATE_REPORT_FAILED: 'UPDATE_REPORT_FAILED',

	DELETE_REPORT: 'DELETE_REPORT',
	DELETE_REPORT_SUCCESS: 'DELETE_REPORT_SUCCESS',
	DELETE_REPORT_FAILED: 'DELETE_REPORT_FAILED',

	updateReport: (data) => ({
		type: accountingActions.UPDATE_REPORT,
		data,
	}),
	updateReportSuccess: (data) => ({
		type: accountingActions.UPDATE_REPORT_SUCCESS,
		data,
	}),
	updateReportFailed: (data) => ({
		type: accountingActions.UPDATE_REPORT_FAILED,
		data,
	}),
	deleteReport: (data) => ({
		type: accountingActions.DELETE_REPORT,
		data,
	}),
	deleteReportSuccess: (data) => ({
		type: accountingActions.DELETE_REPORT_SUCCESS,
		data,
	}),
	deleteReportFailed: (data) => ({
		type: accountingActions.DELETE_REPORT_FAILED,
		data,
	}),

	expensesGetDataForPeriod: (data) => ({
		type: accountingActions.GET_EXPENSES_DATA_FOR_PERIOD,
		data
	}),
	expensesGetDataForPeriodSuccess: (data) => ({
		type: accountingActions.GET_EXPENSES_DATA_FOR_PERIOD_SUCCESS,
		data
	}),
	expensesGetDataForPeriodError: () => ({
		type: accountingActions.GET_EXPENSES_DATA_FOR_PERIOD_ERROR,
	}),

	expensesGetForPeriod: (data) => ({
		type: accountingActions.GET_EXPENSE_FOR_PERIOD,
		data
	}),
	expensesGetForPeriodSuccess: (data) => ({
		type: accountingActions.GET_EXPENSE_FOR_PERIOD_SUCCESS,
		data
	}),
	expensesGetForPeriodError: () => ({
		type: accountingActions.GET_EXPENSE_FOR_PERIOD_ERROR,
	}),

	expenseUpdate: (data, calendarStart, calendarEnd) => ({
		type: accountingActions.EXPENSE_UPDATE,
		data,
		calendarStart,
		calendarEnd,
	}),
	expenseUpdateSuccess: (data) => ({
		type: accountingActions.EXPENSE_UPDATE_SUCCESS,
		data
	}),
	expenseUpdateError: () => ({
		type: accountingActions.EXPENSE_UPDATE_ERROR,
	}),

	expenseDelete: (data, calendarStart, calendarEnd) => ({
		type: accountingActions.EXPENSE_DELETE,
		data,
		calendarStart,
		calendarEnd,
	}),
	expenseDeleteSuccess: (data) => ({
		type: accountingActions.EXPENSE_DELETE_SUCCESS,
		data
	}),
	expenseDeleteError: () => ({
		type: accountingActions.EXPENSE_DELETE_ERROR,
	}),

	expenseAdd: (data, calendarStart, calendarEnd) => ({
		type: accountingActions.EXPENSE_ADD,
		data,
		calendarStart,
		calendarEnd,
	}),
	expenseAddSuccess: (data) => ({
		type: accountingActions.EXPENSE_ADD_SUCCESS,
		data
	}),
	expenseAddError: () => ({
		type: accountingActions.EXPENSE_ADD_ERROR,
	}),

	expenseLoad: () => ({
		type: accountingActions.EXPENSE_LOAD,
	}),
	expenseLoadSuccess: (data) => ({
		type: accountingActions.EXPENSE_LOAD_SUCCESS,
		data
	}),
	expenseLoadError: () => ({
		type: accountingActions.EXPENSE_LOAD_ERROR,
	}),

	expenseUpdateCategory: (data) => ({
		type: accountingActions.EXPENSE_UPDATE_CATEGORY,
		data
	}),
	expenseUpdateCategorySuccess: (data) => ({
		type: accountingActions.EXPENSE_UPDATE_CATEGORY_SUCCESS,
		data
	}),
	expenseUpdateCategoryError: () => ({
		type: accountingActions.EXPENSE_UPDATE_CATEGORY_ERROR,
	}),

	expenseDeleteCategory: (data) => ({
		type: accountingActions.EXPENSE_DELETE_CATEGORY,
		data
	}),
	expenseDeleteCategorySuccess: (data) => ({
		type: accountingActions.EXPENSE_DELETE_CATEGORY_SUCCESS,
		data
	}),
	expenseDeleteCategoryError: () => ({
		type: accountingActions.EXPENSE_DELETE_CATEGORY_ERROR,
	}),

	expenseLoadCategories: () => ({
		type: accountingActions.EXPENSE_LOAD_CATEGORIES,
	}),
	expenseLoadCategoriesSuccess: (data) => ({
		type: accountingActions.EXPENSE_LOAD_CATEGORIES_SUCCESS,
		data
	}),
	expenseLoadCategoriesError: () => ({
		type: accountingActions.EXPENSE_LOAD_CATEGORIES_ERROR,
	}),

	expenseAddCategory: (data) => ({
		type: accountingActions.EXPENSE_ADD_CATEGORY,
		data
	}),
	expenseAddCategorySuccess: (data) => ({
		type: accountingActions.EXPENSE_ADD_CATEGORY_SUCCESS,
		data
	}),
	expenseAddCategoryError: () => ({
		type: accountingActions.EXPENSE_ADD_CATEGORY_ERROR,
	}),

  setAvailableReportsStatus: status => ({
    type: accountingActions.SET_AVAILABLE_REPORTS_STATUS,
    status
  }),

  getAvailableReports: (page, page_size) => ({
    type: accountingActions.GET_AVAILABLE_REPORTS,
    page,
    page_size
  }),

  getAvailableReportsByLink: link => ({
    type: accountingActions.GET_AVAILABLE_REPORTS_BY_LINK,
    link
  }),

  getAvailableReportsSuccess: data => ({
    type: accountingActions.GET_AVAILABLE_REPORTS_SUCCESS,
    data
  }),

  uploadTransactionReport: file => ({
    type: accountingActions.UPLOAD_TRANSACTION_REPORT,
    file
  }),

  uploadTransactionReportSuccess: data => ({
    type: accountingActions.UPLOAD_TRANSACTION_REPORT_SUCCESS,
    data
  }),

  getStatusOfUploadingTransactionReport: processingJobUuid => ({
    type: accountingActions.GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT,
    processingJobUuid
  }),

  getStatusOfUploadingTransactionReportSuccess: processingJobUuidData => ({
    type: accountingActions.GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT_SUCCESS,
    processingJobUuidData
  }),

  getStatusOfReuploadingTransactionReport: processingJobUuid => ({
    type: accountingActions.GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT,
    processingJobUuid
  }),

  getStatusOfReuploadingTransactionReportSuccess: processingJobUuidData => ({
    type: accountingActions.GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT_SUCCESS,
    processingJobUuidData
  }),

  getGeneratedReport: uuid => ({
    type: accountingActions.GET_GENERATED_REPORT,
    uuid
  }),

  getGeneratedReportSuccess: reportData => ({
    type: accountingActions.GET_GENERATED_REPORT_SUCCESS,
    reportData
  }),

  clearUploadedTransactionReportData: () => ({
    type: accountingActions.CLEAR_UPLOADED_TRANSACTION_REPORT_DATA,
  }),

  clearUploadReportJobData: () => ({
    type: accountingActions.CLEAR_UPLOAD_REPORT_JOB_DATA,
  }),

  addMissingInfoData: (data) => ({
    type: accountingActions.ADD_MISSING_INFO_DATA,
    data
  }),

  reuploadTransactionReport: (id, fieldsData) => ({
    type: accountingActions.REUPLOAD_TRANSACTION_REPORT,
    id,
    fieldsData
  }),

  reuploadTransactionReportSuccess: data => ({
    type: accountingActions.REUPLOAD_TRANSACTION_REPORT_SUCCESS,
    data
  }),

  setReuploadTransactionReportByInventoryItems: status => ({
    type: accountingActions.SET_REUPLOAD_TRANSACTION_REPORT_BY_INVENTORY_ITEMS,
    status
  }),

  setRecalculateIsProcessing: status => ({
    type: accountingActions.SET_RECALCULATE_IS_PROCESSING,
    status
  }),
}

export default accountingActions;
