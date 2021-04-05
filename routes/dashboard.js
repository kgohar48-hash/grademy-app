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
	User.findOne({username : req.body.ownerId} ,(err , foundUser)=>{
		if(err || !foundUser){
			console.log(err)
		}else{
			console.log("yo")
			if(foundUser.isAcademy){
				console.log("academy is")
				res.render("dashboard/quiz/score" , { data : req.body , isAcademy : true})
			}else{
				console.log("not academy")
				res.render("dashboard/quiz/score" , { data : req.body , isAcademy : false})
			}
		}
	})
})

module.exports = router ;