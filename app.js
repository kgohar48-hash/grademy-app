var express          = require("express"),
	app              = express(),
	bodyParser       = require("body-parser"),
	flash			 = require("connect-flash"),
	randomstring	 = require("randomstring"),
	mongoose         = require("mongoose"),
	passport     	 = require ("passport"),
	LocalStrategy	 = require("passport-local"),
	methodOverride 	 = require("method-override"),
	User			 = require("./models/user");
	// process.env.PORT , process.env.IP
app.listen ( 8000	,async function(){
	await connectingToDB()
	console.log("grademy serving listening...")
	// fix route paths
	//Router call
	var commentsRoutes		= require("./routes/comments"),
		newsfeedRoutes		= require("./routes/newsfeed"),
		registrationRoutes	= require("./routes/registration") ,
		mcqsRouter			= require("./routes/mcqs"),
		dashboardRouter		= require("./routes/dashboard"),
		newCustomQuizRouter	= require("./routes/newcustomquiz"),
		userRouter			= require("./routes/user"),
		apiRouter			= require("./routes/api"),
		paymentRouter		= require("./routes/payment"),
		testRouter			= require("./routes/test"),
		academyRouter		= require("./routes/academy"),
		botRouter			= require("./routes/bot");
	
	//Routes config
	app.use("/newsfeed",newsfeedRoutes);
	app.use("/newsfeed/:id/comments",commentsRoutes);
	app.use(registrationRoutes);
	app.use(dashboardRouter);
	app.use(userRouter);
	app.use(mcqsRouter);
	app.use(newCustomQuizRouter);
	app.use(botRouter);
	app.use(apiRouter);
	app.use(testRouter);
	app.use(paymentRouter);
	app.use(academyRouter);
})
// ===============================
// app config
// ===============================
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine" , "ejs");
app.use("/static", express.static('./static/'));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(express.json());
app.use(flash())

// ===============================
// Passport config
// ===============================

app.use(require("express-session")({
	secret : "this could be anything!....." ,
	resave : false ,
	saveUninitialized : false 
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
	res.locals.currentUser = req.user ;
	res.locals.error = req.flash("error")
	res.locals.success = req.flash("success")
	next() ;
}) ;


// starting functions
function connectingToDB(){
	try {
		return new Promise((resolve , reject)=>{
			mongoose.connect("mongodb+srv://kgohar48:123@nuttertools@cluster0-jhcdp.mongodb.net/test?retryWrites=true&w=majority" , {useNewUrlParser : true , useCreateIndex : true , useUnifiedTopology : true } ).then(()=>{
				console.log("connected to database")
				resolve()
			}).catch(err=>{
				console.log("Error in DB:" ,  err.message)
				// push this notification to admin
			})
		})
	} catch (reject) {
		console.log("Error in DB:" ,  reject.message)
	}
}

