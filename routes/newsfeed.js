var express = require("express");
var router  = express.Router();
var Post    = require("../models/post");
var User    = require("../models/user");
var Academy = require("../models/academy")
var middelware = require("../middelware");
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


router.get("/", middelware.isLoggedIn , function(req,res){
	Post.find({}).populate("comments").populate("mcq").exec((err , posts)=>{
		if(err){
			console.log(err)
		}
		else{
			User.findById(req.user._id).populate({
				path : 'myAcademies',
				model : 'Academy',
			}).exec((err, foundUser) =>{
				if(err || !foundUser){
					console.log(err)
				}else{
					posts.reverse()
					res.render("posts/newsfeed" , {posts:posts , user : foundUser })
				}
			})
		}
	})
	
})
// newsfeed for academy
router.get("/:id" , middelware.isLoggedIn, function(req,res){
	Academy.findById(req.params.id).populate({
        path : 'cummunityposts',
        model : 'Post',
        populate : [{
            path : 'comments',
            model : 'Comment'
        },{
			path : "mcq",
			model : "Mcq"
		}]
    }).exec((err, foundAcademy) => {
        if (err || !foundAcademy) {
            console.log(err);
        } else {
			User.findById(req.user._id).populate({
				path : 'myAcademies',
				model : 'Academy',
			}).exec((err, foundUser) =>{
				if(err || !foundUser){
					console.log(err)
				}else{
					dataToBePassed = {
						academy : foundAcademy,
						user : foundUser
					}
					foundAcademy.cummunityposts.reverse()
					res.render("posts/newsfeed" , {posts:foundAcademy.cummunityposts , user : foundUser , id : foundAcademy._id })
				}
			})
        }
    })
})
router.post("/", middelware.isLoggedIn, upload.single('image'), function(req, res) {
	if(req.file){
		cloudinary.uploader.upload(req.file.path, function(result) {
			// add cloudinary url for the image to the campground object under image property
			req.body.post.image = result.secure_url;
			// add author to campground
			req.body.post.author = {
			  id: req.user._id,
			  username: req.user.username
			}
			Post.create(req.body.post, function(err, post) {
			  if (err){
				req.flash('error', err.message);
				return res.redirect('back');
			  }else{
				User.findById(req.user._id , (err,foundUser)=>{
					if(err || !foundUser){
						console.log(err)
					}else{
						foundUser.myPosts.push(post)
						foundUser.save()
						res.redirect('/newsfeed' );
					}
				})
			  }
			});
		});
	}else{
		req.body.post.author = {
			id: req.user._id,
			username: req.user.username
		}
		Post.create(req.body.post, function(err, post) {
		if (err) {
			req.flash('error', err.message);
			return res.redirect('back');
		}else{
			User.findById(req.user._id , (err,foundUser)=>{
				if(err || !foundUser){
					console.log(err)
				}else{
					foundUser.myPosts.push(post)
					foundUser.save()
					res.redirect('/newsfeed' );
				}
			})
		  }
		});
	}
	
})
// post route for academies
router.post("/:id", middelware.isLoggedIn, upload.single('image'), function(req, res) {
	Academy.findById(req.params.id,(err , foundAcademy)=>{
		if(err || !foundAcademy){
			console.log(err)
		}else{
			if(req.file){
				cloudinary.uploader.upload(req.file.path, function(result) {
					// add cloudinary url for the image to the campground object under image property
					req.body.post.image = result.secure_url;
					// add author to campground
					req.body.post.author = {
					  id: req.user._id,
					  username: req.user.username
					}
					Post.create(req.body.post, function(err, post) {
					  if (err){
						req.flash('error', err.message);
						return res.redirect('back');
					  }else{
						User.findById(req.user._id , (err,foundUser)=>{
							if(err || !foundUser){
								console.log(err)
							}else{
								foundUser.myPosts.push(post)
								foundAcademy.cummunityposts.push(post)
								post.cummunity = foundAcademy
								foundAcademy.save()
								foundUser.save()
								post.save()
								res.redirect('/newsfeed/'+foundAcademy._id );
							}
						})
					  }
					});
				});
			}else{
				req.body.post.author = {
					id: req.user._id,
					username: req.user.username
				}
				Post.create(req.body.post, function(err, post) {
				if (err) {
					req.flash('error', err.message);
					return res.redirect('back');
				}else{
					User.findById(req.user._id , (err,foundUser)=>{
						if(err || !foundUser){
							console.log(err)
						}else{
							foundUser.myPosts.push(post)
							foundAcademy.cummunityposts.push(post)
							post.cummunity = foundAcademy
							foundAcademy.save()
							foundUser.save()
							post.save()
							res.redirect('/newsfeed/'+foundAcademy._id );
						}
					})
				  }
				});
			}
		}
	})
})
// Edit route
router.get("/:id/edit" , middelware.checkPostOwnership , function(req,res){
	
	Post.findById(req.params.id , function(err , foundPost){
		if(err){
			console.log(err)
		}
		else
		{
			res.render("posts/edit" , {post : foundPost})
		}
	})

})
// update route
router.put("/:id" , middelware.checkPostOwnership , function(req,res){
	
	Post.findByIdAndUpdate(req.params.id , req.body.post , function(err , updatedPost){
		if(err){
			res.redirect("/newsfeed")
		}
		else{
			res.redirect("/newsfeed/" + req.params.id)
		}
	})
})
//delete route
router.delete("/:id" , middelware.checkPostOwnership, function(req,res){
	Post.findByIdAndDelete(req.params.id , function(err){
		if (err){
			res.redirect("newsfeed/" + req.params.id )
		}
		else{
			res.redirect("newsfeed")
		}
	})
})
// show details
router.get("/:id" , function(req,res){
	Post.findById(req.params.id).populate("comments").exec(function(err , foundPost){
		if(err){
			console.log(err)
		}
		else{
			res.render("posts/show" , {post : foundPost})
		}
	})
})
// a single user can vote 2 times
// vote
router.post('/vote/:id', middelware.isLoggedIn,(req,res)=>{
	Post.findById(req.params.id, (err , foundPost)=>{
		if(err || !foundPost){
			console.log(err)
		}else{
			var hasVoted = false 
			for(var i = 0 ; foundPost.votedBy.length >= i ; i++){
				if(foundPost.votedBy.length == i || hasVoted){
					// terminate
					i = foundPost.votedBy.length + 1
					if(hasVoted){
					}else{
						if(req.body.vote == 'up'){
							foundPost.votes ++ ;
						}else{
							foundPost.votes -- ;
						}
						foundPost.votedBy.push({
							id : req.user._id,
							username : req.user.username
						})
						foundPost.save()
					}
				}else{
					if(req.user.username == foundPost.votedBy[i].username){
						hasVoted = true
					}
				}
			}
		}
	})
})
// vote delete
router.post('/unvote/:id', middelware.isLoggedIn,(req,res)=>{
	Post.findById(req.params.id, (err , foundPost)=>{
		if(err || !foundPost){
			console.log(err)
		}else{
			const index = foundPost.votedBy.indexOf({
				id : req.user._id,
				username : req.user.username
			});
			if (index > -1) {
				foundPost.votedBy.splice(index, 1);
			}
			if(req.body.vote == 'up'){
				foundPost.votes -- ;
			}else{
				foundPost.votes ++ ;
			}
			foundPost.save()
		}
	})
})





module.exports = router ;