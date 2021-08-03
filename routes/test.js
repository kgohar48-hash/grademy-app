const newCustomQuiz = require("../models/newCustomQuiz");

const express		 = require("express"),
	router 			 = express.Router(),
    User			 = require("../models/user"),
	Pool			 = require("../models/pool");
	Mcq			 	= require("../models/mcq");
	


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
	// newCustomQuiz.findById("6105e5513f31c60015f7e57a", (err , foundQuiz)=>{
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
module.exports = router ;
