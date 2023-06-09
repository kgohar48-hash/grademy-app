const express			 = require("express"),
	router 			 = express.Router(),
	// randomstring	 = require("randomstring"),
	passport     	 = require ("passport"),
	User			 = require("../models/user"),
	middelware 		 = require("../middelware");


// ===============================
// route calls
// ===============================
//LANDING PAGE
router.get("/" , function(req,res){
	// res.redirect("https://www.grademy.org/home")
	res.render("index/landingleagal")
});
router.get("/home" , function(req,res){
	res.render("index/landing")
});
// register page
router.get("/signup" , function(req,res){
	res.render("registration/signup" , {ref : "kgohar48"})
})
// register with refernce
router.get("/signup/:id" , function(req,res){
	res.render("registration/signup", {ref : req.params.id})
})
// signup logic
router.post("/signup" , function(req,res){
	var token = Math.floor((Math.random() * 1000000) + 1)
	// extracting ref
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
			// push notification to admin
			req.flash("error" , err.message)
			res.redirect("/signup")}
		else{
			user.save();
			passport.authenticate("local")(req, res, function(){
				if(req.session.returnTo != ""){
					res.redirect(req.session.returnTo || '/dashboard');
					req.session.returnTo = "";
					req.session.save()
					console.log("session exist")
				}else{
					req.flash("success", "Welcome to Grademy " + user.name);
					res.redirect('/dashboard');
					console.log("session not exist")
				}
			});
		}
	})
})
//verification 
router.post("/verification" , function (req,res) {
	
	res.send("in beta testing, please contact admin")
	// var token = req.body.token
	// User.findOne({token : token } , function (err , foundUser) {
	// 	if(!foundUser || err ){
	// 		req.flash("error" , "Incorrect key try again or contact admin")
	// 		return res.render("verify")
	// 	}
	// 	else{
	// 		foundUser.isVerified = true ;
	// 		foundUser.save();
	// 		positionSorting();
	// 		req.flash("success" , foundUser.username +" is verified now")
	// 		res.redirect("/login")
	// 		// it does verify user but keep loading   error to be fixed
	// 	}
	// })
	
})
//login page & logic
router.get("/login" , function(req,res){
	res.render("registration/login")
})
//login logic
router.post("/login", passport.authenticate("local", 
    {
		failureRedirect: "/login",
		failureFlash: 'Invalid username or password.' 
    }), function(req, res){
		if(req.session.returnTo != ""){
			res.redirect(req.session.returnTo || '/dashboard');
			req.session.returnTo = "";
			req.session.save()
			console.log("session exist")
		}else{
			res.redirect('/dashboard');
			console.log("session not exist")
		}
});
//logout route
router.get("/logout" , function(req,res){
	req.logout();
	req.flash("success" , "Logged you out ")
	res.redirect("/")
})
//render forgot password form
router.get("/forgot" , function(req,res){
	// res.send("This app is under beta testing, please contact us at +92 313 0157543 to get your new password")
	res.render("registration/resetpassword")
})
//render forgot password post route
router.post("/forgot" , function(req,res){
	User.findOne({phone : req.body.phone} , function (err,foundUser) {
		if(err){
			console.log(err)
			return res.render("forgot")
		}	
		if(!foundUser){
			req.flash("error" , "User not found")
			return res.render("forgot")
		}
		if(foundUser){
			// send token to the user
			req.flash("success" , foundUser.username + " A key has been sent to your number")
			res.render("registration/resetpassword")
		}
	})
})
//render reset password post route
router.post("/resetpassword" , function(req,res){
	User.findOne({token : req.body.token} , function (err,foundUser) {
		if(err){
			return console.log("err")
		}
		if(!foundUser){
			req.flash("error" , "Invalid key")
			return res.render("resetpassword")			
		}	
		if(foundUser){
			foundUser.setPassword(req.body.password , function (err) {
				if(err){
					console.log(err)
				}else{
					foundUser.save()
				}
			})
			req.flash("success" , "Password updated")
			return res.redirect("login")
		}
	})
})

// ===============================
// functions for this router
// ===============================


module.exports = router ;


