var customQuiz = document.getElementById("customquizContainer")
var user       = document.getElementById("username").value
var dataobj = {
    mcqsAttempts : 0,
    quizAttempts : 0,
    quizAttempts2 : 0,
    mcqsAttempts2 : 0
}
var d = new Date()
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

init();
async function init(){
    var footer = document.getElementById('footer')
    footer.style.display = 'none'
    await fetchingCustumQuizzes();
    await showCards();
    fetchMCQsattempts()
    setTimeout(function () {
        footer.style.display = 'block'
        document.getElementById("loader").style.display = "none";
        document.getElementById("myDiv").style.display = "block";
    }, 500);
}

async function fetchingCustumQuizzes(){
    try {
        return new Promise((resolve, reject) => {
            var client = new HttpClient();
            client.get('https://www.grademy.org/quizlistapi', function (res) {
                var quizz = JSON.parse(res);
                quizzes = quizz.reverse()
                resolve();
            });
        });
    } catch (err) {
        console.log(err);
    }
}
async function showCards(){
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
                var string3 = '</h2><ul><li>Total MCQs : ';
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
                    var string9 = '<div class="card-footer mt-auto"><a href="/dashboard/newcustomquiz/view/view/'+quiz._id.toString()+'" class="btn btn-success btn-lg btn-block">View Now</a></div>';
                } else {
                    var string9 = '<div class="card-footer mt-auto"><a href="/dashboard/newcustomquiz/view/start/'+quiz._id.toString()+'" class="btn btn-primary btn-lg btn-block">Start Now</a></div>';
                }
                var string11 = '</div></div></div>';
                str = str + string1 + string2 + string3 + string4 + string5 + string6 + string6_0 + string6_1 + string7 + string8 + string9 + string11;
                a++;
            });
            customQuiz.innerHTML = str;
            resolve();
        });
    } catch (err) {
        console.log(err);
    }
}

async function fetchMCQsattempts(){
    for(var i = 0; i <= quizzes.length ; i++){
        if(i == quizzes.length){
            // all quizzes done
        }else{
            await eachQuiz(quizzes[i])
            dataobj.quizAttempts2 += quizzes[i].solvedBy.length
        }
    }
}

async function eachQuiz(quiz){
    try {
        return new Promise(async (resolve, reject) => {
            if(quiz.madeBy == user){
                for(var j = 0 ; j <= quiz.solvedBy.length ; j++){
                    if(j == quiz.solvedBy.length){
                        // all attempts done
                        resolve()
                    }else{
                        await eachQuizAttempt(quiz.solvedBy[j],quiz)
                    }
                }
            }else{
                resolve()
            }
        });
    } catch (err) {
        console.log(err);
    }
}

function eachQuizAttempt(solvedBy,quiz){
    try {
        return new Promise((resolve, reject) => {
            if(solvedBy.username != quiz.madeBy && typeof solvedBy.date != "undefined"){
                attemptdate = new Date(solvedBy.date)
                // if(attemptdate.getMonth() == 0 && attemptdate.getDate() == 28){
                //     console.log(attemptdate.getMonth() +"/"+attemptdate.getDate())
                // }
                if(d.getMonth() == attemptdate.getMonth()){
                    solvedBy.timeForEachMcq.forEach(time => {
                        if(time > 10){
                            dataobj.mcqsAttempts++
                        }
                    });
                    dataobj.quizAttempts++
                    dataobj.mcqsAttempts2 += quiz.mcqs.length
                    resolve()
                }else if(d.getMonth() == 1 + attemptdate.getMonth() && d.getDate() <= attemptdate.getDate()){
                    solvedBy.timeForEachMcq.forEach(time => {
                        if(time > 10){
                            dataobj.mcqsAttempts++
                        }
                    });
                    dataobj.quizAttempts++
                    dataobj.mcqsAttempts2 += quiz.mcqs.length
                    resolve()
                }else{
                    resolve()
                }
                
            }else{
                resolve()
            }
        });
    } catch (err) {
        console.log(err);
    }
}