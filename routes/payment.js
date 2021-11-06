var express     = require("express");
var router      = express.Router();
var middelware  = require("../middelware");
var Feedback	= require("../models/feedback");
var User        = require("../models/user");
var Mcq			= require("../models/mcq")
var Tid			= require("../models/tid")
var Transaction	= require("../models/transaction")
var Promo		= require("../models/promo");
const { model } = require("mongoose");
//plan
router.get("/user/plan",middelware.isLoggedIn,function(req,res){
	Mcq.countDocuments({},(err,count)=>{
		if(err || !count){
			console.log(err)
		}else{
			User.find({ref : req.user.username}, (err, foundUsers)=>{
				if(err || !foundUsers){
					console.log(err)
				}else{
					res.render("user/plans/plan",{MCQcount : count, invitees : foundUsers.length})
				}
			})
		}
	})
    
})
//payment route
router.get("/payment/plan/:plan" ,middelware.isLoggedIn , function(req,res){
	if(req.user.isPaid || req.user.isPaidPlus){
		req.flash("error",`You have already purchased ${req.params.plan} plan`)
		res.redirect("/user/plan")
	}else{
		Feedback.find({},function(err,allFeedbacks){
			if(err){
				console.log(err)
				res.redirect("/dashboard")
			}else{
				var feedbackToSend = []
				var num = allFeedbacks.length - 1
				for(var i = 0 ; 10 >= i ; i++){
					if(i == 10 || i >= num){
						res.render("user/plans/payment" , {feedbacks : feedbackToSend, plan : req.params.plan })
						return
					}else{
						feedbackToSend.push(allFeedbacks[num - i ])
					}
				}
			}
		})
	}
})
// receive payment route
router.get("/payment/paid/:plan",middelware.isLoggedIn ,(req,res)=>{
	console.log("yo")
	var amountIn = 0
	var amountOut = 0
	if(req.params.plan == "Premium"){
		var totalBill = 1000
	}else{
		var totalBill = 1500
	}
	User.findById(req.user._id).populate({
		path : 'transactions',
		model : "Transaction"
	}).exec(async(err, foundUser)=>{
		if(err || !foundUser){
			console.log(err)
			req.flash("error","Something went wrong !! please contact admin at +92 313 0157543")
			res.redirect("/payment/plan/"+req.params.plan)
		}else{
			for(var i =0 ;foundUser.transactions.length >= i ; i++){
				if(foundUser.transactions.length == i){
					// terminate
					if(totalBill <= amountIn - amountOut){
						await trasanctionCreate(totalBill,req.params.plan+" plan purchased",true,false,Math.floor((Math.random() * 10000000000) + 1),"grademy",req.user.username)
						if(req.params.plan == "Premium"){
							foundUser.isPaid = true
						}else{
							foundUser.isPaidPlus = true
						}
						foundUser.save()
						// commission to the person who refered his user
						if(amountOut == 0){
							await User.findOne({username : foundUser.ref},async(err , foundRef)=>{
								if(err || !foundRef){
									if(err){
										console.log(err)
									}
									if(!foundRef){
										await trasanctionCreate((totalBill*0.5).toFixed(0),`${foundUser.ref} invitee ${req.user.username} purchased ${req.params.plan} plan`,true,false,Math.floor((Math.random() * 10000000000) + 1),"gohar","grademy")
									}
								}else{
									await trasanctionCreate((totalBill*0.5).toFixed(0),`Your invitee ${req.user.username} purchased ${req.params.plan} plan`,true,false,Math.floor((Math.random() * 10000000000) + 1),foundRef.username,"grademy")
								}
							})
						}
						req.flash("success","Thanks for purchaing "+req.params.plan+" plan, best of luck!!!")
						res.redirect("/dashboard")
					}else{
						req.flash("error","You have insufficient balance")
						res.redirect("/user/plan")
					}
				}else{
					if(foundUser.transactions[i].isPromo && foundUser.transactions[i].varified){
						await Transaction.findById(foundUser.transactions[i] , (err,foundTransaction)=>{
							if(err || !foundTransaction){
								res.send(err)
							}else{
								foundTransaction.isPromo = false
								amountIn += foundTransaction.amount
								foundTransaction.save()
							}
						})
					}
					if(!foundUser.transactions[i].isPromo && foundUser.transactions[i].varified && foundUser.transactions[i].to.username == req.user.username){
						amountIn += foundUser.transactions[i].amount
					}
					if(!foundUser.transactions[i].isPromo && foundUser.transactions[i].varified && foundUser.transactions[i].from.username == req.user.username){
						amountOut += foundUser.transactions[i].amount
					}
				}
			}
		}
})})
// route to add TID by admin
router.post("/payment/tid/add",middelware.isLoggedIn, middelware.isAdmin, (req,res)=>{
	Transaction.findOne({TID : req.body.tid},(err, foundTransaction)=>{
		if(err || !foundTransaction){
			if(err){
				req.flash("error","Something went wrong "+err)
				res.redirect("/user/controls")
			}
			if(!foundTransaction){
				Tid.create({
					amount : req.body.amount,
					TID : req.body.tid
				},(err,tidCreated)=>{
					if(err || !tidCreated){
						console.log(err)
						req.flash("error","Something went wrong "+err)
						res.redirect("/user/controls")
					}else{
						req.flash("success","TID : "+tidCreated.TID+" with amount : "+tidCreated.amount+" created")
						res.redirect("/user/controls")
					}
				})
			}
		}else{
			Tid.create({
				amount : req.body.amount,
				TID : req.body.tid,
				used : true
			},(err,tidCreated)=>{
				if(err || !tidCreated){
					console.log(err)
					req.flash("error","TID couldn't create ")
					res.redirect("/user/controls")
				}else{
					foundTransaction.amount = req.body.amount
					foundTransaction.varified = true
					foundTransaction.save()
					req.flash("success","TID : "+tidCreated.TID+" with amount : "+tidCreated.amount+" created & transfered to"+foundTransaction.to.username)
					res.redirect("/user/controls")
				}
			})
		}
	})
	
})
// route for user to add TID
router.post("/payment/tid/students",middelware.isLoggedIn,async(req,res)=>{
	Tid.findOne({TID : req.body.tid},async(err, tidFound)=>{
		if(err || !tidFound){
			if(err){
				console.log(err)
				req.flash("error","Something went wrong!!! Please contact admin at +92 313 0157543")
				res.redirect("/user/plan")
			}
			if(!tidFound){
				await trasanctionCreate(0,"Account recharged with TID "+req.body.tid,false,false,req.body.tid,req.user.username,"grademy")
				req.flash("success","Your TID : "+req.body.tid+" has been recieved, please wait 15 mint to get it varified")
				res.redirect("/user/plan")
			}
		}else{
			if(!tidFound.used){
				await trasanctionCreate(tidFound.amount,"Account recharged with TID "+req.body.tid,true,false,req.body.tid,req.user.username,"grademy")
				tidFound.used = true
				tidFound.save()
				req.flash("success","Your TID : "+req.body.tid+" has been confirmed, Rs."+tidFound.amount+" has been added to your account")
				res.redirect("/user/plan")
			}else{
				req.flash("error","Your TID : "+req.body.tid+" has already been used please contact admin for more details +92 313 0157543")
				res.redirect("/user/plan")
			}
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
// use promo code
router.post("/payment/promo/use",(req,res)=>{
	Promo.findOne({title : req.body.promocode} , async(err , foundPromo)=>{
		if(err || !foundPromo){
			req.flash("error" ,"Invalid promo code")
			res.redirect("/user/plan")
		}else{
			if(foundPromo.usageLimit > foundPromo.usedBy.length && foundPromo.active){
				if(foundPromo.usedBy.length == 0){
					console.log("code used 1st time")
					await trasanctionCreate(foundPromo.value, foundPromo.title+" promo used",true,true,Math.floor((Math.random() * 10000000000) + 1),req.user.username,"grademy")
					foundPromo.usedBy.push({
						id : req.user._id,
						username : req.user.username
					})
					foundPromo.save()
					req.flash("success" ,foundPromo.value+" has been added to your account, this credit will expire in 3 days")
					res.redirect("/user/plan")
				}else{
					for(i=0 ; foundPromo.usedBy.length >= i; i++ ) {
						console.log(foundPromo.usedBy[i])
						if(i == foundPromo.usedBy.length ){
							console.log("code appllied")
							await trasanctionCreate(foundPromo.value, foundPromo.title+" promo used",true,true,Math.floor((Math.random() * 10000000000) + 1),req.user.username,"grademy")
							foundPromo.usedBy.push({
								id : req.user._id,
								username : req.user.username
							})
							foundPromo.save()
							req.flash("success" ,foundPromo.value+" has been added to your account, this credit will expire in 3 days")
							res.redirect("/user/plan")
							return
						}else{
							if(foundPromo.usedBy[i].username == req.user.username){
								console.log("code already used")
								req.flash("error" , "You have already used this promo")
								res.redirect("/user/plan")
								return
							}
						}
					}
				}
				
			}else{
				req.flash("error" ,"This promo code has been expired")
				res.redirect("/user/plan")
			}
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
			foundUser.transactions.reverse()
			res.json(foundUser)
		}
	})
})

// functions for this route

async function trasanctionCreate(amount,statement,varified,isPromo,TID,to,from) {
	return new Promise(async(resolve, reject)=>{
		await User.findOne({username : from},async(err,foundFrom)=>{
			if(err || !foundFrom){
				req.flash("error","Something went wrong, please contact +92 313 0157543")
				res.redirect("/user/plan")
			}else{
				await User.findOne({username : to},(err,foundTo)=>{
					if(err || !foundTo){
						req.flash("error","Something went wrong, please contact +92 313 0157543")
						res.redirect("/user/plan")
					}else{
						Transaction.create({
							amount : amount,
							statement : statement,
							TID : TID,
							varified : varified,
							isPromo : isPromo,
							to : {
								id : foundTo._id,
								username : foundTo.username
							},
							from : {
								id : foundFrom._id,
								username : foundFrom.username
							}
						},(err,transactionCreated)=>{
							if(err || !transactionCreated){
								req.flash("error","Something went wrong, please contact +92 313 0157543")
								res.redirect("/user/plan")
							}else{
								foundFrom.transactions.push(transactionCreated)
								foundTo.transactions.push(transactionCreated)
								foundFrom.save()
								foundTo.save()
								resolve()
							}
						})
					}
				})
			}
		}).catch(reject=>{
			console.log(reject)
			req.flash("error","Something went wrong, please contact +92 313 0157543")
			res.redirect("/user/plan")
		})
		
	})
}


module.exports = router ;