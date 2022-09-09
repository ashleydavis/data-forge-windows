const moment = require("moment");
const dataForge = require("data-forge");
require("data-forge-fs");


let df = dataForge.readFileSync("data.json")
    .parseJSON()
    .transformSeries({
        date: v => new Date(v), // Parse date from integer.
    })
    .orderBy(row => row.date); // Make sure rows are in cronological order.

//
// Group the data into hourly buckets.
//
df = df.groupBy(row => moment(row.date).format("YYYY-MM-DD-HH")) // Result of groupBy is a series.
    .select(group => {
        return { // Transform each group you you want.
            date: group.first().date,
            groupKey: moment(group.first().date).format("YYYY-MM-DD-HH"),
            sum: group.getSeries("premium").sum(),
        };
    })
    .inflate(); // Convert to a dataframe.

const preview = df.take(100).toStrings({ date: "YYYY-MM-DD hh:mm:ss" });
console.log(preview.toString());
