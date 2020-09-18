let express = require('express');
let app = express();
let mongoose = require('mongoose');
let bodyParser = require('body-parser');
let DailyWeight = require('./models/dailyWeight');
let WeightHistory = require('./models/weightHistory');
let seedDB = require('./models/seeds');
mongoose.connect('mongodb://localhost:27017/db_name', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to DB!'))
.catch(error => console.log(error.message));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
seedDB();

let infoSchema = new mongoose.Schema({
	name: String,
	dates: [String],
	figures: [Number]
});

let Entry = mongoose.model("Entry", infoSchema);
Entry.create({
	name: 'Niudun',
	dates: ['Sep-1', 'Sep-5', 'Sep-9', 'Sep-13', 'Sep-17'],
	figures: [80, 83, 85, 90, 91]
});

app.get("/", function(req, res){
	res.render("landing");
});
//show the plot
app.get("/plot", function(req, res){	
	Entry.findOne({name: 'Niudun'}, function(err, entries){
		if(err)
			console.log("error");
		else res.render("plot", {entries: entries});
	});
});

app.get("/weight", function(req, res){
	const name = {name: 'Niudun Wang'};
	WeightHistory.findOne(name).populate("records").exec(function(err, history){
		if(err)
			console.log(err);
		else res.render("weight", {history: history});
	});
});

app.post("/weight/single", function(req, res){
	const name = {name: 'Niudun Wang'};
	const record = {date: req.body.date, weight: req.body.weight};
	WeightHistory.findOne(name, function(err, history){
		if(err)
			console.log(err);
		else {
			DailyWeight.create(record, function(err, dw){
				if(err)
					console.log(err);
				else{
					history.records.push(dw);
					history.save();
				}
			});
			res.redirect("/weight");
		}
	});
});

//update the plot
app.post("/plot", function(req, res){
	const name = {name: 'Niudun'};
	const figure = req.body.entry.figure;
	const date = req.body.entry.date;
	console.log("figure:" + figure);
	console.log("date: " + date);
	Entry.updateOne(name, {$push: {figures: [figure], dates: [date]}}, function(err, raw){
		if(err)
			console.log("error");
		else res.redirect("/plot");
	});
});

app.listen(process.env.PORT|| 3000, process.env.IP, function(){
	console.log("The server has launched!");
});