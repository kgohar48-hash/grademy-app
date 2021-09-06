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

const question = document.getElementById("question");
const choicesContainer = document.getElementById("choices-container");
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const submitButton = document.getElementById("submit-button");
const skipButton = document.getElementById("skipButton");
const reportButton = document.getElementById("reportMcq")
const currentUser = document.getElementById("username");
const category = document.getElementById("category");
const sideBar = document.getElementById("sidebar-container")
var subjectTitle = document.getElementById('subject')
var chapterTitle = document.getElementById('chapter')
var choices =[];
let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuesions = [];
let userKey = [];
let keyOfCorrectness = [] ;
let correct = 0;
let incorrect = 0;
let skipped = 0 ;
let questions = [];
let ownerId = '' ;
let timeForEachMcq = [];
var timerForEachMcq = 0 ;
var sidebarHTMLString = ''
var choicesSelected = 0 ;
var responseToChoice = []
// https://protected-mesa-71767.herokuapp.com/data
// http://localhost:3000/data
//Questions fetch APi
var client = new HttpClient();
    client.get('https://www.grademy.org/data',async function(res) {
      var loadedQuiz = JSON.parse(res)
      console.log(loadedQuiz)
      quizId = loadedQuiz.foundQuiz._id
      // await checkCategory(loadedQuiz.foundQuiz);
      if(loadedQuiz.foundQuiz.madeBy){
        ownerId = loadedQuiz.foundQuiz.madeBy
      }
      questions = loadedQuiz.foundQuiz.mcqs
      const length = questions.length
      if(loadedQuiz.currentuser.category == "MDCAT"){
        startTimerNow(length , 45);
      }
      if(loadedQuiz.currentuser.category == "FUNG"){
        startTimerNow(length , 54);
      }
      startGame();
    });


//CONSTANTS
const CORRECT_BONUS = 4;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuesions = [...questions];
  keyOfCorrectness = new Array(questions.length)
  userKey = new Array(questions.length)
  timeForEachMcq = new Array(questions.length)
  getSidebar()
  setInterval(()=>{
    timerForEachMcq += 1;
  }, 1000);
  getNewQuestion();
};

getNewQuestion = () => {
  getSidebar() // re-rendering sidebar
  if ( unattempted == 0) {
    localStorage.setItem("mostRecentScore", score);
    skipButton.style.display = "none"
    acceptingAnswers = false
    //counting score
    console.log("correct 0: ",correct)
    for(var i = 0 ; i < keyOfCorrectness.length ; i++){
      if(keyOfCorrectness[i] == 4){
        correct++
      }
      if(keyOfCorrectness[i]== -1){
        incorrect++
      }
      if(keyOfCorrectness[i] == 0){
        skipped++
      }
      if(i == keyOfCorrectness.length - 1){
        console.log("correct : ",correct)
        submitButton.innerHTML = '<form action="/dashboard/quiz/score" method="POST"><input type="hidden" name="score" value="'+score+'"><input type="hidden" name="correct" value="'+correct+'"><input type="hidden" name="incorrect" value="'+incorrect+'"><input type="hidden" name="skipped" value="'+skipped+'"><input type="hidden" name="quizId" value="'+quizId+'"><input type="hidden" name="ownerId" value="'+ownerId+'"><button  class="btn btn-primary btn-lg" id="submit">Submit</button></form>'
        const submit = document.getElementById("submit");
        submiting()
        console.log("test completed")
      }
    }
  }else{
    //next question
    choicesSelected = 0
    responseToChoice = []

    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${questions.length}`;
    //Update the progress bar
    progressBarFull.style.width = `${(questionCounter / questions.length) * 100}%`;

    const questionIndex = questionCounter - 1 ;
    currentQuestion = availableQuesions[questionIndex];
    // show report Button
    if(currentQuestion.chapter == "PMC MDCAT 2021"){
      reportButton.href = "/mcq/report/"+currentQuestion._id
    }else{
      reportButton.style.display = 'none'
    }
    question.innerHTML = currentQuestion.question;
    // update subject & chapter titles
    subjectTitle.innerText = currentQuestion.subject
    chapterTitle.innerText = currentQuestion.chapter
    // MathJax.typeset()
    // choices
    var choicesString = ''
    for(var choiceIndex = 0 ; currentQuestion.choice.length >= choiceIndex ; choiceIndex++){
      if(currentQuestion.choice.length > choiceIndex){
        choicesString += `<div class="choice-container"><p class="choice-prefix">&#${65 + choiceIndex}</p><p class="choice-text" data-number="${1 + choiceIndex}">Choice </p></div>`
      }else{
        choicesContainer.innerHTML = choicesString
        choices = Array.from(document.getElementsByClassName("choice-text"));
        choices.forEach(choice => {
          const number = choice.dataset["number"];
          choice.innerHTML = currentQuestion.choice[number - 1];
          // MathJax.typeset()
        });
        choices.forEach(choice => {
          choice.addEventListener("click", e => {
            if (!acceptingAnswers) return;
            // each mcqs time pusher
            timeForEachMcq[questionCounter - 1] = timerForEachMcq
            timerForEachMcq = 0 ;

            // choice checking
            acceptingAnswers = true;
            const selectedChoice = e.target;
            const selectedAnswer = selectedChoice.dataset["number"];
            if(!responseToChoice.includes(selectedAnswer)){
              responseToChoice.push(selectedAnswer)
            }
            const classToApply =
              selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

            selectedChoice.parentElement.classList.add(classToApply);

            if(responseToChoice.length == currentQuestion.answer.length){
              returnFromCorrectness = checkCorrectness(currentQuestion.answer , responseToChoice)
              console.log(!returnFromCorrectness)

              if(!returnFromCorrectness){
                keyOfCorrectness[questionCounter - 1] = +4
                incrementScore(4)
              }else{
                keyOfCorrectness[questionCounter - 1] = -1
                incrementScore(-1)
              }
              userKey[questionCounter - 1] = responseToChoice
              setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
              }, 500);
            }
          });
        });
      }
    }
    acceptingAnswers = true;
  }
};

