var Post    = require("../models/post")
var Comment = require("../models/comment")
var Academy = require ("../models/academy")
var customQuiz = require ("../models/newCustomQuiz")
var middelwareObj = {}

middelwareObj.checkCommentOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id , function(err , foundComment){
			if(err){
				res.redirect("back")
			}
			else{
				if(foundComment.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back")
				}

			}
		})
	}
	else{
		res.redirect("back");
	}
	
}

middelwareObj.checkPostOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Post.findById(req.params.id , function(err , foundPost){
			if(err){
				res.redirect("back")
			}
			else{
				if(foundPost.author.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back")
				}

			}
		})
	}
	else{
		res.redirect("back");
	}
	
}

middelwareObj.checkAcademyOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		Academy.findById(req.params.id , function(err , foundAcademy){
			if(err || !foundAcademy){
				res.redirect("back")
			}
			else{
				if(foundAcademy.owner.id.equals(req.user._id)){
					next();
				}
				else{
					res.redirect("back")
				}
			}
		})
	}
	else{
		res.redirect("back");
	}
}

middelwareObj.checkQuizOwnership = function(req,res,next){
	if(req.isAuthenticated()){
		customQuiz.findById(req.params.id , function(err , foundQuiz){
			if(err || !foundQuiz){
				res.redirect("back")
			}
			else{
				if(foundQuiz.madeBy == req.user.username){
					next();
				}
				else{
					res.redirect("back")
				}
			}
		})
	}
	else{
		res.redirect("back");
	}
}

middelwareObj.isLoggedIn = function(req,res,next){
	if(req.isAuthenticated()){
		return next() ; 
	}
	else {
		req.session.returnTo = req.originalUrl; 
		req.flash("error" , "Please login first!")
		res.redirect("/login") 
	}
}


module.exports = middelwareObj ;
