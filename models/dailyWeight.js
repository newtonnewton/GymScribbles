let mongoose = require("mongoose");

let dailyWeightSchema = mongoose.Schema({
	date: String,
	weight: Number
});

module.exports = mongoose.model("DailyWeight", dailyWeightSchema);