function checkCorrectness(answer , userRes){
  correctness = Array(answer.length).fill(false)

  for(var i = 0 ; answer.length >= i ; i++ ) {
    if(answer.length == i ){
      return correctness.includes(false);
    }else{
      if( userRes.includes(answer[i])){
        correctness[i] = true
      }
    }
  }
}



skipButton.addEventListener('click', ()=>{
  keyOfCorrectness[questionCounter - 1] = 0
  userKey[questionCounter - 1] = ["0"]
  getNewQuestion();
})

incrementScore = num => {
  score += num;
  // scoreText.innerText = score;
};
function submiting(){
  submit.addEventListener("click" , function(){
    submit.style.display = 'none'
    submitQuiz = {
      quizId ,
      username : currentUser.value,
      key : userKey ,
      userScore : score ,
      keyOfCorrectness  ,
      timeForEachMcq
    }
    const options = {
      method : 'POST' ,
      headers : {
        'Content-type' : 'application/json'
      },
      body : JSON.stringify(submitQuiz)
    }
    fetch("https://www.grademy.org/newcustomquiz" , options);
  })
}
//categorycheck
function checkCategory(quiz) {
  return new Promise((resolve,reject)=>{
    if (category.value == "MDCAT"){
      if(quiz.subjects.length ==1 ){
        if(quiz.subjects[0] == "math"){
          return window.location.assign("/MDCAT_STUDENTS_CANNOT_SOLVE_MATH");
        }else{
          resolve()
        }
      }
      for(cc = 0 ; cc < quiz.subjects.length ; cc++){
        if(quiz.subjects[cc]=="math"){
          return window.location.assign("/MDCAT_STUDENTS_CANNOT_SOLVE_MATH");
        }
        if(cc = quiz.subjects.length -1 ){
          resolve()
        }
      }
    }
    if (category.value == "FUNG"){
      if(quiz.subjects.length ==1 ){
        if(quiz.subjects[0] == "biology"){
          return window.location.assign("/FUNG_STUDENTS_CANNOT_SOLVE_BIOLOGY");
        }else{
          resolve()
        }
      }
      for(ccf = 0 ; ccf < quiz.subjects.length ; ccf++){
        if(quiz.subjects[ccf]=="biology"){
          return window.location.assign("/FUNG_STUDENTS_CANNOT_SOLVE_BIOLOGY");
        }
        if(cc = quiz.subjects.length -1 ){
          resolve()
        }
      }
    }
  })
}

