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

let weightRoutes = require("./routes/weight");
let indexRoutes   = require("./routes/index");


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

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});
app.use(express.static(__dirname + '/public'));
app.use(indexRoutes);
app.use("/weight", weightRoutes);

app.listen(process.env.PORT|| 3000, process.env.IP, function(){
	console.log("The server has launched!");
});