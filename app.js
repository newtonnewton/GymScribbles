let express = require('express');
let app = express();
let mongoose = require('mongoose');
let passport = require('passport');
let LocalStrategy = require('passport-local');
let bodyParser = require('body-parser');
let DailyWeight = require('./models/dailyWeight');
let WeightHistory = require('./models/weightHistory');
let User   = require('./models/user');
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
// seedDB();

//PASSPORT CONGIF
app.use(require('express-session')({
	secret: "Ihora best girl",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

app.get("/weight", isLoggedIn, function(req, res){
	const name = {name: 'Niudun Wang'};
	WeightHistory.findOne(name).populate("records").exec(function(err, history){
		if(err)
			console.log(err);
		else res.render("weight", {history: history});
	});
});

// app.get("weight/updated", function(req, res){
	
// });

app.post("/weight/single", isLoggedIn, function(req, res){
	const name = {name: 'Niudun Wang'};
	const record = {date: req.body.date, weight: req.body.weight};
	// const trackerParam = [];
	WeightHistory.findOne(name, function(err, history){
		if(err)
			console.log(err);
		else {
			DailyWeight.create(record, function(err, dw){
				if(err)
					console.log(err);
				else{
					history.timeTracker = req.body.timeTracker;
					history.timeFrame = req.body.timeFrame;
					history.records.push(dw);
					history.save();
				}
			});
			res.redirect("/weight");
		}
	});
});

app.post("/weight/single/:record_id", isLoggedIn, function(req, res){
	const name = {name: 'Niudun Wang'};
	const newRecord = {date: req.body.date, weight: req.body.weight};
	DailyWeight.findByIdAndUpdate(req.params.record_id, newRecord, function(err, updatedRecord){
		if(err)
			console.log(err);
		else {
			WeightHistory.findOne(name, function(err, history){
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

//==================
//====AUTH ROUTES===
//==================
app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	const newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user){
		if(err){
			console.log(err);
			return res.render("register");
		} 
		passport.authenticate("local")(req, res, function(){
			res.redirect("/");
		});
	});
});

app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", 
	{successRedirect: "/",
	 failureRedirect: "/login"}), function(res, req){
	
});

app.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

app.listen(process.env.PORT|| 3000, process.env.IP, function(){
	console.log("The server has launched!");
});