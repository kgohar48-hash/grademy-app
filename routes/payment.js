var express     = require("express");
var router      = express.Router();
var middelware  = require("../middelware");
var Feedback		 	= require("../models/feedback");
var User        = require("../models/user");

//plan
router.get("/user/plan",function(req,res){
    res.render("user/plans/plan")
})
//payment route
router.get("/payment" ,middelware.isLoggedIn , function(req,res){
	Feedback.find({},function(err,allFeedbacks){
		if(err){
			console.log(err)
			res.redirect("/dashboard")
		}else{
			var feedbackToSend = []
			var num = allFeedbacks.length - 1
			for(var i = 0 ; 10 >=i ; i++){
				if(i == 10 ){
					res.render("user/plans/payment" , {feedbacks : feedbackToSend })
				}else{
                    feedbackToSend.push(allFeedbacks[num - i ])
                }
			}
		}
	})
})


module.exports = router ;