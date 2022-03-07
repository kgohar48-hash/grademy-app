const express			= require("express"),
	  router			= express.Router(),
	  User				= require("../models/user"),
	  Mcq			 	= require("../models/mcq"),
	  NewCustomQuiz		= require("../models/newCustomQuiz"),
	  Transaction		= require("../models/transaction")
	  middelware 		 = require("../middelware");

// galobal variables

var mcqsInfo = {}

// ===============================
// Api routes
// ===============================

// current user api
router.get("/currentuser",middelware.isLoggedIn , function(req,res){
	var positionsData = {
		user : req.user,
		position : position,
		biologyPosition : biologyPosition,
		mathPosition : mathPosition,
		physicsPosition : physicsPosition,
		chemistryPosition : chemistryPosition,
		englishPosition : englishPosition
	}
	res.json(positionsData)
})
//API to pass data to template's javascript file
router.get("/data" , function(req,res){
	var data = dataToBePassed ;
	res.json(data)
})
//customquiz api to send list of quizzes
router.get("/quizlistapi",function(req,res){
	// got this object from newCustomQuiz router
	res.json(quizzesToBeSend)
})
// api route to send info relating to a specific category of mcqs
router.get('/mcqsinfoapi',(req,res)=>{
	if(req.user.category == 'GRE'){
		res.send(mcqsInfo.GRE)
	}else{
		res.send({FUNG : mcqsInfo.FUNG , MDCAT : mcqsInfo.MDCAT})
	}
})

// ===============================
// api functions
// ===============================

// function calls
var time = 0

askingForInfo();
checkTransactions()
positionSorting();
// setInterval(()=>{time++}, 100)
setInterval(positionSorting, 1000 * 60*60);
setInterval(checkTransactions, 1000 * 60*60*24);

// function defination ====================================

async function positionSorting(){ 
	console.log("position sorting started : ", time)
	await User.find({},function(err,allUsers){
		if(err){
			console.log(err)
		}
		else{
			position = []
			biologyPosition = []
			mathPosition = []
			physicsPosition = []
			chemistryPosition = []
			englishPosition =[]
			for(s=0;allUsers.length >= s;s++){
				if(allUsers.length == s){
					// terminate
					console.log("positions updated :",time)
				}else{
					var index = 0 ;
					var dataOfUser ={
						username : allUsers[s].username,
						userScore : allUsers[s].score.score
					}
					position.forEach(spot => {
						if (spot.userScore < allUsers[s].score.score){
							return index 
						}
						else{
							index++
						}
					});
					position.splice(index, 0, dataOfUser);
					getSubjectPosition(biologyPosition ,allUsers[s] ,"biology")
					getSubjectPosition(mathPosition ,allUsers[s] ,"math")
					getSubjectPosition(physicsPosition ,allUsers[s] ,"physics")
					getSubjectPosition(chemistryPosition ,allUsers[s] ,"chemistry")
					getSubjectPosition(englishPosition ,allUsers[s] ,"english")
				}				
			}
		}
	})	
}
function getSubjectPosition(positionArray , user, subject){
	var subjectIndex = 0 ;
	var subjectDataOfUser ={
		username : user.username,
		userScore : user.score[subject].score
	}
	positionArray.forEach(spot =>{
		if(spot.userScore < user.score[subject].score){
			return subjectIndex
		}else{
			subjectIndex++
		}
	})
	eval(subject+"Position.splice(subjectIndex, 0, subjectDataOfUser)")
}
function mcqsInfoData(category) {
	return new Promise((resolve,reject)=>{
		var info = {}
		Mcq.find({category : category }, function (err,mcqsFound){
			if(err){
				console.log(err)
			}else{
				console.log("total mcqs "+category+" : "+ mcqsFound.length)
				for(var i = 0 ; mcqsFound.length >= i ; i++){
					if( mcqsFound.length == i){
						// termintae
						mcqsInfo[category] = info 
						resolve()
					}else{
						if( typeof info[mcqsFound[i].subject] === 'undefined'){
							info[mcqsFound[i].subject] = {}
							if(typeof  info[mcqsFound[i].subject][mcqsFound[i].chapter] === 'undefined'){
								info[mcqsFound[i].subject][mcqsFound[i].chapter] = 1
							}else{
								info[mcqsFound[i].subject][mcqsFound[i].chapter] = info[mcqsFound[i].subject][mcqsFound[i].chapter] + 1
							}
						}else{
							if(typeof  info[mcqsFound[i].subject][mcqsFound[i].chapter] === 'undefined'){
								info[mcqsFound[i].subject][mcqsFound[i].chapter] = 1
							}else{
								info[mcqsFound[i].subject][mcqsFound[i].chapter] = info[mcqsFound[i].subject][mcqsFound[i].chapter] + 1
							}
						}
					}
				}
			}
		})
	})
}
async function askingForInfo() {
	await mcqsInfoData('FUNG')
	await mcqsInfoData('GRE')
	await mcqsInfoData('MDCAT')
}
// checking if promo or plan expired 

async function checkTransactions() {
	await Transaction.find({}, async(err , foundTransactions)=>{
		date = new Date()
		if(err || !foundTransactions){
			console.log(err)
			return
		}else{
			for(var i = 0 ; foundTransactions.length >= i ; i++){
				if(foundTransactions.length == i){
					// terminate
					console.log(foundTransactions.length + " transactions")
					return
				}else{
					if(foundTransactions[i].isPromo && foundTransactions[i].varified  && (date.getDate() - new Date(foundTransactions[i].createdAt).getDate()) > 3 ) {
						console.log("an expired promo found : "+ foundTransactions[i])
						await Transaction.findById(foundTransactions[i]._id , (err, foundTransaction)=>{
							if( err || !foundTransaction){
								console.log(err)
							}else{
								foundTransaction.varified = false
								foundTransaction.statement = foundTransaction.statement.replace('used', 'expired')
								foundTransaction.save()
							}
						})
					}
				}
			}
		}
	})
}

module.exports = router ;
