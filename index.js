const dataForge = require("data-forge");
require("data-forge-fs");

const df = dataForge.readFileSync("data.json").parseJSON();

// Here is where I would window the data and add the runnong sum of the premium column as a new column
// But I've no idea how that would work
// So, for this repo I'm just doing s standard rolling window here cribbed from the example
const windows = df.rollingWindow(50);
const newCol = windows
	.select((window, windowIndex) => {
		return [windowIndex, window.getSeries("premium").sum()];
	})
	.withIndex((pair) => pair[0])
	.select((pair) => pair[1]);

console.log(newCol.tail(10).toString());
