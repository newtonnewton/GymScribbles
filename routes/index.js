let express = require("express");
let router  = express.Router();
let passport = require("passport");
let User = require("../models/user");
let bodyParser = require('body-parser');

router.get("/", function(req, res){
	
	
	res.render("landing");
});
//==================
//====AUTH ROUTES===
//==================
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
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

router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", 
	{successRedirect: "/",
	 failureRedirect: "/login"}), function(res, req){
	
});
router.get("/logout", function(req, res){
	req.logout();
	res.redirect("/");
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}

module.exports = router;