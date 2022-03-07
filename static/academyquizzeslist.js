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
client.get('http://localhost:8000/academy/api/'+document.getElementById("academy-id").value,async function(res) {
    data = JSON.parse(res)
    init()
});

var user       = document.getElementById("username").value
var customQuiz = document.getElementById("customquizContainer")
var postQuiz = document.getElementById("post-quiz")
var createQuiz = document.getElementById("create-quiz")
var titles = Array.from(document.getElementsByClassName("category-titles"));
var quizzesDescription = document.getElementById("quiz-description")
var createdOn = document.getElementById("createdOn")
var videoElement = document.getElementById('video')
var data ;

function init(){
    selectCategory(titles[0].innerText)
    titles.forEach(title => {
        title.addEventListener("click",e=>{
            selectCategory(e.target.innerText)
        })
    });
}

async function selectCategory(titleText){
    for(var i = 0 ; data.academy.quizcategories.length >i ; i++){
        if(data.academy.quizcategories[i].title == titleText){
            if(data.user.username == data.academy.owner.username){
                postQuiz.href = "/academy/quiz/new/"+data.academy.quizcategories[i]._id
                createQuiz.href = "/customquiz/new/section/"+data.academy.quizcategories[i]._id
            }
            titles[i].classList.add("btn-success")
            titles[i].classList.remove("btn-primary")
            quizzesDescription.innerText = data.academy.quizcategories[i].description
            createdOn.innerHTML = '<h7 class="">Created on : '+ data.academy.quizcategories[i].createdAt.substring(8,10)+'/'+ data.academy.quizcategories[i].createdAt.substring(5,6)+1+'/'+ data.academy.quizcategories[i].createdAt.substring(0,4)+'</h7>'
            await showCards(data.academy.quizcategories[i].quizzes);
        }else{
            if(titles[i].classList.contains("btn-success")){
                if(data.user.username == data.academy.owner.username){
                    postQuiz.href = ""
                    createQuiz.href = ""
                }
                titles[i].classList.remove("btn-success")
                titles[i].classList.add("btn-primary")
            }
        }
    }
}

async function showCards(quizzes){
    try {
        return new Promise((resolve, reject) => {
            var str = '';
            var a = 0;
            quizzes.forEach(quiz => {
                var string1 = '<div class="col-md-3 col-sm-6 mt-3 "><div class="card"><div class="card-body  d-flex flex-column "><h2><sup>Best Score </sup>';
                if (quiz.solvedBy[0]) {
                    // getting top score
                    var string2 = quiz.solvedBy[0].userScore.toString();
                } else {
                    var string2 = "0";
                }
                if(quiz.madeBy == user){
                    var string3 = '<a href="/academy/quiz/'+quiz._id+'/edit" id="edit-btn" class="fas fa-edit btn btn-sm btn-warning float-right" ></a></h2><ul><li>Total MCQs : ';
                }else{
                    var string3 = '</h2><ul><li>Total MCQs : ';
                }
                var string4 = quiz.mcqs.length.toString();
                var string5 = '</li><li>Attempts : ';
                var string6 = quiz.solvedBy.length;
                var string7 = '</li></ul><h4>Description : </h4> ';
                var string8 = quiz.description;
                var solved = false;
                var avg = [];
                var string6_0 = '';
                var string6_1 = ''
                for (var b = 0; quiz.solvedBy.length >= b ; b++) {
                    if (b == quiz.solvedBy.length) {
                        var sum = avg.reduce(function (a_1, b) {
                            return a_1 + b;
                        }, 0);
                        if(b!=0){
                            string6_0 = '</li><li>Avg score : ' + Math.round(sum / quiz.solvedBy.length);
                        }
                    }else{
                        avg.push(quiz.solvedBy[b].userScore);
                        if (user == quiz.solvedBy[b].username) {
                            solved = true;
                            var position = b + 1;
                            string6_1 = '</li><li>My Score : ' + quiz.solvedBy[b].userScore + '</li><li>My Position : ' + position.toString();
                        }
                    }
                }
                if (solved) {
                    if(quiz.discussionVideoURL != ""){
                        var string9 = '<div class="card-footer mt-auto"><a href="/dashboard/newcustomquiz/view/view/'+quiz._id.toString()+'" class="btn btn-success btn-md mr-1 ">View Now</a><span data-toggle="collapse" data-number="'+quiz.discussionVideoURL+'" class="btn btn-success fab fa-youtube" href=".video"></span></div>';
                    }else{
                        var string9 = '<div class="card-footer mt-auto"><a href="/dashboard/newcustomquiz/view/view/'+quiz._id.toString()+'" class="btn btn-success btn-lg btn-block">View Now</a></div>';
                    }
                } else {
                    if(quiz.lectureVideoURL != ""){
                        var string9 = '<div class="card-footer mt-auto"><span data-toggle="collapse" data-number="'+quiz.lectureVideoURL+'" class="btn btn-primary fab fa-youtube" href=".video"></span><a href="/dashboard/newcustomquiz/view/start/'+quiz._id.toString()+'" class="btn btn-primary btn-md ml-1">Start Now</a></div>';
                    }else{
                        var string9 = '<div class="card-footer mt-auto"><a href="/dashboard/newcustomquiz/view/start/'+quiz._id.toString()+'" class="btn btn-primary btn-lg btn-block">Start Now</a></div>';
                    }
                }
                var string11 = '</div></div></div>';
                str = str + string1 + string2 + string3 + string4 + string5 + string6 + string6_0 + string6_1 + string7 + string8  + string9 + string11;
                a++;
            });
            customQuiz.innerHTML = str;
            clickedVideo();
            resolve();
        });
    } catch (err) {
        console.log(err);
    }
}

function clickedVideo(){
    var videoIcons = Array.from(document.getElementsByClassName("fa-youtube"));
    videoIcons.forEach(icon=>{
        icon.addEventListener('click',e=>{
            videoElement.src = "https://www.youtube.com/embed/"+e.target.dataset["number"]
        })
    })
}