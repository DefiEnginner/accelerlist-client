import { client } from "./apiConfig";

function getDashboardDataAPI(data) {
	let {
		stat,
		minTimestamp,
		maxTimestamp
	} = data;
	return client
		.get("/api/v1/dashboard/data"
			+ "?stat=" + encodeURIComponent(stat)
			+ "&minTimestamp=" + encodeURIComponent(minTimestamp)
			+ "&maxTimestamp=" + encodeURIComponent(maxTimestamp)
		).then(response => {
			return response;
		})
		.catch(err => {
			throw err;
		});
}

function getDashboardSalesExpensesAPI() {
	return client
		.get("/api/v1/dashboard/sales")
		.then(response => {
			return response;
		})
		.catch(err => {
			throw err;
		});
}

export {
	getDashboardDataAPI,
	getDashboardSalesExpensesAPI,
};
