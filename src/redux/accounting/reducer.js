import {
  Map
} from 'immutable/dist/immutable'
import actions from './actions'
import moment from 'moment';

const initState = new Map({
  uploadFileStatus: null,
  reuploadFileStatus: null,
  batchUploadJobStatus: null,
  batchReuploadJobStatus: null,
  availableReportsStatus: null,
  generatedReport: null,
  availableReports: null,
  missingInfoData: [],
  reuploadByInventoryItems: null,
  recalculateIsProcessing: null,
	expenseCategories: [],
	expenseData: [],
	miscExpensesForPeriod: 0,
	expensesCalendarData: [{"highlighted-expense-date": []}],
})

export default function statsReducer(state = initState, action) {
  switch (action.type) {
    case actions.UPLOAD_TRANSACTION_REPORT_SUCCESS:
      return state
        .set('uploadFileStatus', action.data);

    case actions.REUPLOAD_TRANSACTION_REPORT_SUCCESS:
      return state
        .set('reuploadFileStatus', action.data);

    case actions.GET_STATUS_OF_UPLOADING_TRANSACTION_REPORT_SUCCESS:
      return state
        .set('batchUploadJobStatus', action.processingJobUuidData);

    case actions.GET_STATUS_OF_REUPLOADING_TRANSACTION_REPORT_SUCCESS:
      return state
        .set('batchReuploadJobStatus', action.processingJobUuidData);

    case actions.GET_GENERATED_REPORT_SUCCESS:
      return state
        .set('generatedReport', action.reportData);

    case actions.GET_AVAILABLE_REPORTS_SUCCESS:
      return state
        .set('availableReports', action.data)
        .set('availableReportsStatus', false);

    case actions.CLEAR_UPLOADED_TRANSACTION_REPORT_DATA:
      return initState;

    case actions.CLEAR_UPLOAD_REPORT_JOB_DATA:
    return state
      .set('batchUploadJobStatus', initState.batchUploadJobStatus)
      .set('uploadFileStatus', initState.uploadFileStatus);

    case actions.SET_AVAILABLE_REPORTS_STATUS:
      return state
        .set('availableReportsStatus', action.status);

    case actions.ADD_MISSING_INFO_DATA:
      const data = action.data;
      return state
        .update('missingInfoData', (missingInfoData) => {
            let emptyFields = null;
            Object.keys(data).forEach(el => {
              if (!data[el] || data[el] === null) {
                emptyFields = el;
              };
            })

            const index = missingInfoData.findIndex(missingInfo => {
                return missingInfo.sku === data.sku;
            });

            let missingInfoDataArray = [...missingInfoData];
            if (emptyFields) {
              if (index > -1) {
                return [
                  ...missingInfoDataArray.slice(0, index),
                  ...missingInfoDataArray.slice(index + 1)
              ];
              } else {
                return [...missingInfoDataArray];
              }
            } else {
              if (index > -1) {
                missingInfoDataArray[index] = Object.assign({}, data);
                return [...missingInfoDataArray];
              } else {
                missingInfoDataArray.push(data);
                return [...missingInfoDataArray];
              }
            }
        });

    case actions.SET_REUPLOAD_TRANSACTION_REPORT_BY_INVENTORY_ITEMS:
      return state
        .set('reuploadByInventoryItems', action.status);

    case actions.SET_RECALCULATE_IS_PROCESSING:
      const status = action.status;
      if (status) {
        return state
          .set('recalculateIsProcessing', action.status);
      } else
        return state
          .set('recalculateIsProcessing', action.status)
          .set('reuploadByInventoryItems', action.status);

	case actions.EXPENSE_ADD_CATEGORY_SUCCESS:
		let expenseCategories = state.get("expenseCategories").slice();
		expenseCategories.push({name: action.data.name, id: action.data.id});
		return state
			.set("expenseCategories", expenseCategories)

	case actions.EXPENSE_LOAD_CATEGORIES_SUCCESS:
		return state
			.set("expenseCategories", action.data)

	case actions.EXPENSE_LOAD_CATEGORIES_ERROR:
		return state
			.set("expenseCategories", [])

	case actions.EXPENSE_DELETE_CATEGORY_SUCCESS:
		let delExpenseCategories = state.get("expenseCategories").slice();
		let delExpenseDataCategories = state.get("expenseData").slice();
		const newExpenses = delExpenseCategories.filter(item => item.id !== action.data.id);
		const newExpenseDataDelete = delExpenseDataCategories.filter(
			item => item.category_id !== action.data.id);
		return state
			.set("expenseCategories", newExpenses)
			.set("expenseData", newExpenseDataDelete)

	case actions.EXPENSE_UPDATE_CATEGORY_SUCCESS:
		let updateExpenseCategories = state.get("expenseCategories").slice();
		const updateNewExpenses = updateExpenseCategories.map(item => {
				if(item.id !== action.data.id){
					return item;
				} else {
					return action.data;
				}
			});
		return state
			.set("expenseCategories", updateNewExpenses)

	case actions.EXPENSE_LOAD_SUCCESS:
		return state
			.set("expenseData", action.data)

	case actions.EXPENSE_LOAD_ERROR:
		return state
			.set("expenseData", [])

	case actions.EXPENSE_ADD_SUCCESS:
		let expenseData = state.get("expenseData").slice();
		expenseData.push(action.data);
		return state
			.set("expenseData", expenseData)

	case actions.EXPENSE_DELETE_SUCCESS:
		let delExpenseData = state.get("expenseData").slice();
		const delNewExpenseData = delExpenseData.filter(
			item => item.id !== action.data.id);
		return state
			.set("expenseData", delNewExpenseData)

	case actions.EXPENSE_UPDATE_SUCCESS:
		let updateExpenses = state.get("expenseData").slice();
		const updateNewExpensesUpdate = updateExpenses.map(item => {
				if(item.id !== action.data.id){
					return item;
				} else {
					return action.data;
				}
			});
		return state
			.set("expenseData", updateNewExpensesUpdate)

	case actions.GET_EXPENSE_FOR_PERIOD:
		return state
			.set("miscExpensesForPeriod", 0)

	case actions.GET_EXPENSE_FOR_PERIOD_SUCCESS:
		const expInPeriod = action.data;
		let expInPeriodSum = 0;
		expInPeriod.forEach(exp => {
			expInPeriodSum = expInPeriodSum + exp.amount;
		});
		return state
			  .set("miscExpensesForPeriod", expInPeriodSum)

	case actions.GET_EXPENSE_FOR_PERIOD_ERROR:
		return state
			.set("miscExpensesForPeriod", 0)

	  case actions.GET_EXPENSES_DATA_FOR_PERIOD_SUCCESS:
		  const expenseDates = [{"highlighted-expense-date": []}];
		  action.data.forEach((d) => {
			expenseDates[0]["highlighted-expense-date"].push(
				moment(d.date_incurred)
			);
		  });
		  return state
			.set("expensesCalendarData", expenseDates)

	  case actions.UPDATE_REPORT_SUCCESS:
		  var availableReportsUpdate = state.get('availableReports');
		  availableReportsUpdate.results.forEach(item => {
			  if(item.id === action.data.generatedReportId){
				if(action.data.name){
					item.name = action.data.name;
				}
			  }
		  });
		  return state
			  .set('availableReports', Object.assign({}, availableReportsUpdate))

	  case actions.DELETE_REPORT_SUCCESS:
		  var availableReportsDelete = state.get('availableReports');
		  const filterResults = availableReportsDelete.results.filter(item => item.id !== action.data.id);
		  availableReportsDelete.results = filterResults;
		  return state
			  .set('availableReports', Object.assign({}, availableReportsDelete))

    default:
      return state
  }
}
