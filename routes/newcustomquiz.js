var express 		= require("express");
var router  		= express.Router();
var middelware 		= require("../middelware");
var Mcq		 		= require("../models/mcq");
var User 			= require("../models/user");
var newCustomQuiz   = require("../models/newCustomQuiz");
var Quizcategory	= require("../models/quizcategory")


router.get("/customquiz/newquiz",middelware.isLoggedIn ,function(req,res){
	if(!req.user.isAcademy){
		// form to add a new quiz from the DB FOR STUDENTS (will add auth later)
		res.render("dashboard/customquiz/newfromdb")
	}else{
		// render react form to add new quiz for academy and save mcqs to DB
		res.render('react/mcqsForm/index')
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
													console.log("done sir")
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
				solution : req.body.questions[i].solution
			})
		}
	}
})
// post route to add a new quiz from the mcqs DB FOR STUDENTS 
router.post("/dashboard/newcustomquiz" ,middelware.isLoggedIn ,async function(req,res){
	console.log(req.body)
	var mcqsToBeAdded = []
	if(Array.isArray(req.body.subjects)){
		console.log("multiple chapters")
		for(var i = 0 ; req.body.subjects.length >= i ; i++){
			if(i == req.body.subjects.length){
				// terminate
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
})
//custom quiz view page
router.get("/dashboard/newcustomquiz/:id" ,middelware.isLoggedIn , function(req,res){
	User.findOne({username : req.params.id} , function(err , foundUser){
		if(err || !foundUser){
			console.log("error aya")
			console.log(err)
		}else{
			console.log("user found")

			var quizzes = []
			init()
			async function init (){
				await fetchQuizzes()
				// global variable
				quizzesToBeSend = quizzes ;
				res.render("dashboard/customquiz/quizlist" ,{academy : foundUser})
			}
			async function fetchQuizzes(){
				try {
					return new Promise(async(resolve, reject) => {
						if(foundUser.myQuizzes.length == 0){
							resolve()
						}else{
							await newCustomQuiz.find({madeBy : foundUser.username},function(err,quizzesFound){
								if(err){
									console.log(err)
								}else{
									quizzes = quizzesFound
								}
								resolve()
							})
							
						}
					});
				}
				catch (reject) {
					console.log("error here in quiz fetching : " + reject);
				}
			}
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

			await User.findOne({username : dataFromQuiz.username} ,async function(err , foundUser){
				if(err || !foundUser){
					console.log("error in finding user",err)
				}else{
					// updating each mcq stats & user data
					for(var j = 0 ; foundQuiz.mcqs.length >= j ; j++){
						if(foundQuiz.mcqs.length == j){
							//terminate
							console.log("saved : ")
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
										foundUser.score[foundMcq.subject].score += choppedElement
										foundUser.score.score += choppedElement
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
			res.render("dashboard/quiz/quiz")
		}
	})
})
//quiz view page
router.get("/dashboard/newcustomquiz/view/view/:id",middelware.isLoggedIn , function(req,res){
	newCustomQuiz.findById(req.params.id).populate("mcqs").exec(async function(err , foundQuiz){
			if(err){
			console.log(err)
			req.flash("error" , "error occured : kindly report this bug")
			res.redirect("/dashboard")
		}
		else{
			dataToBePassed = foundQuiz
			res.render("dashboard/quiz/view")
		}
	})
})

module.exports = router ;