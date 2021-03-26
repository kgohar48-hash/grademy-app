var express 		= require("express");
var router  		= express.Router();
var Mcq		 		= require("../models/mcq");
var User 			= require("../models/user");
var newCustomQuiz   = require("../models/newCustomQuiz");
var randomstring	= require("randomstring");
// fake users route
router.get("/fakequizattemts",function (req,res) {
	res.render("user/fakeuser")
})
// attempting quiz but not changing the mcq data
router.post("/fakequizattemts",function (req,res) {
	fakingStuff(req.body.quizId , req.body.attempts)
	res.send("on it boss")
	function fakingStuff(quizId , attempts){
	
		newCustomQuiz.findById(quizId , function (err,foundQuiz) {
			if(err){
				console.log(err)
			}else{
				User.find({ref : "new" } ,async (err , fakeusers)=>{
					if(err){
						console.log(err)
					}else{
						console.log("number of fake people : ",fakeusers.length)
						for(var k = 0 ; attempts > k ; k++){
							data = {
								username : '',
								userScore : '',
								key : [] ,
								keyOfCorrectness : [],
								timeForEachMcq : []
							}
							console.log("attempt : ",k)
							await fakeattempt(fakeusers[k] )
							console.log("quiz solved")
							await fakesubmittion(data)
							console.log("quiz submitted")
	
						}
					}
				})
				function fakeattempt(user){
					try {
						return new Promise((resolve , rejects)=>{
							data.username = user.username 
							data.quizId = foundQuiz._id
							for(var j = 0 ; foundQuiz.mcqs.length >= j ; j++){
								if(foundQuiz.mcqs.length == j){
									data.userScore = data.keyOfCorrectness.reduce(add,0)
									function add(accumulator, a) {
										return accumulator + a;
									}
									resolve()
								}else{
									probability = (Math.floor(Math.random() * 10))
									if(probability > 6 ){
										data.key[j] = (Math.floor(Math.random() * 4))
									}else{
										data.key[j] = foundQuiz.mcqs[j].answer
									}
									data.timeForEachMcq.push(Math.floor(Math.random() * 20))
									if(data.key[j] == foundQuiz.mcqs[j].answer){
										data.keyOfCorrectness.push(4)
									}if(data.key[j] == 0){
										data.keyOfCorrectness.push(0)
									}if(data.key[j]  != foundQuiz.mcqs[j].answer & data.key[j] != 0){
										data.keyOfCorrectness.push(-1)
									}
								}
							}
						})
					} catch (reject) {
						console.log(reject)
					}
				}
				function fakesubmittion(dataa){
					try {
						return new Promise(async (resolve , rejects)=>{	
							req.body = dataa
							dataFromQuiz = {
								username : req.body.username,
								userScore : req.body.userScore,
								key : req.body.key ,
								keyOfCorrectness : req.body.keyOfCorrectness,
								timeForEachMcq : req.body.timeForEachMcq
							}
						
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
							await User.findOne({username  : dataa.username} ,async function(err , foundUser){
								if(err){
									console.log("error in finding user",err)
								}else{
									// updating each mcq stats & user data
									for(var j = 0 ; foundQuiz.mcqs.length >= j ; j++){
										if(foundQuiz.mcqs.length == j){
											//terminate
											foundUser.save()
											foundQuiz.save()
											console.log("user solved ", foundUser.username)
											resolve()
										}else{
											await Mcq.findById(foundQuiz.mcqs[j] ,async function(err , foundMcq){
												if(err){
													console.log(err)
												}else{
													foundUser.score.attempted++
													foundUser.score[foundMcq.subject].attempted++
													foundUser.score[foundMcq.subject].keyOfCorrectness.push(dataFromQuiz.keyOfCorrectness[j])
													// keyOf correctness chopping
													if(foundUser.score[foundMcq.subject].keyOfCorrectness.length > foundUser.score[foundMcq.subject].maxKeyLength){
														choppedElement = foundUser.score[foundMcq.subject].keyOfCorrectness.shift()
														if (choppedElement == 4){
															foundUser.score[foundMcq.subject].score -= 4 ;
															foundUser.score.score -=4 ;
														}
														if(choppedElement == -1 ){
															foundUser.score[foundMcq.subject].score += 1 ;
															foundUser.score.score += 1;
														}
													}
													if(dataFromQuiz.keyOfCorrectness[j] == 4 ){
														// updating user data
														foundUser.score.score +=4
														foundUser.score[foundMcq.subject].score +=4
														updateChapterData("correct")
													}
													if(dataFromQuiz.keyOfCorrectness[j] == -1 ){
														// updating user data
														foundUser.score.score -=1
														foundUser.score[foundMcq.subject].score -=1
															updateChapterData("incorrect")
													}
													if(dataFromQuiz.keyOfCorrectness[j] == 0 ){
														// updating user data
															updateChapterData( "skipped")
													}
													// updating history of student & change later for academies custom dashboard
													if (foundUser.score.attempted%50 == 0){
														foundUser.score.history.push({
															x : foundUser.score.attempted ,
															y : foundUser.score.score 
														})
													}
													if (foundMcq.subject == "biology" || foundMcq.subject == "math"){
														if(foundUser.score[foundMcq.subject].attempted%30 == 0){
															foundUser.score[foundMcq.subject].history.push({
																x : foundUser.score[foundMcq.subject].attempted ,
																y : foundUser.score[foundMcq.subject].score
															})
														}
													}
													if(foundMcq.subject == "physics"){
														if(foundUser.score[foundMcq.subject].attempted%20 == 0){
															foundUser.score[foundMcq.subject].history.push({
																x : foundUser.score[foundMcq.subject].attempted ,
																y : foundUser.score[foundMcq.subject].score
															})
														}
													}
													if(foundMcq.subject == "chemistry"){
														if(foundUser.score[foundMcq.subject].attempted%20 == 0){
															foundUser.score[foundMcq.subject].history.push({
																x : foundUser.score[foundMcq.subject].attempted ,
																y : foundUser.score[foundMcq.subject].score
															})
														}
													}
													if(foundMcq.subject == "english"){
														if(foundUser.score[foundMcq.subject].attempted%10 == 0){
															foundUser.score[foundMcq.subject].history.push({
																x : foundUser.score[foundMcq.subject].attempted ,
																y : foundUser.score[foundMcq.subject].score
															})
														}
													}
													// chopping history
													if(foundUser.score.history.length > 20){
														foundUser.score.history.shift()
													}
													if(foundUser.score[foundMcq.subject].history.length > 20){
														foundUser.score[foundMcq.subject].history.shift()
													}
													// updating chapter data
														function updateChapterData(correctness) {
														if(typeof foundUser.score[foundMcq.subject].chapters == 'undefined'){
															foundUser.score[foundMcq.subject].chapters = foundUser.score[foundMcq.subject].chapters || {}
														}
														if(typeof foundUser.score[foundMcq.subject].chapters[foundMcq.chapter] == "undefined"){
															// if he doesn't
															foundUser.score[foundMcq.subject].chapters[foundMcq.chapter] = {correct : 0 , incorrect : 0 , skipped : 0}
															foundUser.score[foundMcq.subject].chapters[foundMcq.chapter][correctness]++
														}else{
															// if student has previusly solved any mcq from that chapter
															foundUser.score[foundMcq.subject].chapters[foundMcq.chapter][correctness]++
														}
														
													}
												}
											})
										}
									}
								}
							})
						})
					} catch (reject) {
						console.log(reject)
					}
				}
			}
		})
	}
})
// attempting quiz but  changing the mcq data
router.post("/fakequizattemtsmcq",function (req,res) {
	fakingStuff(req.body.quizId , req.body.attempts)
	res.send("on it boss full bot")
	function fakingStuff(quizId , attempts){
		newCustomQuiz.findById(quizId).populate("mcqs").exec(function (err,foundQuiz) {
			if(err){
				console.log(err)
			}else{
				User.find({ref : "new" } ,async (err , fakeusers)=>{
					if(err){
						console.log(err)
					}else{
						console.log("number of fake people : ",fakeusers.length)
						for(var k = 0 ; attempts > k ; k++){
							data = {
								username : '',
								userScore : '',
								key : Array(foundQuiz.mcqs.length).fill(["0"]) ,
								keyOfCorrectness : Array(foundQuiz.mcqs.length).fill(0),
								timeForEachMcq : []
							}
							console.log("attempt : ",k)
							await fakeattempt(fakeusers[k] )
							console.log("quiz solved")
							await fakesubmittion(data)
							console.log("quiz submitted")
	
						}
					}
				})
				function fakeattempt(user){
					try {
						return new Promise((resolve , rejects)=>{
							data.username = user.username 
							data.quizId = foundQuiz._id
							for(var j = 0 ; foundQuiz.mcqs.length >= j ; j++){
								if(foundQuiz.mcqs.length == j){
									data.userScore = data.keyOfCorrectness.reduce(add,0)
									function add(accumulator, a) {
										return accumulator + a;
									}
									resolve()
								}else{
									probability = (Math.floor(Math.random() * 10))
									if(probability > 6 ){
										data.key[j] = [(Math.floor(Math.random() * 4)).toString()]
									}else{
										data.key[j] = foundQuiz.mcqs[j].answer
									}
									data.timeForEachMcq.push(Math.floor(Math.random() * 20))
									if(data.key[j] == foundQuiz.mcqs[j].answer){
										data.keyOfCorrectness[j] = (Number(4))
									}if(data.key[j] == 0){
										data.keyOfCorrectness[j] = (Number(0))
									}if(data.key[j]  != foundQuiz.mcqs[j].answer & data.key[j] != 0){
										data.keyOfCorrectness[j] = (Number(-1))
									}
								}
							}
						})
					} catch (reject) {
						console.log(reject)
					}
				}
				function fakesubmittion(dataa){
					try {
						return new Promise(async (resolve , rejects)=>{	
							req.body = dataa
							dataFromQuiz = {
								username : req.body.username,
								userScore : req.body.userScore,
								key : req.body.key ,
								keyOfCorrectness : req.body.keyOfCorrectness,
								timeForEachMcq : req.body.timeForEachMcq
							}
						
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
											await User.findByIdAndUpdate(foundUser._id,foundUser, function(err,userToBeUpdated){
												if(err){
													console.log(err)
												}
											})
											foundQuiz.save()
											resolve()
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
							
						})
					} catch (reject) {
						console.log(reject)
					}
				}
			}
		})
	}
})
// making fake users
// signup logic
router.get("/makingfakeusers" ,async function(req,res){
	MDCATstudentsContactInfo = [
		{ username: 'saud64', phone: '03028185213' },
		{ username: 'afaq', phone: '03348898968' },
		{ username: 'Aroosa', phone: '03032988271' },
		{ username: 'Dawood', phone: '03084886809' },
		{ username: 'Koki', phone: '03415546937' },
		{ username: 'Zia ', phone: '03468712383' },
		{ username: 'Fatima', phone: '03236113512' },
		{ username: 'Heidi', phone: '03049170495' },
		{ username: 'Sagar', phone: '03062664240' },
		{ username: 'Izainab', phone: '03074651881' },
		{ username: 'Areesha', phone: '03316060163' },
		{ username: 'ahmad', phone: '03045632491' },
		{ username: 'Usama', phone: '03347536584' },
		{ username: 'talha', phone: '03338973112' },
		{ username: 'Imfqkhan', phone: '03475942787' },
		{ username: 'Shakeel', phone: '03045112960' },
		{ username: 'Bilal', phone: '03176330626' },
		{ username: 'Rehan', phone: '03056435123' },
		{ username: 'Ali', phone: '03017087123' },
		{ username: 'Ihtisham', phone: '03181837682' },
		{ username: 'Khadija', phone: '03136938838' },
		{ username: 'Dasti', phone: '03154936606' },
		{ username: 'Imran', phone: '03047515784' },
		{ username: 'tqhhqq', phone: '03168543046' },
		{ username: 'Farhad', phone: '03486295243' },
		{ username: 'Munib', phone: '03180752289' },
		{ username: 'Mahàm', phone: '03098837268' },
		{ username: 'Armaghan', phone: '03317002644' },
		{ username: 'Ali', phone: '03360512279' },
		{ username: 'Maida', phone: '03025704339' },
		{ username: 'Salman', phone: '03479668211' },
		{ username: 'zainab', phone: '03125016056' },
		{ username: 'mahgul', phone: '03315024447' },
		{ username: 'Namna', phone: '03365680085' },
		{ username: 'Saad', phone: '03057302924' },
		{ username: 'Abbas', phone: '03331585453' },
		{ username: 'manahil', phone: '03135173772' },
		{ username: 'Shiza', phone: '03174825050' },
		{ username: 'Noorulain', phone: '03099718259' },
		{ username: 'ahmad', phone: '03000036008' },
		{ username: 'omaama', phone: '03085134764' },
		{ username: 'Sameen', phone: '03346571189' },
		{ username: 'Asjad', phone: '03249497976' },
		{ username: 'sarmad', phone: '03039828283' },
		{ username: 'Arslan', phone: '03074114642' },
		{ username: 'Eman', phone: '03130975121' },
		{ username: 'Shery', phone: '03357507448' },
		{ username: 'malik', phone: '03447119151' },
		{ username: 'jaziba', phone: '03165452195' },
		{ username: 'Maliha ', phone: '03352600034' },
		{ username: 'Nimrah', phone: '03445291597' },
		{ username: 'Khadija', phone: '03096814156' },
		{ username: 'Aimen', phone: '03328566923' },
		{ username: 'amina', phone: '03318087475' },
		{ username: 'mxhvimin', phone: '03324254555' },
		{ username: 'Hasankhan', phone: '03003336709' },
		{ username: 'NAVEED', phone: '03114148995' },
		{ username: 'zoha', phone: '03245158122' },
		{ username: 'fatimaah', phone: '03481800071' },
		{ username: 'Hamza', phone: '03009684566' },
		{ username: 'Sameeen', phone: '03150592630' },
		{ username: 'Abdullah', phone: '03058992255' },
		{ username: 'HAFSAH', phone: '03160057443' },
		{ username: 'Fariah', phone: '03339520178' },
		{ username: 'AbDeR', phone: '03457426868' },
		{ username: 'laiba', phone: '03315964056' },
		{ username: 'Maryam', phone: '03326799994' },
		{ username: 'Kinza', phone: '03152620290' },
		{ username: 'Azka', phone: '03325149625' },
		{ username: 'mudasser', phone: '03326805169' },
		{ username: 'Jiya', phone: '03004240181' },
		{ username: 'Amna', phone: '03150170067' },
		{ username: 'Mishkat', phone: '03158164127' },
		{ username: 'Haider', phone: '03368966663' },
		{ username: 'mehwiish', phone: '03160750871' },
		{ username: 'Zubi', phone: '03124299852' },
		{ username: 'mehwish', phone: '03488827048' },
		{ username: 'Ebad', phone: '03335574086' },
		{ username: 'Alina', phone: '03313122201' },
		{ username: 'Hamza', phone: '03354862689' },
		{ username: 'Bilal', phone: '03104899424' },
		{ username: 'Sajjad', phone: '03325158553' },
		{ username: 'Bilal', phone: '03227076224' },
		{ username: 'Ishtiaq', phone: '03009512064' },
		{ username: 'naumi', phone: '03056979970' },
		{ username: 'Sallu', phone: '03176520342' },
		{ username: 'Shahid', phone: '03366036231' },
		{ username: 'Memoona', phone: '03410880976' },
		{ username: 'Minhaj', phone: '03059441257' },
		{ username: 'fz', phone: '03355500603' },
		{ username: 'Mavra', phone: '03166228196' },
		{ username: 'Lash65', phone: '03142976306' },
		{ username: 'Ahmar', phone: '03468839710' },
		{ username: 'usman', phone: '03096077533' },
		{ username: 'Saad', phone: '03366886550' },
		{ username: 'karim', phone: '03109484359' },
		{ username: 'Alipuri', phone: '03316659184' },
		{ username: 'Akatsuki', phone: '03036648289' },
		{ username: 'Zubair', phone: '03012241666' },
		{ username: 'Sarfraz', phone: '03113858998' },
		{ username: 'Zarbakhat', phone: '03332314925' },  
		{ username: 'Furqan', phone: '03178370627' },       
		{ username: 'abdullah', phone: '03027424901' },  
		{ username: 'Shuaib', phone: '03554301155' },      
		{ username: 'Saleem', phone: '03057221624' },
		{ username: 'arsalan', phone: '03145761858' },      
		{ username: 'Junaid ', phone: '03215328181' },       
		{ username: 'Saliha', phone: '03058938525' },
		{ username: 'Huma', phone: '03129171557' },
		{ username: 'Ayesha', phone: '03185233290' },
		{ username: 'Muqadas', phone: '03034973918' },
		{ username: 'hassan', phone: '03035683367' },
		{ username: 'Hamna', phone: '03349502636' },
		{ username: 'muqaddas', phone: '03058651323' },
		{ username: 'Muqadas', phone: '03416095477' },
		{ username: 'iaqsa', phone: '03065260726' },
		{ username: 'Areeba', phone: '03055120970' },
		{ username: 'imrana', phone: '03020951374' },
		{ username: 'Faiq ', phone: '03421698606' },
		{ username: 'NK', phone: '03360056674' },
		{ username: 'nimra', phone: '03359843701' },
		{ username: 'REHMAN', phone: '03355690159' },
		{ username: 'Sadia', phone: '03068227548' },
		{ username: 'Arooba', phone: '03015776268' },
		{ username: 'Fatymahk', phone: '03095191124' },
		{ username: 'asma', phone: '03344844599' },
		{ username: 'Fatymah', phone: '03095101124' },
		{ username: 'Uzair', phone: '03188195902' },
		{ username: 'Samreen', phone: '03215559506' },
		{ username: 'Mannu', phone: '03352345234' },
		{ username: 'Maryam ', phone: '03418961182' },
		{ username: 'Areeba', phone: '03092934724' },
		{ username: 'saima', phone: '03165113168' },
		{ username: 'Aaau', phone: '03365195480' },
		{ username: 'farhanw', phone: '03181411306' },
		{ username: 'Iqra', phone: '03329234348' },
		{ username: 'SOhaib', phone: '03007677429' },
		{ username: 'osamati', phone: '03464440000' },
		{ username: 'kainat', phone: '03099956889' },
		{ username: 'Arooba ', phone: '03185270095' },
		{ username: 'Aneela', phone: '03114971101' },
		{ username: 'Amjad', phone: '03033903015' },
		{ username: 'zahra', phone: '03168316360' },
		{ username: 'Umair', phone: '03087468187' },
		{ username: 'Basim', phone: '03035675043' },
		{ username: 'ayesh', phone: '03058576096' },
		{ username: 'Maryam', phone: '03007282384' },
		{ username: 'azfar', phone: '03316141613' },
		{ username: 'Fatima', phone: '03360047163' },
		{ username: 'akram', phone: '03006043159' },
		{ username: 'Saliha', phone: '03045315527' },
		{ username: 'Azizi', phone: '03323354567' },
		{ username: 'Fazle', phone: '03329652536' },
		{ username: 'abdulahad', phone: '03360585748' },
		{ username: 'Tayyab', phone: '03118809699' },
		{ username: 'saif', phone: '03175080468' },
		{ username: 'Tabish', phone: '03009548166' },
		{ username: 'Mohid', phone: '03133009700' },
		{ username: 'Kashaf', phone: '03362136811' },
		{ username: 'Kainat', phone: '03432894331' },
		{ username: 'Komal', phone: '03362208877' },
		{ username: 'fizza', phone: '03244032489' },
		{ username: 'Haiqa', phone: '03234977263' },
		{ username: 'Muqadas', phone: '03423617708' },
		{ username: 'Waqar', phone: '03086131454' },
		{ username: 'Fehmina', phone: '03554504145' },
		{ username: 'Saleem', phone: '03176710012' },
		{ username: 'Mustafa', phone: '03434753648' },
		{ username: 'Zainab', phone: '03206242871' },
		{ username: 'Manahil', phone: '03408770400' },
		{ username: 'Zunair', phone: '03246323794' },
		{ username: 'Hassan', phone: '03414444400' },
		{ username: 'Farya', phone: '03219520178' },
		{ username: 'Saif', phone: '03318154161' },
		{ username: 'Misbah', phone: '03305867826' },
		{ username: 'Hafsa', phone: '03049317633' },
		{ username: 'Nouman', phone: '03000855849' },
		{ username: 'iqra', phone: '03418115321' },
		{ username: 'Ali', phone: '03243215215' },
		{ username: 'Ahmar', phone: '03076614612' },
		{ username: 'Ahmad', phone: '03146133765' },
		{ username: 'Reeha', phone: '03201677523' },
		{ username: 'Tayyaba', phone: '03481860623' },
		{ username: 'Ali', phone: '03370443869' },
		{ username: 'Aayan', phone: '03085066572' },
		{ username: 'Hamza', phone: '03085037137' },
		{ username: 'Umer', phone: '03057343913' },
		{ username: 'Maryam', phone: '03234261136' },
		{ username: 'KHUSH', phone: '03464191375' },
		{ username: 'Furqan', phone: '03094226023' },
		{ username: 'Kamran', phone: '03356635557' }
	]
	if(req.user.isAdmin){
		for(var i = 62 ; MDCATstudentsContactInfo.length >= i ; i++){
			if(MDCATstudentsContactInfo.length == i){
				res.send("done : ",i)
			}else{
				console.log(i)
				await makefakeusers({
					ref : "new" ,
					name : MDCATstudentsContactInfo[i].username + randomstring.generate(1),
					username : MDCATstudentsContactInfo[i].username + randomstring.generate(1),
					email : MDCATstudentsContactInfo[i].username + randomstring.generate(3)+"@gmail.com",
					phone : Math.floor(Math.random() * 100000000),
					city : "USS",
					category : "MDCAT",
					password : "pass"			
				})
			}
		}
	}else{
		res.send("route not found")
	}
	function makefakeusers(data ) {
		try {
			return new Promise((resolve , rejects)=>{
				req.body = data ;
				var token = randomstring.generate(5)
				if(!req.body.ref){
					var reference = 'kgohar48'
				}else{
					var reference = req.body.ref
				}
				var newUser = new User({
					username : req.body.username ,
					name : req.body.name,
					token : token,
					email : req.body.email,
					phone : req.body.phone,
					city : req.body.city,
					ref : reference,
					category : req.body.category
				})
				var newPassword = req.body.password
				User.register(newUser , newPassword , function(err,user){
					if(err){
						console.log(err)
						res.redirect("/signup")		
					}
					else{	
						console.log("signed up : ",user.username)
						resolve()
					}
				})
			})
		} catch (reject) {
			console.log(reject)
		}
	}
})
// score fix
router.get("/scorefix",(req,res)=>{
	User.find({},async (err , allUsers)=>{
		if(err || !allUsers){
			console.log(err)
		}else{
			for(var i = 0 ; allUsers.length >= i ; i++){
				if(allUsers.length == i){
					// terminate
					res.send("done")
				}else{
					await User.findById(allUsers[i]._id ,async (err , foundUser)=>{
						if(err || !foundUser){
							console.log(err)
						}else{
							foundUser.score.biology.score = await sumScore(foundUser.score.biology.keyOfCorrectness)
							foundUser.score.math.score = await sumScore(foundUser.score.math.keyOfCorrectness)
							foundUser.score.physics.score = await sumScore(foundUser.score.physics.keyOfCorrectness)
							foundUser.score.chemistry.score = await sumScore(foundUser.score.chemistry.keyOfCorrectness)
							foundUser.score.english.score = await sumScore(foundUser.score.english.keyOfCorrectness)
							foundUser.score.score = foundUser.score.biology.score + foundUser.score.math.score + foundUser.score.physics.score + foundUser.score.chemistry.score + foundUser.score.english.score 
							console.log(i+" : "+foundUser.score.score)
							foundUser.save()
						}
					})
				}
			}
		}
	})

	async function sumScore(arr){
		try {
			return new Promise((resolve, reject) => {
				var sum = 0;
				for (var j = 0; arr.length >= j; j++) {
					if (arr.length == j) {
						resolve(sum);
					} else {
						if (typeof (arr[j]) == "number") {
							sum = sum + arr[j];
						}else{
							console.log("num fixed")
							arr.set(j, Number(arr[j]) )
						}
					}
				}
			});
		} catch (reject_1) {
			console.log(reject_1);
		}
	}
})


module.exports = router ;