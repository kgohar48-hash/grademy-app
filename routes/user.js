var express			 = require("express"),
    router 			 = express.Router(),
    User			 = require("../models/user"),
    Counselling      = require("../models/counselling"),
    Feedback         = require("../models/feedback"),
    Promo            = require("../models/promo");


const https = require('https');
var middelware = require("../middelware");
//admin panel
router.get("/admin",middelware.isLoggedIn , function(req,res){
	if(req.user.isModerator || req.user.isAdmin){
		var admin = req.user.username ;
		var totalUsers = 0 ;
		var paidUsers = 0;
		User.find({},async function(err,allUsers){
			if(err){
				console.log(err)
			}else{
				await fetchTotalUsers ()
				function fetchTotalUsers(){
					return new Promise((resolve,reject)=>{
						for (tu = 0 ; allUsers.length >=tu; tu++){
							if (tu == allUsers.length ){
								resolve()
							}else{
                                if(allUsers[tu].ref == admin ){
                                    totalUsers++ ;
                                    if(allUsers[tu].isPaid){
                                        paidUsers++
                                    }
                                }
                            }
						}
					})
				}
				res.render("user/admin" , {totalUsers : totalUsers , paidUsers : paidUsers})
			}
		})
	}
	else{
		res.send("you are not authorized")
	}
})
// for counselling & bugs
router.get("/user/counselling",middelware.isLoggedIn , function(req,res){
    if(req.user.isModerator || req.user.isAdmin){
        Counselling.find({},function(err , allRequests){
            if(err){
                console.log(err)
            }else{
                res.render("user/counselling" , {allRequests : allRequests})
            }
        })
    }else{
        res.redirect("/dashboard")
    }
})
router.post("/counselling",middelware.isLoggedIn , function(req,res){
    if(req.body.bug){
        // if user online
        if(req.user){
            var obj = {
                name : req.user.name,
                phone : req.user.phone ,
                category : "reported a bug" ,
                question : req.body.bug
            }
            Counselling.create(obj , function(err , counselling){
                if(err){
                    console.log(err)
                }else{
                    req.flash("success" , "Thank you for reporting!")
                    res.redirect("/dashboard")
                }
            }) 
        }else{
            var obj = {
                name : "offline",
                phone : "offline" ,
                category : "reported a bug" ,
                question : req.body.bug
            }
            Counselling.create(obj , function(err , counselling){
                if(err){
                    console.log(err)
                }else{
                    req.flash("success" , "Thank you for reporting!")
                    res.redirect("back")
                }
            }) 
        }
    }else{
        var obj = {
            name : req.user.name,
            phone : req.user.phone ,
            category : req.user.category ,
            question : req.body.question,
        }
        Counselling.create(obj , function(err , counselling){
            if(err){
                console.log(err)
            }else{
                req.flash("success" , "request has been sent!")
                res.redirect("/dashboard")
            }
        })
    }
})
//sending details via SMS
router.post("/counselling/details",middelware.isLoggedIn , function(req,res){
    Counselling.findById(req.body.requestId , function(err , found){
        if(err){
            console.log(err)
        }else{
            found.acceptedBy = req.user.username
            found.status = true
            found.save();
            var message =  'Student name : ' +found.name+' , Phone : '+found.phone
			var stringapi = 'https://sendpk.com/api/sms.php?username=923084737543&password=raf8ZaBNqZip@AQ&sender=Grademy&mobile='+req.user.phone +'&message='+message
			https.get(stringapi, (resp) => {
            });
            req.flash("success" , "contact details have been sent to your number")
            res.redirect("/user/counselling")
        }
    })
})
//controls only for owner 
router.get("/user/controls",middelware.isLoggedIn , function(req,res){
    var controlsData = {
        totalUsers : "",
        totalVerified : "",
        totalPaid : "",
        totalMDCAT : "",
        totalFUNG : ""
    } 
    if(req.user.isAdmin){
        User.countDocuments({},function(err,totalUsers){
            if(err){
                console.log(err)
            }else{
                controlsData.totalUsers = totalUsers ;
                User.countDocuments({isVerified : true} , function(err,totalVerified){
                    if(err){
                        console.log(err)
                    }else{
                        controlsData.totalVerified = totalVerified
                        User.countDocuments({isPaid : true} , function(err,totalPaid){
                            if(err){
                                console.log(err)
                            }else{
                                controlsData.totalPaid = totalPaid
                                User.countDocuments({category : 'MDCAT'} , function(err,totalMDCAT){
                                    if(err){
                                        console.log(err)
                                    }else{
                                        controlsData.totalMDCAT = totalMDCAT
                                        User.countDocuments({category : 'FUNG'} , function(err,totalFUNG){
                                            if(err){
                                                console.log(err)
                                            }else{
                                                controlsData.totalFUNG = totalFUNG
                                                res.render("user/controls" , controlsData)
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }else{
        res.redirect("/dashboard")
    }
})
//changing status
router.post("/user/status",middelware.isLoggedIn, function(req,res){
    if(req.user.isAdmin){
        if(req.body.mcqs){
            User.find({},function(err,allUsers){
                if(err){
                    console.log(err)
                }else{
                    var numberofusers = 0 
                    for(var i = 0 ; i < allUsers.length;i++){
                        if(allUsers[i].score.attempted > req.body.numberofmcqs){
                            console.log(allUsers[i].username)
                            numberofusers++
                            console.log("username : ",allUsers[i].username)
                        }
                        if(i == allUsers.length - 1){
                            req.flash("success" , "User solved mcqs more than "+req.body.numberofmcqs+" are : "+numberofusers)
                            res.redirect("/user/controls")
                        }
                    }
                }
            })
        }

        else{
            User.findOne({username:req.body.username} , function(err , foundUser){
                if(err){
                    console.log(err)
                    res.send(err)
                }
                if(!foundUser){
                    req.flash("error" , "user not found")
                    res.redirect("/user/controls")
                }
                if(foundUser){
                    console.log("found : "+foundUser.name)
                    if(req.body.invites){
                        console.log("invites")
                        req.flash("success" , foundUser.username+" has "+foundUser.invitations+" invites")
                        res.redirect("/user/controls")
                    }
                    if(req.body.verification){
                        console.log("verification")
                        foundUser.isVerified = true ;
                        foundUser.save()
                        req.flash("success" , foundUser.username+" has been verified")
                        res.redirect("/user/controls")
                    }
                    if(req.body.paid){
                        console.log("paid")
                        foundUser.isPaid = true ;
                        foundUser.save()
                        req.flash("success" , foundUser.username+" has been Paid")
                        res.redirect("/user/controls")
                    }
                    if(req.body.moderator){
                        console.log("moderator")
                        foundUser.isModerator = true ;
                        foundUser.save()
                        req.flash("success" , foundUser.username+" has been made moderator")
                        res.redirect("/user/controls")
                    }
                    if(req.body.academy){
                        console.log("academy")
                        foundUser.isAcademy = true ;
                        foundUser.save()
                        req.flash("success" , foundUser.username+" has been made academy")
                        res.redirect("/user/controls")
                    }
                    
                }
            })
        }
    }else{
        res.redirect("/dashboard")
    }
})
//promo use
router.post("/user/promouse" , middelware.isLoggedIn ,function(req,res){
    User.findById(req.user._id , function(err , user){
        if(err){
            console.log(err)
            res.redirect('/dashbaord')
        }else{
            Promo.findOne({title : req.body.promocode} , function(err , foundpromo){
                if(err){
                    console.log(err)
                    req.flash("error" , "invalid promo code")
                    res.redirect("/payment")
                }
                if(!foundpromo){
                    req.flash("error" , "invalid promo code")
                    res.redirect("/payment")
                }
                if(foundpromo){
                    console.log("code found")
                    if(foundpromo.status && foundpromo.usedBy.length < foundpromo.usageLimit){
                        console.log("code active")
                        if(foundpromo.usedBy.length == 0){
                            console.log("code used 1st time")
                            var credit = foundpromo.value -  user.invitations
                            user.invitations = user.invitations + foundpromo.value ;
                            user.save()
                            foundpromo.usedBy.push({username : user.username , phone : user.phone})
                            foundpromo.save()
                            req.flash("success" , credit*100 + " has been added to your credit")
                            res.redirect("/payment")
                            
                        }else{
                            for(i=0 ; i <foundpromo.usedBy.length; i++ ) {
                                if(foundpromo.usedBy[i].username==user.username){
                                    console.log("code already used")
                                    req.flash("error" , "You have already used this promo")
                                    res.redirect("/payment")
                                    return
                                }else{
                                    if(i == foundpromo.usedBy.length -1 ){
                                        console.log("code apllied")
                                        var credit = foundpromo.value -  user.invitations
                                        user.invitations = user.invitations + foundpromo.value ;
                                        user.save()
                                        foundpromo.usedBy.push({username : user.username , phone : user.phone})
                                        foundpromo.save()
                                        req.flash("success" , credit*100 + " has been added to your credit")
                                        res.redirect("/payment")
                                        return
                                    }
                                }
                            }
                        }
                    }else{
                        req.flash("error" , "This Promo has been expired")
                        res.redirect("/payment")
                    }
                   
                }
            })
        }
    })
})
//add students to academy
router.post("/user/addacademy",middelware.isLoggedIn,function(req,res){
    if(req.user.isAcademy){
        User.findOne({username:req.body.username} , function(err , foundUser){
            if(err){
                console.log(err)
                res.redirect("/dashboard")
            }
            if(!foundUser){
                req.flash("error" , "User not found")
                res.redirect("/dashboard/customquiz/"+req.user._id)
            }
            if(foundUser){
                User.findById(req.user._id , function(err , foundAcademy){
                    if(err){
                        console.log(err)
                        res.redirect("/dashboard")
                    }else{
                        foundAcademy.students.push(foundUser.username)
                        console.log("user found")
                        console.log(req.user._id)
                        console.log(typeof req.user._id)
                        foundUser.myAcademy = req.user._id
                        foundAcademy.save()
                        foundUser.save()
                        req.flash("success" , foundUser.username+" is added to academy")
                        res.redirect("/dashboard/customquiz/"+req.user._id)
                    }
                })
                
            }
        })
    }else{
        res.redirect("/dashboard")
    }
})
//get user feedback
router.post("/user/feedback",middelware.isLoggedIn , function(req,res){
    var feedbackObj = {
        username : req.user.username,
        phone : req.user.phone ,
        category : req.user.category,
        feedback : req.body.feedback
    }
    Feedback.create(feedbackObj , function(err,feedbackMade){
        if(err){
            console.log(err)
            req.flash("error" , "Something went wrong")
            res.redirect("/dashboard")
        }else{
            req.flash("success" , "Thank you ! your feedback is super valuable to us")
            res.redirect("/dashboard")
        }
    })
})
//sending SMS to users 
router.post("/user/sms",middelware.isLoggedIn ,function(req,res){
    if(req.user.isAdmin){
        if(req.body.users == 'all'){
            User.find({} , function(err, allusers){
                if(err)(
                    res.send(err)
                )
                else{
                    allusers.forEach(async user => {
                        var message = 'Hi '+user.username+' ! %0A'+req.body.smstext
                        var smstopaidusers = "https://lifetimesms.com/json?api_token=6861b73945fe2633b599a7ae9aec2c9001fc6a2817&api_secret=secretapikeyforkgohargrademy&to="+ user.phone +"&from=GRADEMY&message="+message
                        await sendsms (smstopaidusers)
                    });
                }
            })
        }
        if(req.body.users == 'paid'){
            User.find({isPaid : true} , function(err, paidUsers){
                if(err)(
                    res.send(err)
                )
                else{
                    paidUsers.forEach(async user => {
                        if(user.username != "Muqadas Bashir"){
                            var message = 'Hi '+user.username+' ! %0A'+req.body.smstext
                            var smstopaidusers = "https://lifetimesms.com/json?api_token=6861b73945fe2633b599a7ae9aec2c9001fc6a2817&api_secret=secretapikeyforkgohargrademy&to="+ user.phone +"&from=GRADEMY&message="+message
                            await sendsms (smstopaidusers)
                            console.log(message)
                        }
                    });
                }
            })
        }
        if(req.body.users == 'unpaid'){
            User.find({isPaid : false} , function(err, unpaidUsers){
                if(err)(
                    res.send(err)
                )
                else{
                    unpaidUsers.forEach(async user => {
                        var message = 'Hi '+user.username+' ! %0A'+req.body.smstext
                        var smstopaidusers = "https://lifetimesms.com/json?api_token=6861b73945fe2633b599a7ae9aec2c9001fc6a2817&api_secret=secretapikeyforkgohargrademy&to="+ user.phone +"&from=GRADEMY&message="+message
                        await sendsms (smstopaidusers)
                    });
                }
            })
        }
        if(req.body.users == 'mdcat'){
            User.find({category : 'MDCAT'} , function(err, MDCATusers){
                if(err)(
                    res.send(err)
                )
                else{
                    var MDCATstudentsContactInfo = []
                    for(var i=100 ; i < MDCATusers.length ; i++){
                        MDCATstudentsContactInfo.push({
                            username : MDCATusers[i].username ,
                            phone : MDCATusers[i].phone
                        })
                        if(i == MDCATusers.length - 1){
                            console.log(MDCATstudentsContactInfo)
                        }
                    }
                    
                }
            })
        }
        if(req.body.users == 'fung'){
            User.find({category : 'FUNG'} , function(err, FUNGusers){
                if(err)(
                    res.send(err)
                )
                else{
                    var index = 0 ;
                    testContactInfo = [
                        {username : 'kgohar1' , phone : '03084737543'},
                        {username : 'kgohar2' , phone : '03084737543'},
                        {username : 'kgohar3' , phone : '03084737543'},
                        {username : 'kgohar4' , phone : '03084737543'},
                        {username : 'kgohar5' , phone : '03084737543'},
                        {username : 'kgohar6' , phone : '03084737543'},
                        {username : 'kgohar7' , phone : '03084737543'}
                        ]

                    setInterval(sendSMS , 1000*20)
                    function sendSMS(){
                        var SMS = "Hi "+testContactInfo[index].username+" ! %0A %0A" +req.body.smstext
                        var smsURL = "https://lifetimesms.com/json?api_token=6861b73945fe2633b599a7ae9aec2c9001fc6a2817&api_secret=secretapikeyforkgohargrademy&to="+ testContactInfo[index].phone +"&from=GRADEMY&message="+SMS
                        https.get(smsURL, (resp) => {
                            
                        });
                        index++ 
                    }
                }
            })
        }
        console.log(req.body)
        res.redirect("/user/controls")
    }else{
        res.send("you are not autherized")
    }
})

module.exports = router ;