import moment from "moment";

let now = moment.utc()
let thirtyDaysAgo = now.clone().subtract(30, 'day');
let ninetyDaysAgo = now.clone().subtract(90, 'day');
let thisWeek = moment().local().startOf('week');
let thisMonth = moment().local().startOf('month');
// let thisYear = moment().local().startOf('year');

export let configuration = [
  {
    stat: "asp",
    key: "asp",
    metricName: "ASP",
    tooltipText: "Last 30 days average sales price.",
    minTimestamp: thirtyDaysAgo.toISOString(),
    maxTimestamp: now.toISOString(),
    numberType: "currency"
  },
  {
    stat: "sales",
    key: "sales_this_week",
    metricName: "Sales This Week",
    tooltipText: "Number of units sold in the past week.",
    minTimestamp: thisWeek.toISOString(),
    maxTimestamp: now.toISOString(),
    numberType: "currency"
  },
  {
    stat: "sales",
    key: "sales_this_month",
    metricName: thisMonth.format("MMMM") + " Sales",
    tooltipText: "Sales for this month.",
    minTimestamp: thisMonth.toISOString(),
    maxTimestamp: now.toISOString(),
    numberType: "currency"
  },
  {
    stat: "units_sold",
    key: "units_sold_this_month",
    metricName:  thisMonth.format("MMMM") + " Units Sold",
    tooltipText: "Units of inventory sold this month.",
    minTimestamp: thisMonth.toISOString(),
    maxTimestamp: now.toISOString(),
    numberType: "decimal"
  },
  /*
  {
    stat: "sales",
    key: "sales_this_year",
    metricName: "YTD Sales",
    tooltipText: "Your sales made on Amazon's marketplace so far this year.",
    minTimestamp: thisYear.toISOString(),
    maxTimestamp: now.toISOString(),
    numberType: "currency"
  },
  */
  {
    stat: "current_inventory",
    key: "current_inventory",
    metricName: "Active Inventory",
    tooltipText: "Current active inventory items available for purchase on Amazon's marketplace.",
    minTimestamp: now.toISOString(),
    maxTimestamp: now.toISOString(),
    className: "box-blue",
    numberType: "decimal"
  },
  {
    stat: "sell_through",
    key: "sell_through",
    metricName: "Last 90 Days Sell Through",
    tooltipText: "Sell Through Rate for the last 90 days.",
    minTimestamp: ninetyDaysAgo.toISOString(),
    maxTimestamp: now.toISOString(),
    className: "box-blue",
    numberType: "percent"
  },
  {
    stat: "unit_listed",
    key: "unit_listed_this_month",
    metricName: "Units Listed in " + thisMonth.format("MMMM"),
    tooltipText: "Units lasted this month.",
    minTimestamp: thisMonth.toISOString(),
    maxTimestamp: now.toISOString(),
    className: "box-blue",
    numberType: "decimal"
  },
  {
    stat: "average_sales_rank",
    key: "average_sales_rank_this_month",
    metricName: "Avg. Salesrank In " + thisMonth.format("MMMM"),
    tooltipText: "Avg. salesrank of new items listed through AccelerList this month.",
    minTimestamp: thisMonth.toISOString(),
    maxTimestamp: now.toISOString(),
    className: "box-blue",
    numberType: "decimal"
  },
]
