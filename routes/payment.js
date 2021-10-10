var express     = require("express");
var router      = express.Router();
var middelware  = require("../middelware");
var Feedback	= require("../models/feedback");
var User        = require("../models/user");
var Mcq			= require("../models/mcq")
var Tid			= require("../models/tid")
var Transaction	= require("../models/transaction")
var Promo		= require("../models/promo")
//plan
router.get("/user/plan",function(req,res){
	Mcq.countDocuments({},(err,count)=>{
		if(err || !count){
			console.log(err)
		}else{
			res.render("user/plans/plan",{MCQcount : count})
		}
	})
    
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
				if(i == 10 || i >= num){
					res.render("user/plans/payment" , {feedbacks : feedbackToSend })
				}else{
                    feedbackToSend.push(allFeedbacks[num - i ])
                }
			}
		}
	})
})
// route to add TID by admin
router.post("/payment/tid/add",middelware.isLoggedIn, middelware.isAdmin, (req,res)=>{
	Tid.create({
		amount : req.body.amount,
		TID : req.body.tid
	},(err,tidCreated)=>{
		if(err || !tidCreated){
			console.log(err)
		}else{
			req.flash("success","TID : "+tidCreated.TID+" with amount : "+tidCreated.amount+" created")
			res.redirect("/user/controls")
		}
	})
})
// route for user to add TID
router.post("/payment/tid/students",middelware.isLoggedIn,(req,res)=>{
	User.findOne({username : "grademy"},(err,foundGrademy)=>{
		if(err || !foundGrademy){
			console.log(err)
		}else{
			Tid.findOne({TID : req.body.tid},(err, tidFound)=>{
				if(err || !tidFound){
					if(err){
						console.log(err)
					}
					if(!tidFound){
						Transaction.create({
							amount : 0,
							TID : req.body.tid,
							statement : "Account recharged",
							from : {
								id : foundGrademy._id,
								username : foundGrademy.username
							},
							to : {
								id : req.user._id,
								username : req.user.username
							}
						}, (err, Transactioncreated)=>{
							if(err){
								console.log(err)
							}else{
								foundGrademy.transactions.push(Transactioncreated)
								foundGrademy.save()
								User.findById( req.user._id , (err , foundUser)=>{
									if(err || !foundUser){
										console.log(err)
										req.flash("err","an error accorded, please contact admin at +92 313 0157543")
										res.redirect("/user/plan")
									}else{
										foundUser.transactions.push(Transactioncreated)
										foundUser.save()
										req.flash("success","Your TID has been recieved, please wait 15 mint to get it varified")
										res.redirect("/user/plan")
									}
								})
							}
						})
					}
				}else{
					Transaction.create({
						amount : tidFound.amount,
						TID : req.body.tid,
						statement : "Account recharged",
						varified : true,
						from : {
							id : foundGrademy._id,
							username : foundGrademy.username
						},
						to : {
							id : req.user._id,
							username : req.user.username
						}
					}, (err, Transactioncreated)=>{
						if(err){
							console.log(err)
						}else{
							tidFound.used = true
							tidFound.save()
							foundGrademy.transactions.push(Transactioncreated)
							foundGrademy.save()
							User.findById( req.user._id , (err , foundUser)=>{
								if(err || !foundUser){
									console.log(err)
									req.flash("err","an error accorded, please contact admin at +92 313 0157543")
									res.redirect("/user/plan")
								}else{
									foundUser.transactions.push(Transactioncreated)
									foundUser.save()
									req.flash("success","Your TID : "+req.body.tid+" has been confirmed, Rs."+tidFound.amount+" has been added to your account")
									res.redirect("/user/plan")
								}
							})
						}
					})
				}
			})
		}
	})
})
//generate prmo code
router.post("/payment/promo/create",middelware.isLoggedIn, middelware.isAdmin,function(req,res){
    var promoObj = {
        title : req.body.title ,
        usageLimit : req.body.usageLimit,
        value : req.body.value ,
        usedBy : []
    }
    Promo.create(promoObj , function(err , promo){
        if(err){
            console.log(err)
            res.redirect("/dashboard")
        }else{
            req.flash("succuss" ,promo.title+ " has been made")
            res.redirect("/user/controls")
        }
    })
})
// fetch user trancsactions
router.get("/payment/transactions",(req,res)=>{
	User.findById(req.user._id).populate({
		path : 'transactions',
		model : "Transaction"
	}).exec((err,foundUser)=>{
		if(err || !foundUser){
			console.log(err)
		}else{
			res.json(foundUser)
		}
	})
})


module.exports = router ;