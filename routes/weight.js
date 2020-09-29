let express = require("express");
let router  = express.Router();
let User    = require("../models/user");
let WeightHistory = require("../models/weightHistory");
let DailyWeight   = require("../models/dailyWeight");
let bodyParser = require('body-parser');

router.get("/", isLoggedIn, function(req, res){
	const name = {name: 'Niudun Wang'};
	const user_id = req.user._id;
	User.findById(user_id, function(err, user){
		if(err)
			console.log(err);
		else{
			if(typeof user.weight_history === "undefined")
				return res.render("weight", {history: null});
			WeightHistory.findById(user.weight_history).populate("records").exec(function(err, history){
				if(err)
					console.log(err);
				else {
					res.render("weight", {history: history});
				}
			});
		}
	});
});

router.post("/single", isLoggedIn, function(req, res){
	const name = {name: req.user.username, timeTracker: req.body.timeTracker, timeFrame: req.body.timeFrame};
	const record = {date: req.body.date, weight: req.body.weight};
	const user_id = req.user._id;
	User.findById(user_id, function(err, user){
		if(err)
			console.log(err);
		else {
			if(typeof user.weight_history === "undefined"){
				WeightHistory.create(name, function(err, history){
					if(err)
						console.log(err)
					else{
						user.weight_history = history;
						user.save();
					}
				});
			}
			DailyWeight.create(record, function(err, dw){
				if(err)
					console.log(err);
				else{
					
					WeightHistory.findById(user.weight_history, function(err, history){
						if(err)
							console.log(err);
						else {
							history.timeTracker = req.body.timeTracker;
							history.timeFrame = req.body.timeFrame;
							history.records.push(dw);
							history.save();
						}
					});
				}
			});
			res.redirect("/weight");
		}
	});
});

router.post("/single/:record_id", isLoggedIn, function(req, res){
	const name = {name: 'Niudun Wang'};
	const newRecord = {date: req.body.date, weight: req.body.weight};
	const user_id = req.user._id;
	DailyWeight.findByIdAndUpdate(req.params.record_id, newRecord, function(err, updatedRecord){
		if(err)
			console.log(err);
		else {
			User.findById(user_id, function(err, user){
				if(err)
					console.log(err);
				else {
					WeightHistory.findById(user.weight_history, function(err, history){
						if(err)
							console.log(err);
						else {
							history.timeTracker = req.body.timeTracker;
							history.timeFrame = req.body.timeFrame;
							history.save();
							res.redirect("/weight");
						}
					});
				}
			});
		}
	});
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;