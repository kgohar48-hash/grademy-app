var express     = require("express");
var router      = express.Router();
var middelware  = require("../middelware");
var Mcq		 	= require("../models/mcq");
var User        = require("../models/user");
var Comment     = require("../models/comment")
var Post        = require("../models/post")
var newCustomQuiz = require("../models/newCustomQuiz")
const { Model } = require("mongoose");

router.get("/dashboard/mcqs/:correctness/:id", middelware.isLoggedIn,(req,res)=>{
    res.render("dashboard/mcqs/display",{correctness : req.params.correctness , id:req.params.id})
})
// send mcq
router.get("/mcq/send/:id/:selected",middelware.isLoggedIn, (req,res)=>{
    Mcq.findById(req.params.id, (err, foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
            var isSolved = false
            var index = foundMcq.solvedBy.length
            for(var i = 0 ; i <= index ; i++){
                if(i == index){
                    if(!isSolved){
                        foundMcq.userResponse.set(Number(req.params.selected), foundMcq.userResponse[Number(req.params.selected)] + 1 )
                        foundMcq.solvedBy.push({
                            id : req.user ,
                            username : req.user.username,
                            attempted : [[req.params.selected]]
                        })
                        foundMcq.save()
                    }
                }else{
                    if(foundMcq.solvedBy[i].username == req.user.username){
                        isSolved = true
                    }
                }
            }
            res.json(foundMcq)
        }
    })
})
// mcq post by students
router.get("/mcq/post",middelware.isLoggedIn,(req,res)=>{
    res.render("dashboard/mcqs/postmcq")
})
// post route for mcq by student
router.post("/mcq/post",middelware.isLoggedIn,(req,res)=>{
    var mcqByStudent = {
        category : req.user.category ,
        type : 4100,
        subject : req.body.mcq.subject,
        chapter : req.body.mcq.chapter ,
        postedBy : req.user.username,
        question : req.body.mcq.question,
        choice :req.body.mcq.choice,
        answer : [req.body.mcq.answer],
        userResponse : [0,0,0,0,0],
        solution : req.body.mcq.solution
    }
    Mcq.create(mcqByStudent,(err, mcqMade)=>{
        if(err){
            console.log(err)
        }else{
            Post.create({
                author : {
                    id : req.user,
                    username : req.user.username
                },
                mcq : mcqMade
            },(err,postMade)=>{
                if(err){
                    console.log(err)
                }else{
                    User.findById(req.user._id , (err,foundUser)=>{
                        if(err || !foundUser){
                            console.log(err)
                        }else{
                            foundUser.myPosts.push(postMade)
                            foundUser.save()
                            res.redirect('/newsfeed' );
                        }
                    })
                }
            })
        }
    })
})
// get route for edit
router.get("/mcq/edit/:id", middelware.isLoggedIn,(req,res)=>{
    Mcq.findById(req.params.id,(err,foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
            if(foundMcq.postedBy == req.user.username){
                res.render("dashboard/mcqs/edit", {mcq : foundMcq})
            }else{
                req.flash("error", "The mcq you are trying to edit isn't owned by you !!!")
                res.redirect("/academy")
            }
        }
    })
})
// post route for edit
router.post("/mcq/edit/:id",middelware.isLoggedIn, middelware.isLoggedIn ,(req,res)=>{
    Mcq.findById(req.params.id , (err,foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
            if(foundMcq.postedBy == req.user.username){
                foundMcq.question = req.body.mcq.question
                foundMcq.choice = req.body.mcq.choice
                foundMcq.answer.set(0 , req.body.mcq.answer)
                foundMcq.save()
                res.redirect("/mcq/edit/"+req.params.id)
            }else{
                req.flash("error", "The mcq you are trying to edit isn't owned by you !!!")
                res.redirect("/dashboard")
            }
            
        }
    })
})
// report route
router.get("/mcq/report/:id", middelware.isLoggedIn ,(req,res)=>{
    Mcq.findById(req.params.id).populate("comments").exec((err,foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
            res.redirect("/")
        }else{
            res.render("dashboard/mcqs/report", {mcq : foundMcq})
        }
    })
})
// comment post route
router.post("/mcq/report/:id",middelware.isLoggedIn ,(req,res)=>{
    var newCommnet = {
		text : req.body.text,
		author : {
			id : req.user._id, 
			username : req.user.username 
		}
	}
    Mcq.findById(req.params.id,(err,foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
            res.redirect("/")
        }else{
            Comment.create(newCommnet , function (err , comment){
				if(err || !comment){
					console.log(err)
				}
				else{
					foundMcq.comments.push(comment)
					foundMcq.save()
					req.flash("success", "Thank you ! Your report has been registered ");
					res.redirect("/mcq/report/"+req.params.id)
				}
			})
        }
    })
})
// route to add comments to mcq
router.post("/mcq/:id/comment",(req,res)=>{
    if(req.body.username == "guest"){
        User.findById("620a5db2805d3d3054afd2a9",(err , foundUser)=>{
            if(err || !foundUser){
                console.log(err)
            }else{
                var newCommnet = {
                    text : req.body.text,
                    author : {
                        id : foundUser._id, 
                        username : foundUser.username
                    }
                }
                createComment(newCommnet , req.params.id)
            }
        })
    }else{
        var newCommnet = {
            text : req.body.text,
            author : {
                id : req.user._id , 
                username : req.user.username 
            }
        }
        createComment(newCommnet , req.params.id)
    }
    
})
// mcqs web page for each mcq
router.get("/mcq/answer/:id",(req,res)=>{
    Mcq.findById(req.params.id).populate(
            {
            path : "comments",
            model : "Comment"
        }
    ).exec((err , foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
            res.render("quiz/mcq", {mcq : foundMcq})
        }
    })
})
// api for display correct incorrect mcqs
router.get("/mcqsattempted/:id", middelware.isLoggedIn,(req,res)=>{
    User.findById(req.params.id).populate(
        [
            {
            path : "incorrect.id",
            model : "Mcq",
            populate : {
                path : 'comments',
                model : 'Comment'
            }
        },{
            path : "correctMCQs.id",
            model : "Mcq",
            populate : {
                path : 'comments',
                model : 'Comment'
            }
        },{
            path : "skippedMCQs.id",
            model : "Mcq",
            populate : {
                path : 'comments',
                model : 'Comment'
            }
        },
    ]
    ).exec((err , foundUser)=>{
        if(err){
            console.log(err)
        }else{
            if(req.user.username == foundUser.username || req.user.isAdmin){
                res.json({
                    username : foundUser.username,
                    correct : foundUser.correctMCQs,
                    incorrect : foundUser.incorrect,
                    skipped : foundUser.skippedMCQs,
                })
            }
        }
    })
})
//  api to send a single mcq
router.get("/mcq/ask/:id", (req,res)=>{
    Mcq.findById(req.params.id).populate(
            {
            path : "comments",
            model : "Comment"
        }
    ).exec((err, foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
            res.json(foundMcq)
        }
    })
})
// mcqs attempts in last 30 days
router.get("/mcqs/attempts/:username", middelware.isLoggedIn,(req,res)=>{
    newCustomQuiz.find({madeBy : req.params.username},(err , foundQuizzes)=>{
        if(err || !foundQuizzes){
            console.log(err)
            res.redirect("/dashboard")
        }else{
            // chart data remaining
            var dataobj = {
                mcqsAttempts : 0,
                quizAttempts : 0,
                mcqschart : {
                    labels : [],
                    data : []
                },
                quizchart : {
                    labels : [],
                    data : []
                }
            }
            for(var i = 0; i <= foundQuizzes.length ; i++){
                if(i == foundQuizzes.length){
                    // all quizzes done
                    res.json(dataobj)
                }else{
                    for(var j = 0 ; j <= foundQuizzes[i].solvedBy.length ; j++){
                        if(j == foundQuizzes[i].solvedBy.length){
                            // all attempts done
                        }else{
                            if(foundQuizzes[i].solvedBy[j].username != foundQuizzes[i].madeBy){
                                foundQuizzes[i].solvedBy[j].timeForEachMcq.forEach(time => {
                                    if(time > 10){
                                        dataobj.mcqsAttempts++
                                    }
                                });
                                dataobj.quizAttempts++
                            }
                        }
                    }
                }
            }
        }
    })
})
// functions to add comment to a mcq
function createComment(newCommnet , id){
    Mcq.findById(id,(err,foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
            res.redirect("/")
        }else{
            Comment.create(newCommnet , function (err , comment){
				if(err || !comment){
					console.log(err)
				}
				else{
					foundMcq.comments.push(comment)
					foundMcq.save()
				}
			})
        }
    })
}
module.exports = router ;