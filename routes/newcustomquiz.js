var express 		= require("express");
var router  		= express.Router();
var middelware 		= require("../middelware");
var Mcq		 		= require("../models/mcq");
var User 			= require("../models/user");
var newCustomQuiz   = require("../models/newCustomQuiz");
var Quizcategory	= require("../models/quizcategory");
var quizcategory = require("../models/quizcategory");
var Useractivity = require("../models/useractivity")

var attemptLimit = 1733
var solveLimit = 1733

router.get("/customquiz/newquiz",middelware.isLoggedIn ,function(req,res){
	if(!req.user.isAcademy){
		if(req.user.isPaid || req.user.isPaidPlus || req.user.score.attempted < attemptLimit){
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
	}else{
		res.send("invalid request")
	}
})
router.get("/academy/quiz/new/:id",(req,res)=>{
	quizcategoryId = req.params.id
	// render react form to add new quiz for academy and save mcqs to DB
	res.render('react/mcqsForm/index')
})
// remove an mcq from a quiz
router.get("/customquiz/:quizid/remove/:mcqid",(req,res)=>{
	newCustomQuiz.findById(req.params.quizid , (err , foundQuiz)=>{
		if(err || !foundQuiz){
			console.log(err)
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
		}else{
			var mcqIndex = -1
			for(var i = 0 ; i <= foundQuiz.mcqs.length ; i++){
				if(i == foundQuiz.mcqs.length){
					// terminate
					foundQuiz.mcqs.splice(mcqIndex , 1)
					for(var  j = 0 ; j <= foundQuiz.solvedBy.length ; j++){
						if(j == foundQuiz.solvedBy.length){
							foundQuiz.save()
							res.redirect("/academy/quiz/"+foundQuiz._id+"/edit")
						}else{
							foundQuiz.solvedBy[j].key.splice(mcqIndex , 1)
							foundQuiz.solvedBy[j].timeForEachMcq.splice(mcqIndex , 1)
							foundQuiz.solvedBy[j].userScore -= foundQuiz.solvedBy[j].keyOfCorrectness.splice(mcqIndex , 1)
						}
					}
				}else{
					if(foundQuiz.mcqs[i].toString() == req.params.mcqid){
						mcqIndex = i
						i = foundQuiz.mcqs.length - 1
					}
				}
			}
		}
	})
})
// add mcq to a quiz
router.post("/customquiz/:quizid/post/mcq",(req,res)=>{
	var mcqCreate = {
		type : 4100,
		choice : req.body.mcq.choice,
		answer : [req.body.mcq.answer],
		category : req.user.category,
		subject : req.body.mcq.subject,
		chapter : req.body.mcq.chapter,
		postedBy : req.user.username,
		question : req.body.mcq.question,
		userResponse : [0,0,0,0,0]
	}
	Mcq.create(mcqCreate,(err, mcqMade)=>{
        if(err){
            console.log(err)
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
        }else{
            newCustomQuiz.findById(req.params.quizid,(err , foundQuiz)=>{
				if(err || !foundQuiz){
					console.log(err)
					req.flash("error" , "Some unkown error happened, please report this bug !!!")
					res.redirect("/dashboard")
				}else{
					foundQuiz.mcqs.push(mcqMade)
					for(var  j = 0 ; j <= foundQuiz.solvedBy.length ; j++){
						if(j == foundQuiz.solvedBy.length){
							foundQuiz.save()
							res.redirect("/academy/quiz/"+foundQuiz._id+"/edit")
						}else{
							foundQuiz.solvedBy[j].key.push(['0'])
							foundQuiz.solvedBy[j].timeForEachMcq.push(0)
							foundQuiz.solvedBy[j].keyOfCorrectness.push(0)
						}
					}
				}
			})
        }
    })
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
	if(req.user.isPaid || req.user.isPaidPlus || req.user.score.attempted < attemptLimit || req.user.isAcademy ){
		var mcqsToBeAdded = []
		console.log("body : ",req.body)
		if(Array.isArray(req.body.subjects)){
			for(var i = 0; i<=req.body.subjects.length ; i++){
				if( i == req.body.subjects.length ){
					makeQuiz(mcqsToBeAdded,req.body)
				}else{
					mcqsToBeAdded.push(...await fetchMcqs(req.body.subjects[i],req.body.chapters[i],Number(req.body.numberOfMcqs[i])))
				}
			}
		}else{
			mcqsToBeAdded = await fetchMcqs(req.body.subjects,req.body.chapters,Number(req.body.numberOfMcqs))
			makeQuiz(mcqsToBeAdded,req.body)
		}
		function fetchMcqs(subject,chapter,numberOfMcqs){
			return new Promise((resolve, reject) => {
				var MCQsFromThisChapter = []
				var correctMCQs = []
				Mcq.find({subject, chapter } ,async (err,foundMcqs)=>{
					if(err){
						console.log("here 3 :",err)
					}else{
						if(numberOfMcqs > foundMcqs.length){
							numberOfMcqs = foundMcqs.length
						}
						for (var j = 0; foundMcqs.length >= j; j++) {
							if ( j == foundMcqs.length ) {
								if(MCQsFromThisChapter.length == numberOfMcqs){
									resolve(MCQsFromThisChapter) 
								}else{
									var diff = numberOfMcqs - MCQsFromThisChapter.length
									for(var l = 0; l <= diff ; l++){
										if(l == diff){
											resolve(MCQsFromThisChapter) 
										}else{
											MCQsFromThisChapter.push(correctMCQs[l])
										}
									}
								}
							} else {
								for (var k = 0 ; k <= req.user.correctMCQs.length ; k++){
									if(k == req.user.correctMCQs.length && MCQsFromThisChapter.length < numberOfMcqs){
										// terminate
										MCQsFromThisChapter.push(foundMcqs[j])
									}else{
										if(j < foundMcqs.length - 1 && k < req.user.correctMCQs.length){
											if(req.user.correctMCQs[k].id.toString() == foundMcqs[j]._id.toString()){
												correctMCQs.push(foundMcqs[j])
												j++
												k=0
											}
										}
									}
								}
							}
						}
					}
				})
			})
		}
		function makeQuiz(mcqs,body){
			newCustomQuiz.create({
				mcqs : mcqs,
				shareWith : "public",
				description : body.description,
				madeBy : req.user.username
			},(err,quiz)=>{
				if(err){
					console.log("here 1 :",err)
				}else{
					if(typeof(req.body.sectionId) != 'undefined'){
						quizcategory.findById(req.body.sectionId, (err, foundCategory)=>{
							if(err || !foundCategory){
								console.log("error in finding category",err)
							}else{
								foundCategory.quizzes.push(quiz)
								foundCategory.save()
								res.redirect("/dashboard/quiz/redirect/"+quiz._id)
							}
						})
					}else{
						User.findById(req.user._id,(err,foundUser)=>{
							if(err || !foundUser){
								console.log("here 2 :",err)
							}else{
								foundUser.myQuizzes.push(quiz)
								foundUser.save()
								res.redirect("/dashboard/newcustomquiz/"+req.user.username)
							}
						})
					}
				}
			})
		}
	}else{
		res.send("invalid request")
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
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
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
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
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
				details : "scored "+Math.round( (req.body.userScore/(foundQuiz.mcqs.length*4)) * 100)+" % : "+foundQuiz._id
			})
			await User.findOne({username : dataFromQuiz.username} ,async function(err , foundUser){
				if(err || !foundUser){
					console.log("error in finding user",err)
				}else{
					// updating each mcq stats & user data
					for(var j = 0 ; foundQuiz.mcqs.length >= j ; j++){
						if(foundQuiz.mcqs.length == j){
							//terminate
							// saving solved quiz to students my quizzes if not made by him/her
							if(foundQuiz.madeBy != foundUser.username){
								foundUser.myQuizzes.push(foundQuiz)
							}
							foundUser.save()
							foundQuiz.save()
						}else{
							await userAndMCQ (j)
						}
					}
					// updating user and mcq
					async function userAndMCQ(j){
						try {
							return new Promise(async(resolve, reject) => {
								await Mcq.findById(foundQuiz.mcqs[j] ,async function(err , foundMcq){
									if(err){
										console.log(err)
									}else{
										// adding response to mcq ,  an error happened here can't read foreach of null
										ri = Number(dataFromQuiz.key[j][0])
										foundMcq.userResponse.set(ri, foundMcq.userResponse[ri] + 1 )
										// adding to th mcqs that this user solved it
										foundMcq.solvedBy.push({
											id : foundUser,
											username : foundUser.username,
											attempted : dataFromQuiz.key[j]
										})
										// adding time of correct attempt to mcq
										if(dataFromQuiz.keyOfCorrectness[j] == 4 ){
											if(dataFromQuiz.timeForEachMcq[j] > 5 && dataFromQuiz.timeForEachMcq[j] < 300){
												foundMcq.correctTime.push(dataFromQuiz.timeForEachMcq[j])
											}
										}
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
											await updateChapterData("correct",foundMcq,j)
										}
										else if(dataFromQuiz.keyOfCorrectness[j] == -1 ){											
											await updateChapterData("incorrect",foundMcq,j)
										}
										else if(dataFromQuiz.keyOfCorrectness[j] == 0 ){
											await updateChapterData( "skipped",foundMcq,j)
										}
										// updating history of student 
										if (foundUser.score.attempted%50 == 0){
											foundUser.score.history.push({
												x : foundUser.score.attempted ,
												y : foundUser.score.score 
											})
										}
										if(foundUser.score[foundMcq.subject].attempted%20 == 0){
											foundUser.score[foundMcq.subject].history.push({
												x : foundUser.score[foundMcq.subject].attempted,
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
										foundMcq.save();
										resolve()
									}
								})
							});
						} catch (err) {
							console.log("error in chapter saving", err);
						}
					}
					// updating chapter data && pushing correct, incorrect & skipped mcqs to user DB
					async function updateChapterData(correctness,foundMcq,j){
						try {
							return new Promise((resolve, reject) => {
								if(correctness == "correct" || correctness == "skipped"){
									// updating user data
									foundUser[correctness+"MCQs"].push({
										id : foundMcq
									})
								}else{
									foundUser.incorrect.push({
										id : foundMcq,
										attempted : dataFromQuiz.key[j] 
									})
								}
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
	})
})
//extracting questions out of the custom quiz (start now button) & passing it to data API
router.get("/dashboard/newcustomquiz/view/start/:id",middelware.isLoggedIn , function(req,res){
	newCustomQuiz.findById(req.params.id , (err , foundQuiz)=>{
		if(err || !foundQuiz){
			console.log(err)
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
		}else{
			if(req.user.isPaid || req.user.isPaidPlus || foundQuiz.shareWith != "public" || req.user.score.attempted < solveLimit ){
				res.render("quiz/attempt",{id : req.params.id})
			}else{
				req.flash("error" , "This feature is only for paid users !!!")
				res.redirect("/user/plan")
			}
		}
	})
})
router.get("/dashboard/newcustomquiz/start/:id",middelware.isLoggedIn , function(req,res){
	if(req.user.isPaid){
		newCustomQuiz.findById(req.params.id).populate("mcqs").exec(function(err , foundQuiz){
			if(err){
				console.log(err)
				req.flash("error" , "Some unkown error happened, please report this bug !!!")
				res.redirect("/dashboard")
			}
			else{
				dataToBePassed = {
					foundQuiz : foundQuiz ,
					currentuser : req.user
				}
				res.render("dashboard/quiz/quiz")
			}
		})
	}else{
		req.flash("error" , "This feature is only for paid users !!!")
		res.redirect("/user/plan")
	}
})
//quiz view page
router.get("/dashboard/newcustomquiz/view/view/:id",middelware.isLoggedIn , function(req,res){
	newCustomQuiz.findById(req.params.id,(err,foundQuiz)=>{
		if(err || !foundQuiz){
			console.log(err)
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
		}else{
			if(foundQuiz.shareWith == "competitive"){
				req.flash("error" , "This is a competitive test, you can review it when the competition in over !!!")
				res.redirect("/dashboard/quiz/redirect/"+foundQuiz._id)
			}else{
				if(req.user.isPaid || req.user.isPaidPlus || foundQuiz.shareWith == "free" || req.user.score.attempted < attemptLimit){
					activitylog ("quizView", {
						id : req.user._id,
						username : req.user.username,
						details : "viewed " + req.params.id
					})
					res.render("quiz/view",{id : req.params.id})
				}else{
					activitylog ("quizView", {
						id : req.user._id,
						username : req.user.username,
						details : "failed to view " + req.params.id
					})
					req.flash("error" , "This feature is only for paid users !!!")
					res.redirect("/user/plan")
				}
			}
		}
	})
})
// quiz redirect to redirect the user to the quiz list
router.get("/dashboard/quiz/redirect/:id",(req,res)=>{
	var found = false
	newCustomQuiz.findById(req.params.id,(err,foundQuiz)=>{
		if(err || !foundQuiz){
			console.log(err)
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
		}else{
			Quizcategory.find({},(err,allQuizCategories)=>{
				if(err || !allQuizCategories){
					console.log(err)
					req.flash("error" , "Some unkown error happened, please report this bug !!!")
					res.redirect("/dashboard")
				}else{
					for(var i =0 ; i <= allQuizCategories.length ; i++){
						if(i == allQuizCategories.length && !found){
							res.redirect("/dashboard/newcustomquiz/"+foundQuiz.madeBy)
						}else{
							if(!found){
								for(var j = 0 ; j < allQuizCategories[i].quizzes.length ; j++){
									if(allQuizCategories[i].quizzes[j].toString() == foundQuiz._id.toString()){
										if(foundQuiz.shareWith == "competitive"){
											req.flash("error" , "This is a competitive test, you can review it when the competition is over !!!")
										}
										res.redirect("/academy/section/"+allQuizCategories[i].academy+"/"+allQuizCategories[i]._id)
										found = true 
										j = allQuizCategories[i].quizzes.length
									}
								}
							}
						}
					}
				}
			})
		}
	})
})
// api for quiz data
router.get("/quiz/api/:id",middelware.isLoggedIn ,(req,res)=>{
	newCustomQuiz.findById(req.params.id).populate({
		path : 'mcqs',
		model : 'Mcq',
		populate : {
			path : 'comments',
			model : 'Comment'
		}
	}).exec(async(err , foundQuiz)=>{
		if(err){
			console.log(err)
			req.flash("error" , "Some unkown error happened, please report this bug !!!")
			res.redirect("/dashboard")
		}
		else{
			if(req.user.ref == "kgohar48" && req.user.myQuizzes.length == 0 && foundQuiz.madeBy != req.user.username && foundQuiz.shareWith != "free"){
				// making ref the owner of the very first quiz a user attempts
				await User.findById(req.user._id,(err,foundUser)=>{
					if(err || !foundUser){
						console.log(err)
					}else{
						foundUser.ref = foundQuiz.madeBy
						foundUser.save()
					}
				})
			}
			res.json({
				foundQuiz : foundQuiz ,
				currentuser : req.user
			})
		}
	})
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