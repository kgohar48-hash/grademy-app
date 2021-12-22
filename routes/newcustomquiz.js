var express 		= require("express");
var router  		= express.Router();
var middelware 		= require("../middelware");
var Mcq		 		= require("../models/mcq");
var User 			= require("../models/user");
var newCustomQuiz   = require("../models/newCustomQuiz");
var Quizcategory	= require("../models/quizcategory");
var quizcategory = require("../models/quizcategory");
var Useractivity = require("../models/useractivity")


router.get("/customquiz/newquiz",middelware.isLoggedIn ,function(req,res){
	if(!req.user.isAcademy){
		if(req.user.isPaid || req.user.isPaidPlus || req.user.score.attempted < 1000){
			// form to add a new quiz from the DB FOR STUDENTS (will add auth later)
			res.render("dashboard/customquiz/newfromdb")
		}else{
			req.flash("error" , "This feature is only for paid users !!!")
			res.redirect("/user/plan")
		}
		
	}else{
		// render react form to add new quiz for academy and save mcqs to DB
		res.render('react/mcqsForm/index')
	}
})
// form for teachers to make a quiz from the database
router.get("/customquiz/new/section/:id",middelware.isLoggedIn, (req,res)=>{
	if(req.user.isAcademy){
		res.render("dashboard/customquiz/newfromdb", {sectionId : req.params.id})
	}
})
router.get("/academy/quiz/new/:id",(req,res)=>{
	quizcategoryId = req.params.id
	// render react form to add new quiz for academy and save mcqs to DB
	res.render('react/mcqsForm/index')
})
//posting mcqs as a new quiz & saving in DB	
router.post("/newmcqs/test",middelware.isLoggedIn ,async function(req,res){
	var questionsToBeSaved = []
	for(var i =0; req.body.questions.length >= i ; i++){
		if( i == req.body.questions.length ){
			Mcq.create(questionsToBeSaved ,async function(err , questionsSaved){
				if(err){
					console.log(err)
				}else{
					// make a custom quiz out of this 
					await newCustomQuiz.create({madeBy : req.user.username},async function(err,quiz){
						if(err){
							console.log(err)
						}else{
							quiz.description = req.body.description
							for(var j = 0; questionsSaved.length >= j ; j++){
								if(j == questionsSaved.length ){
									quiz.save()
									await User.findById(req.user._id , function(err,userfound){
										if(err){
											console.log(err)
										}else{
											userfound.myQuizzes.push(quiz._id)
											userfound.save()
											Quizcategory.findById(quizcategoryId , (err , foundCategory)=>{
												if(err || !foundCategory){
													console.log("error in finding category",err)
												}else{
													foundCategory.quizzes.push(quiz)
													foundCategory.save()
												}
											})
										}
									})
								}else{
									quiz.mcqs.push(questionsSaved[j])
								}
							}
						}
					})					
					res.redirect("/academy")
				}
			})
		}else{
			questionsToBeSaved.push({
				category : req.user.category ,
				type : req.body.questions[i].choices.length*1000 + req.body.questions[i].answer.length*100 + 1,
				subject : req.body.subject ,
				chapter : req.body.chapter ,
				tags : [],
				postedBy : req.user.username,
				question : req.body.questions[i].question,
				choice : req.body.questions[i].choices,
				answer : req.body.questions[i].answer,
				solution : req.body.questions[i].solution,
				userResponse : Array(req.body.questions[i].choices.length+1).fill(0)
			})
		}
	}
})
// post route to add a new quiz from the mcqs DB FOR STUDENTS 
router.post("/dashboard/newcustomquiz" ,middelware.isLoggedIn ,async function(req,res){
	
	if(req.user.isPaid || req.user.isPaidPlus || req.user.isAcademy || req.user.score.attempted < 1000){
		var mcqsToBeAdded = []
		if(Array.isArray(req.body.subjects)){
			for(var i = 0 ; req.body.subjects.length >= i ; i++){
				if(i == req.body.subjects.length){
					// terminate
					await newCustomQuiz.create({madeBy : req.user.username },async function(err,quiz){
						if(err){
							console.log(err)
						}else{
							quiz.description = req.body.description
							quiz.mcqs = mcqsToBeAdded
							quiz.save()
							activitylog ("makequiz", {
								id : req.user._id,
								username : req.user.username,
								details : mcqsToBeAdded.length+" mcqs"
							})
							if(typeof(req.body.sectionId) != 'undefined'){
								quizcategory.findById(req.body.sectionId, (err, foundCategory)=>{
									if(err || !foundCategory){
										console.log("error in finding category",err)
									}else{
										foundCategory.quizzes.push(quiz)
										foundCategory.save()
									}
								})
							}
							await User.findById(req.user._id , function(err,userfound){
								if(err){
									console.log(err)
								}else{
									userfound.myQuizzes.push(quiz._id)
									userfound.save()
									if(typeof(req.body.sectionId) != 'undefined'){
										res.redirect("/academy/section/"+req.body.sectionId)
									}else{
										res.redirect("/dashboard/newcustomquiz/"+req.user.username)
									}
								}
							})
						}
					})
				}else{
					await Mcq.find({subject: req.body.subjects[i] , chapter : req.body.chapters[i]} ,async function(err,foundMcqs){
						if(err){
							console.log(err)
						}else{
							await addingMcqs()
							async function addingMcqs(){
								try {
									return new Promise((resolve, reject) => {
										// in case due to faulty code NOM asked by user exceed actual NOM
										console.log("i : ",i)
										console.log("mcqs asked : mcqs found  "+req.body.numberOfMcqs[i] +" : "+ foundMcqs.length)
										if(req.body.numberOfMcqs[i] > foundMcqs.length){
											console.log("thuk activated")
											req.body.numberOfMcqs[i] = foundMcqs.length
										}
										var initialValue = req.body.numberOfMcqs[i]
										for (var j = 0; initialValue >= j; j++) {
											if (initialValue == j) {
												resolve();
											} else {
												var ifCorrected = false
												for (let k = 0;req.user.correct.length >= k ; k++){
													if(req.user.correct.length == k){
														// terminate
														if( !ifCorrected || initialValue >= foundMcqs.length){
															console.log("mcq limit reached : ",initialValue >= foundMcqs.length)
															mcqsToBeAdded.push(foundMcqs[j])
														}else{
															console.log("mcq found : ",j)
															initialValue++
														}
													}else{
														if(req.user.correct[k] == foundMcqs[j]._id){
															ifCorrected = true
															k = req.user.correct.length - 1
														}
													}
												}
											}
										}
									});
								} catch (reject_1) {
									console.log("error in adding mcq : ", reject_1);
								}
							}
						}
					})
				}
			}
		}else{
			console.log("single chapter")
			await Mcq.find({subject: req.body.subjects , chapter : req.body.chapters} ,async function(err,foundMcqs){
				if(err){
					console.log(err)
				}else{
					await addingMcqs()
					async function addingMcqs(){
						try {
							return new Promise((resolve, reject) => {
								// in case due to faulty code NOM asked by user exceed actual NOM
								console.log("mcqs asked : mcqs found  "+req.body.numberOfMcqs[i] +" : "+ foundMcqs.length)
								if(req.body.numberOfMcqs > foundMcqs.length){
									console.log("thuk activated")
									req.body.numberOfMcqs = foundMcqs.length
								}
								var initialValue = req.body.numberOfMcqs
								for (var j = 0; initialValue >= j; j++) {
									if (initialValue == j) {
										resolve();
									} else {
										var ifCorrected = false
										for (let k = 0;req.user.correct.length >= k ; k++){
											if(req.user.correct.length == k){
												// terminate
												if( !ifCorrected || initialValue >= foundMcqs.length){
													console.log("mcq limit reached : ",initialValue >= foundMcqs.length)
													mcqsToBeAdded.push(foundMcqs[j])
												}else{
													console.log("mcq found : ",j)
													initialValue++
												}
											}else{
												if(req.user.correct[k] == foundMcqs[j]._id){
													ifCorrected = true
													k = req.user.correct.length - 1
												}
											}
										}
									}
								}
							});
						} catch (reject_1) {
							console.log("error in adding mcq : ", reject_1);
						}
					}
					await newCustomQuiz.create({madeBy : req.user.username },async function(err,quiz){
						if(err){
							console.log(err)
						}else{
							quiz.description = req.body.description
							quiz.mcqs = mcqsToBeAdded
							console.log("questions : ",mcqsToBeAdded.length)
							quiz.save()
							await User.findById(req.user._id , function(err,userfound){
								if(err){
									console.log(err)
								}else{
									userfound.myQuizzes.push(quiz._id)
									userfound.save()
									res.redirect("/dashboard/newcustomquiz/"+req.user.username)
								}
							})
						}
					})
				}
			})
		}
	}else{
		req.flash("error" , "This feature is only for paid users !!!")
		res.redirect("/user/plan")
	}
	
})
//custom quiz view page
router.get("/dashboard/newcustomquiz/:id" ,middelware.isLoggedIn , function(req,res){
	User.findOne({username : req.params.id}).populate({
		path : 'myQuizzes',
		model : "Newcustomquiz"
	}).exec((err,foundUser)=>{
		if(err || !foundUser){
			console.log(err)
		}else{
			// global variable
			quizzesToBeSend = foundUser.myQuizzes
			res.render("dashboard/customquiz/quizlist" ,{academy : foundUser})
		}
	})
})
//quiz submittion
// need to be refactored & intelligence has yet to be added & change for academies custom dashboard.
router.post("/newcustomquiz",middelware.isLoggedIn , async function(req,res){	
	dataFromQuiz = {
		id : req.user._id,
		username : req.body.username,
		userScore : req.body.userScore,
		key : req.body.key ,
		keyOfCorrectness : req.body.keyOfCorrectness,
		timeForEachMcq : req.body.timeForEachMcq
	}
	await newCustomQuiz.findById(req.body.quizId , async function(err,foundQuiz){
		if(err){
			console.log(err)
		}
		else{
			//saving this info into the customquiz.solvedBy & mcqs DB
			var index = 0 ;
			foundQuiz.solvedBy.forEach(solvedBy => {
				if (solvedBy.userScore < req.body.userScore){
					return index 
				}
				else{
					index++
				}
			});			
			foundQuiz.solvedBy.splice(index, 0, dataFromQuiz);
			activitylog ("quizAttempt", {
				id : req.user._id,
				username : req.user.username,
				details : "scored "+Math.round( (req.body.userScore/(foundQuiz.mcqs.length*4)) * 100)+" %"
			})
			await User.findOne({username : dataFromQuiz.username} ,async function(err , foundUser){
				if(err || !foundUser){
					console.log("error in finding user",err)
				}else{
					// updating each mcq stats & user data
					for(var j = 0 ; foundQuiz.mcqs.length >= j ; j++){
						if(foundQuiz.mcqs.length == j){
							//terminate
							console.log("saved : ")
							// saving solved quiz to students my quizzes if not made by him/her
							if(foundQuiz.madeBy != foundUser.username){
								foundUser.myQuizzes.push(foundQuiz)
							}
							await User.findByIdAndUpdate(foundUser._id,foundUser, function(err,userToBeUpdated){
								if(err){
									console.log(err)
								}
							})
							foundQuiz.save()
						}else{
							await Mcq.findById(foundQuiz.mcqs[j] ,async function(err , foundMcq){
								if(err){
									console.log(err)
								}else{
									
									// adding response to mcq ,  an error happened here can't read foreach of null
									// thukk
									dataFromQuiz.key[j].forEach(atmp =>{
										ri = Number(atmp)
										foundMcq.userResponse.set(ri, foundMcq.userResponse[ri] + 1 )
									})
									
									// an error happened here
									foundUser.score.attempted++
									foundUser.score[foundMcq.subject].attempted++
									foundUser.score[foundMcq.subject].keyOfCorrectness.push(dataFromQuiz.keyOfCorrectness[j])
									// testing has to be done 
									foundUser.score.score += dataFromQuiz.keyOfCorrectness[j]
									foundUser.score[foundMcq.subject].score += dataFromQuiz.keyOfCorrectness[j]
									// keyOf correctness chopping
									if(foundUser.score[foundMcq.subject].keyOfCorrectness.length > 100){
										choppedElement = foundUser.score[foundMcq.subject].keyOfCorrectness.shift()
										// testing has to be done
										foundUser.score[foundMcq.subject].score -= choppedElement
										foundUser.score.score -= choppedElement
									}
									if(dataFromQuiz.keyOfCorrectness[j] == 4 ){
										// foundMcq.avgCorrectTime = ((foundMcq.avgCorrectTime * foundMcq.correct) + dataFromQuiz.timeForEachMcq[j]) / (foundMcq.correct + 1)
										// updating user data
										foundUser.correct.push(foundMcq)
										await updateChapterData("correct")
									}
									if(dataFromQuiz.keyOfCorrectness[j] == -1 ){
										// updating user data
										foundUser.incorrect.push({
											id : foundMcq,
											attempted : dataFromQuiz.key[j] 
										})
										await updateChapterData("incorrect")
									}
									if(dataFromQuiz.keyOfCorrectness[j] == 0 ){
										// updating user data
										foundUser.skipped.push(foundMcq)
										await updateChapterData( "skipped")
									}
									// updating history of student & change later for academies custom dashboard
									if (foundUser.score.attempted%50 == 0){
										foundUser.score.history.push({
											x : foundUser.score.attempted ,
											y : foundUser.score.score 
										})
									}

									if(foundUser.score[foundMcq.subject].attempted%20 == 0){
										foundUser.score[foundMcq.subject].history.push({
											x : foundUser.score[foundMcq.subject].attempted ,
											y : foundUser.score[foundMcq.subject].score
										})
									}
									// chopping history
									if(foundUser.score.history.length > 20){
										foundUser.score.history.shift()
									}
									if(foundUser.score[foundMcq.subject].history.length > 20){
										foundUser.score[foundMcq.subject].history.shift()
									}
									// updating chapter data
									async function updateChapterData(correctness){
										try {
											return new Promise((resolve, reject) => {
												foundMcq[correctness]++;
												foundMcq.save();

												//  detailed testing has to be done
												//  for the very first mcqs that user is going to solve
												if (typeof foundUser.score[foundMcq.subject].chapters == 'undefined') {
													foundUser.score[foundMcq.subject].chapters = foundUser.score[foundMcq.subject].chapters || {};
												}
												if (typeof foundUser.score[foundMcq.subject].chapters[foundMcq.chapter] == "undefined") {
													// if first time this chapter
													foundUser.score[foundMcq.subject].chapters[foundMcq.chapter] = { correct: 0, incorrect: 0, skipped: 0 };
													foundUser.score[foundMcq.subject].chapters[foundMcq.chapter][correctness]++;
													resolve();
												} else {
													// if student has previusly solved any mcq from that chapter
													foundUser.score[foundMcq.subject].chapters[foundMcq.chapter][correctness]++;
													resolve();
												}
											});
										} catch (err) {
											console.log("error in chapter saving", err);
										}
									}
								}
							})
						}
					}
				}
			})

		}
	})
	//Saving and undating user's score and chapter performance
})
//extracting questions out of the custom quiz (start now button) & passing it to data API
router.get("/dashboard/newcustomquiz/view/start/:id",middelware.isLoggedIn , function(req,res){
	newCustomQuiz.findById(req.params.id).populate("mcqs").exec(function(err , foundQuiz){
		if(err){
			console.log(err)
		}
		else{
			dataToBePassed = {
				foundQuiz : foundQuiz ,
				currentuser : req.user
			}
			res.render("quiz/attempt")
		}
	})
})
router.get("/dashboard/newcustomquiz/start/:id",middelware.isLoggedIn , function(req,res){
	newCustomQuiz.findById(req.params.id).populate("mcqs").exec(function(err , foundQuiz){
		if(err){
			console.log(err)
		}
		else{
			dataToBePassed = {
				foundQuiz : foundQuiz ,
				currentuser : req.user
			}
			res.render("dashboard/quiz/quiz")
		}
	})
})
//quiz view page
router.get("/dashboard/newcustomquiz/view/view/:id",middelware.isLoggedIn , function(req,res){
	
	if(req.user.isPaid || req.user.isPaidPlus || req.user.score.attempted < 1000){
		newCustomQuiz.findById(req.params.id).populate("mcqs").exec(async function(err , foundQuiz){
			if(err){
				console.log(err)
				req.flash("error" , "error occured : kindly report this bug")
				res.redirect("/dashboard")
			}
			else{
				activitylog ("quizView", {
					id : req.user._id,
					username : req.user.username,
					details : "view" + req.params.id
				})
				dataToBePassed = {
					foundQuiz : foundQuiz ,
					currentuser : req.user
				}
				res.render("quiz/view")
			}
		})
	}else{
		activitylog ("quizView", {
			id : req.user._id,
			username : req.user.username,
			details : "failed to view " + req.params.id
		})
		req.flash("error" , "This feature is only for paid users !!!")
		res.redirect("/user/plan")
	}
	
})
// functions

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
module.exports = router ;