let mongoose = require('mongoose');
let DailyWeight = require('./dailyWeight');

let weightHistorySchema = new mongoose.Schema({
	name: String,
	timeTracker: String,
	timeFrame: String,
	records:[{
		type: mongoose.Schema.Types.ObjectId,
		ref: "DailyWeight"
	}]
});

module.exports = mongoose.model("WeightHistory", weightHistorySchema);