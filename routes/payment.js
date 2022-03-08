var express     = require("express");
var router      = express.Router();
var middelware  = require("../middelware");
var Feedback	= require("../models/feedback");
var User        = require("../models/user");
var Mcq			= require("../models/mcq")
var Tid			= require("../models/tid")
var Transaction	= require("../models/transaction")
var Promo		= require("../models/promo");
var Useractivity = require("../models/useractivity")
var Plan		= require("../models/plan")

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
					activitylog ("billing", {
						id : req.user._id,
						username : req.user.username,
						details : "visited billing page"
					})
					res.render("user/plans/plan",{MCQcount : count, invitees : foundUsers.length})
				}
			})
		}
	})
    
})
//payment route
router.get("/payment/plan/:plan/:duration" ,middelware.isLoggedIn ,async function(req,res){
	var duration = Number(req.params.duration)
	var plan	= req.params.plan
	if(req.user.isPaid || req.user.isPaidPlus){
		req.flash("error",`You have already purchased ${plan} plan`)
		res.redirect("/user/plan")
	}else{
		if(duration == 1 || duration == 3 || duration == 6){
			if(plan == "premium" || plan == "premiumplus"){
				var base = 2000
				var save = 0.2
				if(req.params.plan != "premium"){
					base = 3500
				}
				if(duration == 1){
					totalPrice = base
					sufficientBalance = await balanceCheck(totalPrice,false,req.user,res)
				}else{
					totalPrice = (base - base*save*duration/3)*duration
					sufficientBalance = await balanceCheck(totalPrice,false,req.user,res)
				}
				if(sufficientBalance.payable){
					Feedback.find({},function(err,allFeedbacks){
						if(err){
							console.log(err)
						}else{
							var feedbackToSend = []
							var num = allFeedbacks.length - 1
							for(var i = 0 ; 10 >= i ; i++){				
								if(i == 10 || i >= num){
									res.render("user/plans/payment" , {feedbacks : feedbackToSend, plan : plan, duration : Number(req.params.duration), totalBill : totalPrice})
									return
								}else{
									feedbackToSend.push(allFeedbacks[num - i ])
								}
							}
						}
					})
				}else{
					req.flash("error","You have insufficient balance, please recharge your account")
					res.redirect("/user/plan")
				}
			}else{
				req.flash("error",`invalid plan request`)
				res.redirect("/user/plan")
			}
		}else{
			req.flash("error",`invalid duration request`)
			res.redirect("/user/plan")
		}
	}
})
// receive payment route
router.get("/payment/paid/:plan/:duration",middelware.isLoggedIn ,async(req,res)=>{
	var duration = Number(req.params.duration)
	var plan	= req.params.plan
	if(req.user.isPaid || req.user.isPaidPlus){
		req.flash("error",`You have already purchased ${plan} plan`)
		res.redirect("/user/plan")
	}else{
		if(duration == 1 || duration == 3 || duration == 6){
			if(plan == "premium" || plan == "premiumplus"){
				var base = 2000
				var save = 0.2
				if(req.params.plan != "premium"){
					base = 3500
				}
				if(duration == 1){
					totalPrice = base
					sufficientBalance = await balanceCheck(totalPrice,false,req.user,res)
				}else{
					totalPrice = (base - base*save*duration/3)*duration
					sufficientBalance = await balanceCheck(totalPrice,false,req.user,res)
				}
				if(sufficientBalance.payable){
					Plan.create({
						plan : plan,
						duration : duration,
						amountPaid : totalPrice
					},(err , planCreated)=>{
						if(err || !planCreated){
							console.log(err)
							req.flash("error" , "Some unkown error happened, please report this bug !!!")
							res.redirect("/dashboard")
						}else{
							User.findById(req.user._id ,async (err , foundUser)=>{
								if(err || !foundUser){
									console.log(err)
								}else{
									await trasanctionCreate(totalPrice,plan+" plan purchased",true,false,Math.floor((Math.random() * 10000000000) + 1),"grademy",req.user.username)
									planCreated.user.id = foundUser
									planCreated.user.username = foundUser.username
									if(plan == "premium"){
										foundUser.isPaid = true
									}else{
										foundUser.isPaidPlus = true
									}
									foundUser.save()
									// commission to the person who refered his user
									await User.findOne({username : foundUser.ref},async(err , foundRef)=>{
										if(err || !foundRef){
											if(err){
												console.log(err)
											}
											if(!foundRef){
												planCreated.refTransaction = await trasanctionCreate((totalPrice*0.2).toFixed(0),`${foundUser.ref} invitee ${req.user.username} purchased ${req.params.plan} plan`,true,false,Math.floor((Math.random() * 10000000000) + 1),"gohar","grademy")
												planCreated.save()
											}
										}else{
											if(sufficientBalance.amountOut == 0){
												planCreated.refTransaction = await trasanctionCreate((totalPrice*0.2).toFixed(0),`Your invitee ${req.user.username} purchased ${req.params.plan} plan`,true,false,Math.floor((Math.random() * 10000000000) + 1),foundRef.username,"grademy")
												planCreated.save()
											}else{
												if(foundRef.isAcademy || foundRef.isAdmin){
													planCreated.refTransaction = await trasanctionCreate((totalPrice*0.2).toFixed(0),`Your invitee ${req.user.username} purchased ${req.params.plan} plan`,true,false,Math.floor((Math.random() * 10000000000) + 1),foundRef.username,"grademy")
													planCreated.save()
												}else{
													planCreated.refTransaction = await trasanctionCreate((totalPrice*0.2).toFixed(0),`${foundUser.ref} invitee ${req.user.username} purchased ${req.params.plan} plan`,true,false,Math.floor((Math.random() * 10000000000) + 1),"gohar","grademy")
													planCreated.save()
												}
											}
										}
									})
									req.flash("success","Thanks for purchaing "+req.params.plan+" plan, best of luck!!!")
									res.redirect("/dashboard")
								}
							})
						}
					})
					
				}else{
					req.flash("error","You have insufficient balance, please recharge your account")
					res.redirect("/user/plan")
				}
			}else{
				req.flash("error",`invalid plan request`)
				res.redirect("/user/plan")
			}
		}else{
			req.flash("error",`invalid duration request`)
			res.redirect("/user/plan")
		}
	}
})
// route to add TID by admin
router.post("/payment/tid/add",middelware.isLoggedIn, middelware.isAdmin, (req,res)=>{
	console.log(req.body)
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
						if(i == foundPromo.usedBy.length ){
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
								resolve(transactionCreated)
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
function activitylog(page,obj) {
	Useractivity.findById('61b357ffc86d5b7160714228', (err , foundLogs)=>{
		if(err || !foundLogs){
			console.log(err)
		}else{
			foundLogs[page].push(obj)
			foundLogs.save()
		}
	})
}
// checking balance
async function balanceCheck(totalBill,payment,user,res) {
	return new Promise(async(resolve, reject)=>{
		var amountIn = 0
		var amountOut = 0
		User.findById(user._id).populate({
			path : 'transactions',
			model : "Transaction"
		}).exec(async(err, foundUser)=>{
		if(err || !foundUser){
			console.log(err)
		}else{
			for(var i =0 ;foundUser.transactions.length >= i ; i++){
				if(foundUser.transactions.length == i){
					// terminate
					if(totalBill <= amountIn - amountOut){
						resolve({
							payable : true,
							amountIn : amountIn,
							amountOut : amountOut,
							net : amountIn - amountOut
						})
					}else{
						resolve({
							payable : false,
							amountIn : amountIn,
							amountOut : amountOut,
							net : amountIn - amountOut
						})
					}
				}else{
					// finding valid promos
					if(foundUser.transactions[i].isPromo && foundUser.transactions[i].varified){
						await Transaction.findById(foundUser.transactions[i] , (err,foundTransaction)=>{
							if(err || !foundTransaction){
								res.send(err)
							}else{
								amountIn += foundTransaction.amount
								if(payment){
									foundTransaction.isPromo = false
									foundTransaction.save()
								}
							}
						})
					}
					// non promo amount to user
					if(!foundUser.transactions[i].isPromo && foundUser.transactions[i].varified && foundUser.transactions[i].to.username == user.username){
						amountIn += foundUser.transactions[i].amount
					}
					// non promo amount from user
					if(!foundUser.transactions[i].isPromo && foundUser.transactions[i].varified && foundUser.transactions[i].from.username == user.username){
						amountOut += foundUser.transactions[i].amount
					}
				}
			}
		}
		})
	})
}



module.exports = router ;