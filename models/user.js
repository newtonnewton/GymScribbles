let mongoose = require('mongoose');
let WeightHistory = require('./weightHistory');
let passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	weight_history: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "WeightHistory"
	}
});
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);