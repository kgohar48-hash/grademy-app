var express = require("express");
var router  = express.Router({mergeParams : true });
var Post    = require("../models/post")
var Comment = require("../models/comment")
var middelware = require("../middelware")

router.get("/new" , middelware.isLoggedIn , function(req,res){
	// find post by id
	Post.findById(req.params.id , function(err , post){
		if (err){
			console.log(err)
		}
		else{
			
			res.render("comments/new" , {post : post })
		}
	})
})
// POSt route
router.post("/" , middelware.isLoggedIn , function(req,res){
	var newCommnet = {
		text : req.body.text,
		author : {
			id : req.user._id, 
			username : req.user.username 
		}
	}
	console.log("comment : ",newCommnet)
	Post.findById(req.params.id , function(err , post){
		if(err || !post){
			console.log(err)
		}
		else{
			Comment.create(newCommnet , function (err , comment){
				if(err || !comment){
					console.log(err)
				}
				else{
					post.comments.push(comment)
					post.save()
					console.log("comment saved")
					res.redirect("/newsfeed/")
				}
			})
		}
	})
})
//Edite route
router.get("/:comment_id/edit" , middelware.checkCommentOwnership, function(req,res){
	Comment.findById(req.params.comment_id , function(err , foundComment){
		if(err){
			res.redirect("back")
		}
		else{
			res.render("comments/edit" , {post_id : req.params.id , comment : foundComment})
		}
	})	
})
// update route
router.put("/:comment_id", middelware.checkCommentOwnership , function(req,res){
	Comment.findByIdAndUpdate(req.params.comment_id , req.body.comment , function(err,updatedComment){
		if(err){
			res.redirect("back")
		}
		else{
			res.redirect("/newsfeed/" + req.params.id )
		}
	})
})
// distroy route
router.delete("/:comment_id" , middelware.checkCommentOwnership, function(req,res){
	Comment.findByIdAndDelete(req.params.comment_id , function(err){
		if(err){
			res.redirect("back")
		}
		else{
			res.redirect("/newsfeed/" + req.params.id )
		}
	})
})

module.exports = router ;