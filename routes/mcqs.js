var express     = require("express");
var router      = express.Router();
var middelware  = require("../middelware");
var Mcq		 	= require("../models/mcq");
var User        = require("../models/user");

router.get("/dashboard/mcqs/:category/:id", (req,res)=>{
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

router.get("/mcq/edit/:id", (req,res)=>{
    Mcq.findById(req.params.id,(err,foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
            res.render("dashboard/mcqs/edit", {mcq : foundMcq})
        }
    })
})

router.post("/mcq/edit/:id",(req,res)=>{
    Mcq.findById(req.params.id , (err,foundMcq)=>{
        if(err || !foundMcq){
            console.log(err)
        }else{
            console.log(req.body)
            foundMcq.question = req.body.mcq.question
            foundMcq.choice = req.body.mcq.choice
            foundMcq.answer.set(0 , req.body.mcq.answer)
            console.log("update :",foundMcq)
            foundMcq.save()
            res.redirect("/mcq/edit/"+req.params.id)
        }
    })
    console.log(req.body)
})


module.exports = router ;