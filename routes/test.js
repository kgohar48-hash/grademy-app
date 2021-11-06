const newCustomQuiz = require("../models/newCustomQuiz");

const express		 = require("express"),
	router 			 = express.Router(),
    User			 = require("../models/user"),
	Pool			 = require("../models/pool");
	Mcq			 	= require("../models/mcq");
	Comment			= require("../models/comment")
	var middelware  = require("../middelware");

// route to convert pool to mcqs DB 
// router.get('/pooltomcqs/:subject',async function (req,res) {
// 	var mcqsToDB = []
// 	var subject = req.params.subject
// 	await Pool.findOne({},async function(err,pool){
// 		if(err){
// 			console.log(err)
// 		}else{
// 			for(var chap = 0 ; pool[subject].length >= chap ; chap++){
// 				if(pool[subject].length == chap){
// 					// all chapters done
// 					await Mcq.create(mcqsToDB , function (err , mcqsAdded) {
// 						if(err){
// 							console.log(err)
// 						}else{
// 							console.log("mcqs added to DB :" , mcqsAdded.length)
// 						}
// 					})
// 					console.log("all chapters done")
// 				}else{
// 					for(var questionIndex = 0 ; pool[subject][chap].questions.length >= questionIndex ; questionIndex++){
// 						if(pool[subject][chap].questions.length == questionIndex){
// 							// chapter done
// 							console.log("chapter done : ", pool[subject][chap].chapterName)
// 						}else{
// 							console.log(subject +" mcqs added : ", mcqsToDB.length)
// 							mcqsToDB.push({
// 								category : "FUNG" ,
// 								type : 4100,
// 								subject : subject,
// 								chapter : pool[subject][chap].chapterName ,
// 								tags : [],
// 								postedBy : pool[subject][chap].postedBy,
// 								question : pool[subject][chap].questions[questionIndex].question ,
// 								choice : [ pool[subject][chap].questions[questionIndex].choice1 , pool[subject][chap].questions[questionIndex].choice2 , pool[subject][chap].questions[questionIndex].choice3 , pool[subject][chap].questions[questionIndex].choice4],
// 								answer : [ pool[subject][chap].questions[questionIndex].answer ],
// 								userResponse : [0,0,0,0,0]
// 							})
// 						}
// 					}
// 				}
// 			}
// 		}
// 	})
// 	res.send(mcqsToDB)
// })
router.get("/shuffle/:id",(req,res)=>{
	// newCustomQuiz.findById(req.params.id, (err , foundQuiz)=>{
	// 	if(err || !foundQuiz){
	// 		console.log(err)
	// 	}else{
	// 		function shuffle(array) {
	// 			var currentIndex = array.length,  randomIndex;
			  
	// 			// While there remain elements to shuffle...
	// 			while (0 !== currentIndex) {
			  
	// 			  // Pick a remaining element...
	// 			  randomIndex = Math.floor(Math.random() * currentIndex);
	// 			  currentIndex--;
			  
	// 			  // And swap it with the current element.
	// 			  [array[currentIndex], array[randomIndex]] = [
	// 				array[randomIndex], array[currentIndex]];
	// 			}
	// 			return array;
	// 		}
	// 		foundQuiz.mcqs = shuffle(foundQuiz.mcqs)
	// 		newCustomQuiz.findByIdAndUpdate(foundQuiz._id , foundQuiz, (errr , updated)=>{
	// 			if(errr){
	// 				console.log(errr)
	// 			}else{
	// 				res.send(foundQuiz)
	// 			}
	// 		})
	// 	}
	// })
})

// router.get("/fix/responce",(req,res)=>{
// 	Mcq.find({},async(err,foundMcqs)=>{
// 		if(err || !foundMcqs){
// 			console.log(err)
// 		}else{
// 			for(var i = 0 ; i <= foundMcqs.length;i++){
// 				if(i == foundMcqs.length){
// 					console.log(foundMcqs.length)
// 					// terminate
// 					res.send("done")
// 				}else{
// 					await Mcq.findById(foundMcqs[i]._id , (err, foundMcq)=>{
// 						if(err ||!foundMcq){
// 							console.log(err)
// 						}else{
// 							// fixing user response
// 							console.log(i)
// 							// if(foundMcq.userResponse.length == 0){
// 							// 	foundMcq.userResponse = Array(foundMcq.choice.length+1).fill(0)
// 							// 	foundMcq.save()
// 							// 	console.log("fixing")
// 							// }
// 							if(foundMcq.subject == ""){
// 								foundMcq.subject = 'physics'
// 								console.log("chapter")
// 								foundMcq.save()
// 							}
// 						}
// 					})
// 				}
// 			}
// 		}
// 	})
// })
router.get("/assignment/1",(req,res)=>{
	newCustomQuiz.findById("60ff485968585300151a71d6").populate("mcqs").exec(function(err , foundQuiz){
		if(err){
			console.log(err)
		}
		else{
			res.json(foundQuiz)
		}
	})
})

// sort biology mcqs by students-moderators
router.get("/sort/biology",middelware.isLoggedIn,(req,res)=>{
	Mcq.find({subject : "biology"}).populate({
		path : 'comments',
		model : "Comment"
	}).exec((err,foundMCQs)=>{
		if(err || !foundMCQs){
			console.log(err)
			res.send(err)
		}else{
			var MCQsToSend = []
			for(var i=0 ; foundMCQs.length >= i; i++){
				console.log("i : "+i)
				if(foundMCQs.length == i){
					console.log("terminate")
					console.log("about to send")
					res.send(MCQsToSend)
				}else{
					if(MCQsToSend.length <= 20 && foundMCQs[i].comments.length < 10 || !foundMCQs[i].comments){
						if(MCQsToSend.length == 20){
							i = foundMCQs.length - 1
						}
						if(!foundMCQs[i].comments){
							console.log("comments are undefined")
							MCQsToSend.push(foundMCQs[i])
						}else{
							for(var j=0;foundMCQs[i].comments.length >= j ; j++){
								console.log("j : "+j)
								if(foundMCQs[i].comments.length == j){
									// terminate
									MCQsToSend.push(foundMCQs[i])
								}else{
									if(foundMCQs[i].comments[j].author.username == req.user.username){
										j = foundMCQs[i].comments.length + 1
									}
								}
							}
						}
					}
				}
			}
		}
	})
})
// route to show students the sorting page
router.get("/sorting",middelware.isLoggedIn,(req,res)=>{
	res.render("testing/sorting")
})
// route to save student sorting response
router.post("/sorting/biology",middelware.isLoggedIn,async(req,res)=>{
	console.log(req.body)
	var selectedChapters = req.body
	for(var i=0 ; selectedChapters.length >= i ; i++){
		if(selectedChapters.length == i){
			console.log("all done")
		}else{
			var newCommnet = {
				text : selectedChapters[i].chapter,
				author : {
					id : req.user._id, 
					username : req.user.username 
				}
			}
			await Mcq.findById(selectedChapters[i].id,async(err,foundMcq)=>{
				if(err || !foundMcq){
					console.log(err)
					res.redirect("/")
				}else{
					await Comment.create(newCommnet , function (err , comment){
						if(err || !comment){
							console.log(err)
						}
						else{
							foundMcq.comments.push(comment)
							foundMcq.save()
							console.log("comment saved")
						}
					})
				}
			})
		}
	}
})
// redirect to dashboard
router.post("/sorting/redirect",middelware.isLoggedIn,(req,res)=>{
	res.redirect("/dashboard")
})

module.exports = router ;
