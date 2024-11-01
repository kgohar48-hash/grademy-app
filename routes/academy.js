const { model } = require("../models/user");

const express			= require("express"),
	  router			= express.Router(),
	  User				= require("../models/user"),
	  Mcq			 	= require("../models/mcq"),
      newCustomQuiz		= require("../models/newCustomQuiz"),
      Academy		    = require("../models/academy"),
      Review		    = require("../models/review"),
      Quizcategory		= require("../models/quizcategory"),
      Transaction       = require("../models/transaction"),
      middelware 		= require("../middelware");

      var multer = require('multer');
      var cloudinary = require('cloudinary');

var storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter = function (req, file, cb) {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|svg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

cloudinary.config({ 
  cloud_name: 'grademy', 
  api_key: '311168857733876', 
  api_secret: 'f0BHt4UDpJExkZUNkHwnBUAHfLY'
});
// all academies index route
router.get("/academy", middelware.isLoggedIn,(req,res)=>{

    Academy.find({}).populate("reviews").exec((err , foundAcademies)=>{
        if(err){
            console.log(err)
        }else{
            var joinedStatus = new Array(foundAcademies.length).fill(false)
            var academies = []
            for(var i =0 ; foundAcademies.length >= i ; i++){
                if(foundAcademies.length == i){
                    // terminate
                    res.render("academy/index" , {academies : academies , joinedStatus : joinedStatus})
                }else{
                    if(req.user){
                        if(foundAcademies[i].level > 1 || foundAcademies[i].owner.username == req.user.username){
                            academies.push(foundAcademies[i])
                            // checking if he has joined any academy
                            req.user.myAcademies.forEach(academy =>{
                                if(String(academy)  == String(foundAcademies[i]._id)){
                                    joinedStatus[i] = true
                                }
                            })
                        }
                        
                    }
                    else{
                        if(foundAcademies[i].level > 1){
                            academies.push(foundAcademies[i])
                        }
                    }
                }
            }
        }
    })
})
// new academy form
router.get("/academy/new",middelware.isLoggedIn,(req,res)=>{
    if(req.user.isAcademy){
        res.render("academy/new")
    }else{
        res.send("you are not autherized")
    }
})
// academy route
router.post("/academy/new",middelware.isLoggedIn, upload.single('image'),function(req,res){
    if(req.user.isAcademy){
        cloudinary.uploader.upload(req.file.path, function(result) {
			req.body.academy.coverPicture = result.secure_url;
			// add author to campground
			req.body.academy.owner = {
			  id: req.user._id,
			  username: req.user.username
			}
            Academy.create(req.body.academy , (err , academyMade)=>{
                if(err){
                    console.log(err)
                }else{
                    res.redirect("/academy/"+academyMade._id)
                }
            })
        })   
    }else{
        res.send("your aur not autherized")
    }
})
router.get("/academy/:id",(req,res)=>{
    Academy.findById(req.params.id).populate("reviews").populate({
        path : 'quizcategories',
        model : 'Quizcategory'
        // populate : {
        //     path : 'quizzes',
        //     model : 'Newcustomquiz'
        // }
    }).exec((err, foundAcademy) => {
        if (err || !foundAcademy) {
            console.log(err);
        } else {
            // console.log("academy found : ",foundAcademy.academyName)
            res.render("academy/academyPortfolio", { academy: foundAcademy });
        }
    })
})
// edit academy
router.get("/academy/:id/edit",middelware.checkAcademyOwnership ,(req,res)=>{
    Academy.findById(req.params.id ,(err, foundAcademy) => {
        if (err || !foundAcademy) {
            console.log(err);
        }else{
            res.render("academy/new", { academy: foundAcademy });
        }
    })
})
router.post("/academy/:id/edit",middelware.checkAcademyOwnership, upload.single('image'),function(req,res){
    if(req.user.isAcademy){
        cloudinary.uploader.upload(req.file.path, function(result) {
			req.body.academy.coverPicture = result.secure_url;
			// add author to campground
			req.body.academy.owner = {
			  id: req.user._id,
			  username: req.user.username
            }
            Academy.findByIdAndUpdate(req.params.id , req.body.academy ,(err , academyMade)=>{
                if(err){
                    console.log(err)
                }else{
                    res.redirect("/academy")
                }
            })
        })   
    }else{
        res.send("your aur not autherized")
    }
})
router.post("/academy/:id/review",middelware.isLoggedIn,(req,res)=>{
    var newReview = {
        rating : req.body.rating,
        text : req.body.text,
        author : {
            id : req.user._id,
            username : req.user.username
        }
    }
    Review.create(newReview , (err , reviewMade)=>{
        if(err){
            console.log(err)
        }else{
            Academy.findById(req.params.id , (err,foundAcademy)=>{
                if(err || !foundAcademy){
                    console.log(err)
                }else{
                    foundAcademy.reviews.push(reviewMade)
                    foundAcademy.save()
                    res.redirect("/academy/"+foundAcademy._id)
                }
            })
        }
    })
})
// testing has to be done
router.post("/academy/join",middelware.isLoggedIn,(req,res)=>{
    User.findById(req.user._id,(err,foundUser)=>{
        if(err || !foundUser){
            console.log(err)
        }else{
            foundUser.myAcademies.push(req.body.academyId)
            Academy.findById(req.body.academyId , (err , foundAcademy)=>{
                if(err || !foundUser){
                    console.log("academy finding error in joined academy")
                }else{
                    foundAcademy.students.push(foundUser._id)
                    foundAcademy.save()
                    foundUser.save()
                    res.redirect("/academy");
                }
            })
        }
    })
})
// testing has to be done
router.post("/academy/leave",middelware.isLoggedIn,async (req,res)=>{
    await User.findById(req.user._id, async (err,foundUser)=>{
        if(err || !foundUser){
            console.log(err)
        }else{
            var userCounter = foundUser.myAcademies.length 
            for(var i = 0 ; userCounter>= i ; i++){
                if(userCounter == i){
                    // terminate
                    await Academy.findById(req.body.academyId , (err , foundAcademy)=>{
                        if(err || !foundAcademy){
                            console.log("academy finding error in joined academy")
                        }else{
                            var academyCounter = foundAcademy.students.length
                            for(var j = 0 ; academyCounter >= j ; j++){
                                if(academyCounter == j){
                                    foundAcademy.save()
                                    foundUser.save()
                                    res.redirect("/academy");
                                }else{
                                    if(toString(foundUser._id)  == toString(foundAcademy.students[j])){
                                        foundAcademy.students.splice(j, 1);
                                        j = academyCounter - 1
                                    }
                                }
                            }
                        }
                    })
                }else{
                    if(toString(foundUser.myAcademies[i]) == toString(req.body.academyId)){
                        foundUser.myAcademies.splice(i, 1);
                        i = userCounter - 1
                    }
                }
            }
        }
    })
})
// new quiz section
// add a middlewear to check ownership
router.post("/academy/:id/section",middelware.checkAcademyOwnership,async (req,res)=>{
    var newQuizCategory = {
        title : req.body.title,
        description : req.body.description
    }
    Quizcategory.create(newQuizCategory , (err , quizCategoryMade)=>{
        if(err){
            console.log(err)
        }else{
            quizCategoryMade.owner.username = req.user.username
            quizCategoryMade.owner.id = req.user
            Academy.findById(req.params.id,(err,foundAcademy)=>{
                if(err || !foundAcademy){
                    console.log(err)
                }else{
                    foundAcademy.quizcategories.push(quizCategoryMade)
                    quizCategoryMade.academy = foundAcademy
                    foundAcademy.save()
                    quizCategoryMade.save()
                    res.redirect("/academy/section/"+foundAcademy._id+"/"+quizCategoryMade._id)
                }
            })
        }
    })
})
// academy quizzes
router.get("/academy/section/:id/:section",middelware.isLoggedIn,async (req,res)=>{
    // fix it here and in the quiz redirect as well
    req.session.section = req.originalUrl
    Academy.findById(req.params.id).populate({
        path : 'quizcategories',
        model : 'Quizcategory',
        populate : {
            path : 'quizzes',
            model : 'Newcustomquiz'
        }
    }).exec((err, foundAcademy) => {
        if (err || !foundAcademy) {
            console.log(err);
        } else {
            res.render("academy/academyquizzes", { academy: foundAcademy, section : req.params.section });
        }
    })
})
// academy quiz edit
router.get("/academy/quiz/:id/edit",middelware.checkQuizOwnership,(req,res)=>{
	newCustomQuiz.findById(req.params.id).populate("mcqs").exec(function(err , foundQuiz){
        if(err || !foundQuiz){
            console.log(err)
            res.send("you are not authorized")
        }else{
            
            if(req.user.username == foundQuiz.madeBy ){
                res.render("academy/editquiz" , {quiz : foundQuiz})
            }else{
                res.send("you are not authorized")
            }
        }
    })
})
router.post("/academy/quiz/:id/edit",middelware.checkQuizOwnership,(req,res)=>{
    newCustomQuiz.findById(req.params.id,(err,foundQuiz)=>{
        if(err || !foundQuiz){
            console.log(err)
        }else{
            if(req.user.username == foundQuiz.madeBy ){
                foundQuiz.description           = req.body.quiz.description
                foundQuiz.lectureVideoURL       = req.body.quiz.lectureVideoURL
                foundQuiz.discussionVideoURL    = req.body.quiz.discussionVideoURL
                foundQuiz.shareWith             =req.body.quiz.shareWith
                foundQuiz.save()
                res.redirect("/dashboard/quiz/redirect/"+foundQuiz._id)
            }else{
                res.send("you are not authorized")
            }
        }
    })
})
// students feedback
router.get("/academy/feedback/:id",middelware.isLoggedIn , (req,res)=>{
    res.render("academy/feedbackform" , {academyId : req.params.id})
})
router.post("/academy/feedback/:id",middelware.isLoggedIn , (req,res)=>{
    // check if that students has already given a feedback
    var feedbackGiven = false ;
    Academy.findById(req.params.id , (err , foundAcademy)=>{
        if(err || !foundAcademy){
            console.log(err)
        }else{
            for(var i=0;foundAcademy.feedback.givenBy.length >= i ; i++ ){
                if(foundAcademy.feedback.givenBy.length == i ){
                    // terminate
                    if(feedbackGiven){
                        // deleting the previuos response
                        res.send("you have already given response")
                    }else{
                        foundAcademy.feedback.givenBy.push({
                            id : req.user,
                            response : req.body
                        })
                        foundAcademy.feedback.funFactor.push(Number(req.body[0]))
                        foundAcademy.feedback.energy.push(Number(req.body[1]))
                        foundAcademy.feedback.subjectGrip.push(Number(req.body[2]))
                        foundAcademy.feedback.teachingMethod.push(Number(req.body[3]))
                        foundAcademy.feedback.lecturesQuality.push(Number(req.body[4]))
                        foundAcademy.feedback.studentSatisfaction.push(Number(req.body[5]))
                        foundAcademy.save()
                        return
                    }
                }else{
                    if(foundAcademy.feedback.givenBy[i].id == req.user._id){
                        feedbackGiven = true
                    }
                }
            }
        }
    })
})
// academy analytics render
router.get("/academy/analytics/stats/:id",(req,res)=>{
    Academy.findById(req.params.id , (err,foundAcademy)=>{
        if(err || !foundAcademy){
            console.log(err)
        }else{
            if(req.user.username == foundAcademy.owner.username || req.user.isAdmin){
                res.render("academy/analytics",{id : req.params.id})
            }
        }
    })
})
// switch student account into teaching account
router.get("/academy/switch/toteacher",middelware.isLoggedIn,(req,res)=>{
    User.findById(req.user._id,(err, foundUser)=>{
        if(err || !foundUser){
            console.log(err)
        }else{
            if(foundUser.isAcademy){
                foundUser.isAcademy = false
                req.flash("success" , foundUser.name +" you have switched to student account" )
            }else{
                foundUser.isAcademy = true
                req.flash("success" , foundUser.name +" you have switched to teaching account" )
            }
            foundUser.save()
            res.redirect("/academy")
        }
    })
})
// dummy route to redirect user after submitting feedbakc
router.post("/academy/dummy/:id",middelware.isLoggedIn,(req,res)=>{
    dataToBePassed = req.body
    res.redirect("/academy/"+req.params.id)
})
// all academies data api
router.get("/academies/api",(req,res)=>{
    Academy.find({}).populate("reviews").exec((err , foundAcademies)=>{
        if(err){
            console.log(err)
        }else{
            res.json(foundAcademies)
        }
    })
})
// specific academy data api
router.get("/academy/api/:id",(req,res)=>{
    console.log("academy api hit")
    Academy.findById(req.params.id).populate("reviews").populate({
        path : 'quizcategories',
        model : 'Quizcategory',
        populate : {
            path : 'quizzes',
            model : 'Newcustomquiz'
        }
    }).exec((err, foundAcademy) => {
        if (err || !foundAcademy) {
            console.log(err);
        } else {
            console.log("academy found")
            if(req.user != null){
                res.json({
                    academy : foundAcademy,
                    user : req.user
                })
            }else{
                res.json({
                    academy : foundAcademy,
                    user : null
                })
            }
        }
    })
})
// academy analytics api
router.get("/academy/analytics/:id",(req,res)=>{
    Academy.findById(req.params.id).populate({
        path : 'quizcategories',
        model : 'Quizcategory',
        populate : {
            path : 'quizzes',
            model : 'Newcustomquiz'
        }
    }).exec((err, foundAcademy) => {
        if (err || !foundAcademy) {
            console.log(err);
        } else {
            console.log("academy found")
            if(req.user.username == foundAcademy.owner.username || req.user.isAdmin){
                User.find({ref : foundAcademy.owner.username},(err , foundRefs)=>{
                    if(err || !foundRefs){
                        console.log(err)
                    }else{
                        console.log("invitee found")
                        User.findOne({username : foundAcademy.owner.username}).populate({
                            path : 'transactions',
                            model : "Transaction"
                        }).exec((err , foundOwner)=>{
                            if(err || !foundOwner){
                                console.log(err)
                            }else{
                                console.log("transactions found")
                                res.json({
                                    refs : {
                                        createdAt : foundRefs.map((ref)=>{return ref.createdAt})
                                    },
                                    quizCategories : foundAcademy.quizcategories,
                                    transactions : foundOwner.transactions
                                })
                            }
                        })
                    }
                })
            }else{
                res.json({})
            }
            
        }
    })
})
// quiz attempt data for academy
router.get("/academy/quizcategory/attempt/:id",(req,res)=>{
	quizcategory.findById(req.params.id).populate({
		path : 'quizzes',
		model : 'Newcustomquiz'
	}).exec(async(err, foundCategory)=>{
		if(err || !foundCategory){
			console.log(err)
		}else{
			dateData = []
			console.log("yo")
			for(var i = 0 ; i <= foundCategory.quizzes.length ; i++){
				if(i == foundCategory.quizzes.length){
					res.send(dateData)
				}else{
					console.log("quiz complete")

					await fetchQuizDates(foundCategory.quizzes[i])
				}
			}
		}
	})
})

function fetchQuizDates(quiz) {
	return new Promise((resolve,reject)=>{
		if(quiz.solvedBy.length != 0){
			for(var j = 0; j <= quiz.solvedBy.length; j++){
				if(j == quiz.solvedBy.length){
					resolve()
				}else{
					console.log(dateData.length)
					dateData.push(quiz.solvedBy[j].date)
				}
			}
		}else{
			resolve()
		}
	})
}
module.exports = router ;
