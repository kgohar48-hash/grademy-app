
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
      console.log(JSON.parse(res))
    quiz = JSON.parse(res).foundQuiz
    user = JSON.parse(res).currentuser

const quizBox = document.querySelector('.quiz_box');
const quizTitle = quizBox.querySelector('.title');
const timeLine = quizBox.querySelector('.time_line');
const queText = quizBox.querySelector('.que_text');
const optionList = quizBox.querySelector('.option_list');
const totalQue = quizBox.querySelector('.total_que');
const nextButton = quizBox.querySelector('.next_btn');
const finishButton = quizBox.querySelector('.finish_btn');
const toggler = quizBox.querySelector('.t_buttons');
const tButtons = toggler.children;
const options = optionList.children;
const myScore = document.getElementById('myScore')
const myCorrect = document.getElementById('myCorrect')
const myIncorrect = document.getElementById('myIncorrect')
const mySkipped = document.getElementById('mySkipped')
const myRank = document.getElementById('myRank')

var timeElement = document.getElementById("timefortest")
skipped = 0
correct = 0
incorrect = 0
position = 0
var currentIndex = 0;
await findUserResponse()
console.log(UserSolution)
var userObject = {
    key: UserSolution.key,
    keyOfCorrectness: UserSolution.keyOfCorrectness,
    timeForEachMcq: UserSolution.timeForEachMcq,
    quizId : quiz._id,
    username: user.username,
    userScore: UserSolution.userScore
}
const isDisplayed = [];
const userResponse = [];
for (let i = 0; i < quiz.mcqs.length ; i++) {
    isDisplayed.push(false);
    userResponse.push(Number(UserSolution.key[i]));
}
startQuiz();



function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};



// quizTitle.append(document.createElement('span').textContent = `${capitalizeFirstLetter(quiz.mcqs[0].subject)} -`);
// quizTitle.append(document.createElement('br'));
// quizTitle.append(document.createElement('span').textContent = `${quiz.mcqs[0].chapter}`);

function startQuiz() {
    createToggler();
    setMyStats()
    setleaderboard()
    displayQues(currentIndex);
}



function timeLineWidth(min, sec, iMin, iSec) {
    let width = (((iMin * 60 + iSec) - (min * 60 + sec)) / (iMin * 60 + iSec)) * 100;
    timeLine.style.width = width + '%';
}

function displayQues(index) {
    quizTitle.textContent = `${capitalizeFirstLetter(quiz.mcqs[index].subject)} - ${quiz.mcqs[index].chapter}`;
    totalAttempts = quiz.mcqs[index].userResponse.reduce((a, b) => a + b, 0)

    queText.innerHTML = `<span><b>${index + 1}</b>.  ${capitalizeFirstLetter(quiz.mcqs[index].question)}</span>`;
    optionList.innerHTML = '<div class="option"><span>' + quiz.mcqs[index].choice[0] + '</span><span class="float_right">'+((quiz.mcqs[index].userResponse[1]/totalAttempts)*100).toFixed(0) +'%</span></div>'
        + '<div class="option"><span>' + quiz.mcqs[index].choice[1] + '</span><span class="float_right">'+((quiz.mcqs[index].userResponse[2]/totalAttempts)*100).toFixed(0) +'%</span></div>'
        + '<div class="option"><span>' + quiz.mcqs[index].choice[2] + '</span><span class="float_right">'+((quiz.mcqs[index].userResponse[3]/totalAttempts)*100).toFixed(0) +'%</span></div>'
        + '<div class="option"><span>' + quiz.mcqs[index].choice[3] + '</span><span class="float_right">'+((quiz.mcqs[index].userResponse[4]/totalAttempts)*100).toFixed(0) +'%</span></div>';
    qCounter(index);
   
    for(var i = 0 ; options.length > i;i++){
        options[i].style.background =`linear-gradient(to right, #cce5ff  ${(quiz.mcqs[index].userResponse[i+1]/totalAttempts)*100}%,aliceblue ${(quiz.mcqs[index].userResponse[i+1]/totalAttempts)*100}%)`
    }
    if(quiz.mcqs[index].answer[0] == userResponse[index]){
        options[(userResponse[index] - 1)].classList.add('correct');
    }else{
        options[(userResponse[index] - 1)].classList.add('incorrect');
        options[(quiz.mcqs[index].answer[0] - 1)].classList.add('correct');
    }
    queTimer(index);
    tButtons[index].classList.add('select');
    for (i = 0; i < tButtons.length; i++) {
        i != index && tButtons[i].classList.remove('select');
    }
}

function qCounter(index) {
    totalQue.innerHTML = `<span><p>${index + 1}</p> of <p>${quiz.mcqs.length}</p> Questions</span>`;
    currentIndex = index;
}

nextButton.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex === (quiz.mcqs.length)) { currentIndex = 0 }
    displayQues(currentIndex);
})

finishButton.addEventListener('click', () => {
    window.location = "http://localhost:8000/dashboard";
})

function createToggler() {
    for (i = 0; i < quiz.mcqs.length; i++) {
        let button = document.createElement('button');
        button.textContent = `${i + 1}`;
        button.classList.add('t_btn');
        if(quiz.mcqs[i].answer[0]==userResponse[i]){
            correct++
            button.classList.add('t_correct');
        }else{
            if(userResponse[i]==0){
                skipped++
                button.classList.add('t_skipped');
            }else{
                incorrect++
                button.classList.add('t_incorrect');
            }
        }
        button.addEventListener('click', () => {
            clearInterval(qTimer);
            displayQues((parseInt(button.textContent) - 1))
        })
        toggler.append(button);
    }
}

function queTimer(index) {
    if (isDisplayed[index] = false) {
        userObject.timeForEachMcq[index] = 0;
        isDisplayed[index] = true;
    }
    qTimer = setInterval(qTime, 1000);
    function qTime() {
        userObject.timeForEachMcq[index]++;
    }
}


})

async function findUserResponse() {
    return new Promise((resolve,reject)=>{
        for(var i = 0 ; quiz.solvedBy.length > i ; i++){
            if(user.username == quiz.solvedBy[i].username){
                UserSolution =  quiz.solvedBy[i]
                position = i
                console.log("found solution")
                resolve()
            }
        }
    })
}

function setMyStats() {
    myScore.innerText = UserSolution.userScore
    myRank.innerText = position
    myCorrect.innerText = correct
    myIncorrect.innerText = incorrect
    mySkipped.innerText = skipped
}

function setleaderboard() {
    var board = document.getElementById('board')
    var boardhtml = ''
    for(var i = 0 ; quiz.solvedBy.length > i ; i ++){
        if(i>4 || quiz.solvedBy.length == i - 1){
            i = quiz.solvedBy.length
            board.innerHTML = boardhtml
        }else{
            boardhtml += `<div class="lboard_mem">
            <div class="name_bar">
              <p>${i+1}. <span id="1positionname">${quiz.solvedBy[i].username}</span> </p>
              <div class="bar_wrap">
                <div class="inner_bar" id="1positionprogressbar" style="width: 100%"></div>
              </div>
            </div>
            <div class="points" >
              <span id="1positionscore">${quiz.solvedBy[i].userScore}</span> points
            </div>
          </div>`
        }
    }
}
