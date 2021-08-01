const express		 = require("express"),
	router 			 = express.Router(),
    User			 = require("../models/user"),
	Pool			 = require("../models/pool");
	Mcq			 = require("../models/mcq");


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
router.get("/profile",(req,res)=>{
	// score fix
	// User.find({},async(err,foundUsers)=>{
	// 	if(err){
	// 		console.log(err)
	// 	}else{
	// 		for(var i = 0; i <= foundUsers.length;i++){
	// 			sum = 0
	// 			if(i==foundUsers.length){
	// 				// terminates
	// 				res.send("done")
	// 			}else{
	// 				await User.findById(foundUsers[i], (err,foundUser)=>{
	// 					if(err || !foundUser){
	// 						console.log(err)
	// 					}else{
	// 						console.log("i : "+ i)
	// 						sumPhy = foundUser.score.physics.keyOfCorrectness.reduce((a, b) => a + b, 0)
	// 						sumBio = foundUser.score.biology.keyOfCorrectness.reduce((a, b) => a + b, 0)
	// 						sumEng = foundUser.score.english.keyOfCorrectness.reduce((a, b) => a + b, 0)
	// 						foundUser.score.score = sumPhy + sumEng + sumBio
	// 						foundUser.score.physics.score = sumPhy
	// 						foundUser.score.english.score = sumEng
	// 						foundUser.score.biology.score = sumBio
	// 						foundUser.save()

	// 					}
	// 				})
	// 			}
	// 		}
			
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
module.exports = router ;
