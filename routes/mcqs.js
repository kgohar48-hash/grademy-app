var express     = require("express");
var router      = express.Router();
var middelware  = require("../middelware");
var Mcq		 	= require("../models/mcq");
var User        = require("../models/user");
var Comment     = require("../models/comment")
var Post        = require("../models/post")

router.get("/dashboard/mcqs/:category/:id", middelware.isLoggedIn,(req,res)=>{
    if(req.params.category != 'incorrect'){
        User.findById(req.params.id).populate({
            path : req.params.category,
            model : "Mcq"
        }).exec((err , foundUser)=>{
            if(err){
                console.log(err)
            }else{
                dataToBePassed = {
                    username : foundUser.username,
                    mcqs : foundUser[req.params.category],
                    category : req.params.category
                }
                res.render("dashboard/mcqs/display")
            }
        })
    }else{
        User.findById(req.params.id).populate({
            path : "incorrect.id",
            model : "Mcq"
        }).exec((err , foundUser)=>{
            if(err){
                console.log(err)
            }else{
                dataToBePassed = {
                    username : foundUser.username,
                    mcqs : foundUser.incorrect,
                    category : "incorrect"
                }
                res.render("dashboard/mcqs/display")
            }
        })
    }
    
})

// send mcq
router.get("/mcq/send/:id",middelware.isLoggedIn, (req,res)=>{
    Mcq.findById(req.params.id, (err, foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
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
            if(foundMcq.postedBy == req.user.username || req.user.isAcademy){
                res.render("dashboard/mcqs/edit", {mcq : foundMcq})
            }else{
                req.flash("error", "The mcq you are trying to edit isn't owned by you !!!")
                res.redirect("/dashboard")
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
            if(foundMcq.postedBy == req.user.username || req.user.isAcademy){
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
					console.log("comment saved")
					req.flash("success", "Thank you ! Your report has been registered ");
					res.redirect("/mcq/report/"+req.params.id)
				}
			})
        }
    })
})


module.exports = router ;