// timer =========================================================
startTimerNow = (length , time) => {
      
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = (length * time )/2;
    const ALERT_THRESHOLD = (length * time )/4;

    const COLOR_CODES = {
      info: {
        color: "green"
      },
      warning: {
        color: "orange",
        threshold: WARNING_THRESHOLD
      },
      alert: {
        color: "red",
        threshold: ALERT_THRESHOLD
      }
    };
    const TIME_LIMIT = time* length ;
    let timePassed = 0;
    let timeLeft = TIME_LIMIT;
    let timerInterval = null;
    let remainingPathColor = COLOR_CODES.info.color;

    document.getElementById("app").innerHTML = `
    <div class="base-timer">
      <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <g class="base-timer__circle">
          <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
          <path
            id="base-timer-path-remaining"
            stroke-dasharray="283"
            class="base-timer__path-remaining ${remainingPathColor}"
            d="
              M 50, 50
              m -45, 0
              a 45,45 0 1,0 90,0
              a 45,45 0 1,0 -90,0
            "
          ></path>
        </g>
      </svg>
      <span id="base-timer-label" class="base-timer__label">${formatTime(
        timeLeft
      )}</span>
    </div>
    `;

    startTimer();

    function onTimesUp() {
      clearInterval(timerInterval);
    }

    function startTimer() {
      timerInterval = setInterval(() => {
        timePassed = timePassed += 1;
        timeLeft = TIME_LIMIT - timePassed;
        document.getElementById("base-timer-label").innerHTML = formatTime(
          timeLeft
        );
        setCircleDasharray();
        setRemainingPathColor(timeLeft);

        if (timeLeft === 0) {
          onTimesUp();
        }
      }, 1000);
    }

    function formatTime(time) {
      const minutes = Math.floor(time / 60);
      let seconds = time % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    }

    function setRemainingPathColor(timeLeft) {
      const { alert, warning, info } = COLOR_CODES;
      if (timeLeft <= alert.threshold) {
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(warning.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.add(alert.color);
      } else if (timeLeft <= warning.threshold) {
        document
          .getElementById("base-timer-path-remaining")
          .classList.remove(info.color);
        document
          .getElementById("base-timer-path-remaining")
          .classList.add(warning.color);
      }
    }

    function calculateTimeFraction() {
      const rawTimeFraction = timeLeft / TIME_LIMIT;
      return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
    }

    function setCircleDasharray() {
      const circleDasharray = `${(
        calculateTimeFraction() * FULL_DASH_ARRAY
      ).toFixed(0)} 283`;
      document
        .getElementById("base-timer-path-remaining")
        .setAttribute("stroke-dasharray", circleDasharray);
    }
}
// side panel
getSidebar = () => {
  unattempted = 0;
  sidebarHTMLString = ''
  for(var i = 0 ; keyOfCorrectness.length >= i ; i++){
    if(keyOfCorrectness.length == i){
      sideBar.innerHTML = sidebarHTMLString
      indexBtns = Array.from(document.getElementsByClassName("indexBtn"));
      indexBtns.forEach(btn => {
        btn.addEventListener("click", e => {
          timerForEachMcq = 0 ;
          const selectedIndex = e.target;
          const selectedIndexNumber = selectedIndex.dataset["number"];
          questionCounter = selectedIndexNumber;
          getNewQuestion();
        });
      });
    }else{
      if(keyOfCorrectness[i] == 0 ){
        // skipped
        sidebarHTMLString += `<div class="btn ml-3 btn-ls btn-warning indexBtn" style="width: fit-content;" data-number="${i}">${i+1}</div>`
      }else{
        if(!keyOfCorrectness[i]){
          // not attempted
          unattempted++
          sidebarHTMLString += `<div class="btn ml-3 btn-ls btn-secondary indexBtn" style="width: fit-content;" data-number="${i}">${i+1}</div>`
        }
        if(keyOfCorrectness[i] == 4 || keyOfCorrectness[i] == -1  ){
          // attempted
          sidebarHTMLString += `<div class="btn ml-3 btn-ls btn-success indexBtn" style="width: fit-content;" data-number="${i}">${i+1}</div>`
        }
      }
    }
  }
}

function openNav() {
  document.getElementById("mySidepanel").style.width = "330px";
}

function closeNav() {
  document.getElementById("mySidepanel").style.width = "0";
}
