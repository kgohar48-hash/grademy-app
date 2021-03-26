var HttpClient = function() {
    this.get = function(aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function() { 
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }
  
        anHttpRequest.open( "GET", aUrl, true );            
        anHttpRequest.send( null );
    }
}
var client = new HttpClient();
client.get('http://localhost:8000/data',async function(res) {
    data = JSON.parse(res)
    init()
});

var about = document.getElementById("about")
var stars = Array.from(document.getElementsByClassName("review-star"));
var ratingInput = document.getElementById("review-rating")
var avgRating = document.getElementById("avgRating")
var joinBtn = document.getElementById("join-btn")
var reviewBtn = document.getElementById("review-btn")
// feedback
var funFactor = document.getElementById("fun-factor")
var energy = document.getElementById("energy")
var subjectGrip = document.getElementById("subject-grip")
var teachingMethod = document.getElementById("teaching-methodology")
var lectureQuality = document.getElementById("lecture-quality")
var studentSatisfaction = document.getElementById("student-satisfaction")
var feedbackBtn = document.getElementById("feedback-btn")


// academy info card
var quizAttempts = document.getElementById("quiz-attempts")
var totalStudents = document.getElementById("total-students")
var totalQuizzes = document.getElementById("total-quizzes")
var videos = document.getElementById("videos")
var liveSessions = document.getElementById("live-sessions")

var data ;
var ratingSum = 0;
var starRatings = [0,0,0,0,0];


var joined = false;
var reviewed = false;

var funSum = 0;
var energySum = 0;
var gripSum = 0 ;
var methodologySum = 0;
var lectureQualitySum = 0;
var studentSatisfactionSum = 0;
var feedbackGiven = false;

var quizAttemptsNumber = 0;
var totalQuizzesNumber = 0;
var videosNumber = 0;
var liveSessionsNumber = 0;


function init(){
    about.innerText = data.academy.overview
    stars.forEach(star => {
        star.addEventListener("mouseover" , e=>{
            if(e.target.dataset["number"] > ratingInput.value){
                e.target.style.color = "orange"
            }
        })
        star.addEventListener("mouseout" , e=>{
            if(e.target.dataset["number"] > ratingInput.value){
                e.target.style.color = ""
            }
        })
        star.addEventListener("click" , e=>{
            for(var i = 0 ; 5 > i ; i++){
                stars[i].style.color = ""
            }
            const selectedStar= e.target;
            const selectedRating = selectedStar.dataset["number"];
            ratingInput.value = selectedRating
            console.log(ratingInput.value)
            for(var i = 0 ; ratingInput.value > i ; i++){
                stars[i].style.color = "orange"
            }
        })
    });
    for(var i = 0 ; data.academy.reviews.length >= i ; i++){
        if(data.academy.reviews.length == i ){
            // terminate
            console.log(starRatings)
            document.getElementById('5-star').innerText = starRatings[4]
            document.getElementById('4-star').innerText = starRatings[3]
            document.getElementById('3-star').innerText = starRatings[2]
            document.getElementById('2-star').innerText = starRatings[1]
            document.getElementById('1-star').innerText = starRatings[0]

            avgRating.innerHTML = Math.round((ratingSum/data.academy.reviews.length) * 10) / 10 
            if(reviewed){
                reviewBtn.style.display = 'none'
            }
        }else{
            starRatings[data.academy.reviews[i].rating - 1]++
            ratingSum += data.academy.reviews[i].rating
            if(data.user.username == data.academy.reviews[i].author.username){
                console.log("review given")
                reviewed = true
            }
        }
    }
    for(var i = 0 ; data.user.myAcademies.length >= i ; i++){
        if(data.user.myAcademies.length == i){
            // terminate
            if(joined){
                joinBtn.classList.remove('btn-primary')
                joinBtn.classList.add('btn-success')
                joinBtn.innerHTML = "Joined"
            }
        }else{
            if(data.user.myAcademies[i] == data.academy._id){
                joined = true
            }
        }
    }
    gettingFeedback()
    gettingAcademyInfo()
    joinBtn.addEventListener("click" , e=>{
        if(e.target.innerHTML == "Joined"){
            e.target.classList.add('btn-primary')
            e.target.classList.remove('btn-success')
            e.target.innerHTML = "Join+" 
            academyToBeUnjoined = e.target.dataset["number"]
            console.log("unjoined : ", academyToBeUnjoined)
            var options = {
                method : 'POST' ,
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({academyId : academyToBeUnjoined})
                }
            fetch("http://localhost:8000/academy/leave" , options);
        }else{
            e.target.classList.remove('btn-primary')
            e.target.classList.add('btn-success')
            e.target.innerHTML = "Joined"
            academyToBeJoined = e.target.dataset["number"]
            console.log("joined : ", academyToBeJoined)
            var options = {
                method : 'POST' ,
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({academyId : academyToBeJoined})
            }
            fetch("http://localhost:8000/academy/join" , options);
        }
    })
}
function gettingFeedback(){
    for(var i = 0 ; data.academy.feedback.funFactor.length >= i ; i++){
        if(data.academy.feedback.funFactor.length == i){
            // terminate
            funFactor.style.width = `${(funSum / (10*i)) * 100}%`
            teachingMethod.style.width = `${(methodologySum / (10*i)) * 100}%`
            subjectGrip.style.width = `${(gripSum / (10*i)) * 100}%`
            energy.style.width = `${(energySum / (10*i)) * 100}%`
            studentSatisfaction.style.width = `${(studentSatisfactionSum / (10*i)) * 100}%`
            lectureQuality.style.width = `${(lectureQualitySum / (10*i)) * 100}%`
            if(feedbackGiven){
                feedbackBtn.style.display = 'none'
            }
        }else{
            funSum += data.academy.feedback.funFactor[i]
            energySum += data.academy.feedback.energy[i]
            gripSum += data.academy.feedback.subjectGrip[i]
            methodologySum += data.academy.feedback.teachingMethod[i]
            lectureQualitySum += data.academy.feedback.lecturesQuality[i]
            studentSatisfactionSum += data.academy.feedback.studentSatisfaction[i]
            if(data.academy.feedback.givenBy[i].id == data.user._id){
                feedbackGiven = true
            }
        }
    }
}
function gettingAcademyInfo(){

    for(var i=0; data.academy.quizcategories.length >= i ; i++){
        if(data.academy.quizcategories.length == i ){
            // terminate
            totalStudents.innerText = data.academy.students.length
            totalQuizzes.innerText = totalQuizzesNumber
            quizAttempts.innerText = quizAttemptsNumber
            videos.innerText = videosNumber
        }else{
            for(var j=0; data.academy.quizcategories[i].quizzes.length >= j ; j++){
                if(data.academy.quizcategories[i].quizzes.length == j){
                    // terminate
                    totalQuizzesNumber += data.academy.quizcategories[i].quizzes.length
                    
                }else{
                    quizAttemptsNumber += data.academy.quizcategories[i].quizzes[j].solvedBy.length
                    if(data.academy.quizcategories[i].quizzes[j].discussionVideoURL != ""){
                        videosNumber++
                    }
                    if(data.academy.quizcategories[i].quizzes[j].lectureVideoURL != ""){
                        videosNumber++
                    }
                }
            }
        }
    }
}
