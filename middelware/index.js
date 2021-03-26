var Post    = require("../models/post")
var Comment = require("../models/comment")

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
