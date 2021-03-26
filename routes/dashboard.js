var express = require("express");
var router  = express.Router();
var User	= require("../models/user");
var middelware = require("../middelware");

// ===========================================================
// Dashboard
// ===========================================================
router.get("/dashboard",middelware.isLoggedIn , function(req,res){
	res.render("dashboard/index" ) 
})

router.get("/aboutdashboard", function(req,res){
	res.render("dashboard/aboutdashboard")
})

router.post("/dashboard/quiz/score",function(req,res){
	res.render("dashboard/quiz/score" , req.body)
})

module.exports = router ;