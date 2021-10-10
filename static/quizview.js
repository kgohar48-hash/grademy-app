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

//leader board
quizPositions = {
    positionname1 : document.getElementById("1quizpositionname"),
    positionname2 : document.getElementById("2quizpositionname"),
    positionname3 : document.getElementById("3quizpositionname"),
    positionname4 : document.getElementById("4quizpositionname"),
    positionname5 : document.getElementById("5quizpositionname"),
    positionscore1  : document.getElementById("1quizpositionscore") ,
    positionscore2  : document.getElementById("2quizpositionscore") ,
    positionscore3  : document.getElementById("3quizpositionscore") ,
    positionscore4  : document.getElementById("4quizpositionscore") ,
    positionscore5  : document.getElementById("5quizpositionscore") ,
    progressbar1 : document.getElementById("1quizpositionprogressbar"),
    progressbar2 : document.getElementById("2quizpositionprogressbar"),
    progressbar3 : document.getElementById("3quizpositionprogressbar"),
    progressbar4 : document.getElementById("4quizpositionprogressbar"),
    progressbar5 : document.getElementById("5quizpositionprogressbar")
} 
ctxQuizStats = document.getElementById('quizStats').getContext('2d');


var username = document.getElementById('username').value
var questionText = document.getElementById("questionText")
var choicesContainer = document.getElementById('choices-container')
var progressBarFull = document.getElementById("progressBarFull")
var progressText = document.getElementById("progressText")
var nextButton = document.getElementById("nextButton")
var previousButton = document.getElementById("previousButton")
const reportButton = document.getElementById("reportMcq")
var backButton      = document.getElementById('backButton')
const sideBar = document.getElementById("sidebar-container")
var avgTime = document.getElementById("avgTime")
var myTime = document.getElementById("myTime")
var subjectTitle = document.getElementById("subject")
var chapterTitle = document.getElementById("chapter")

var sidebarHTMLString = ''
var questionCounter = 0 ;
var key = []
var question = []
var keyOfCorrectness = []
var timeForEachMcq = []
var correct = 0 ;
var incorrect = 0 ;
var unattempted = 0;
var skipped = 0;
var totalAttempts = 0;

init();
async function init(){
    await fetchingData();
    getSidebar()
    quizStats()
    getQuestion(0);
}
// https://immense-waters-07682.herokuapp.com/data
// http://localhost:3000/data
//Questions fetch APi
function fetchingData (){
    return new Promise((resolve,reject)=>{
        var client = new HttpClient();
        client.get('https://www.grademy.org/data',async function(res) {
            quiz = JSON.parse(res) 
            console.log(quiz)
            getKeyOfCorrectness()
            questions = quiz.mcqs
            await leaderboard(quiz.solvedBy , quizPositions , questions.length*4 );
            resolve();
                      
        });
    }).catch(err =>{
        console.log(err)
        });
}

async function getQuestion(i){
    getSidebar() // re-rendering sidebar
    if(i != 0){
        questionCorrectnessChart.destroy()
    }
    
    correctResponse = 0;
    incorrectResponce = 0 ;
    skippedResponce = 0 ;
    
    questionCounter = i + 1
    progressBarFull.style.width = `${(questionCounter / questions.length) * 100}%`;
    progressText.innerText = `Question ${questionCounter}/${questions.length}`;
    questionText.innerHTML = questions[i].question
    currentQuestion = questions[i]
    // show report Button
    if(currentQuestion.chapter == "PMC MDCAT 2021"){
        reportButton.href = "/mcq/report/"+currentQuestion._id
      }else{
        reportButton.style.display = 'none'
      }
    // choices
    var choicesString = ''
    totalAttempts = currentQuestion.userResponse.reduce((a, b) => a + b, 0)
    console.log(totalAttempts)
    for(var choiceIndex = 0 ; currentQuestion.choice.length >= choiceIndex ; choiceIndex++){
      if(currentQuestion.choice.length > choiceIndex){
        choicesString += `<div class="choice-container" id="option&#${65 + choiceIndex}"><p class="choice-prefix">&#${65 + choiceIndex}</p><p class="choice-text" style="background:linear-gradient(to right, #CDF4F0  ${(currentQuestion.userResponse[choiceIndex+1]/totalAttempts)*100}%,#ffffff ${(currentQuestion.userResponse[choiceIndex+1]/totalAttempts)*100}%);  " data-number="${1 + choiceIndex}">Loading </p></div><span class="">${Math.round((currentQuestion.userResponse[choiceIndex+1]/totalAttempts)*100)}%</span>`
      }else{
        choicesContainer.innerHTML = choicesString
        choices = Array.from(document.getElementsByClassName("choice-text"));
        var choiceNumber = 0
        choices.forEach(choice => {
            choiceNumber++
            const number = choice.dataset["number"];
            choice.innerHTML = currentQuestion.choice[number - 1];
            // MathJax.typeset()
            // for correct
            if(currentQuestion.answer == choiceNumber){
                correctResponse = currentQuestion.userResponse[choiceNumber]
                choice.parentElement.classList.add("correct")
            }else{
                // if incorrect
                incorrectResponce += currentQuestion.userResponse[choiceNumber]
                if(key[i] == choiceNumber){
                    choice.parentElement.classList.add("incorrectt")
                }
            }
        });
      }
    }
    // subject & chapter title
    subjectTitle.innerText = currentQuestion.subject
    chapterTitle.innerText = currentQuestion.chapter

    // avg time
    avgTime.innerText = currentQuestion.avgCorrectTime.toFixed(2)
    myTime.innerText = timeForEachMcq[i]
    // chart of correctness
    ctxQuestionCorrectness = document.getElementById('questionCorrectness').getContext('2d');
    questionCorrectnessChart =  new Chart(ctxQuestionCorrectness, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [correctResponse, incorrectResponce, totalAttempts - (correctResponse + incorrectResponce)],
                backgroundColor: [
                    '#3ed124',
                    '#de290d',
                    '#615a59'
                ],
                borderColor: [
                    '#3ed124',
                    '#de290d',
                    '#615a59'
                ],
                borderWidth: '1',
                hoverBorderWidth: '5'
            }],
            labels: [
                'Correct',
                'Incorrect',
                'Skipped'
            ]
        },
        options: {
            title: {
                text: 'Question stats',
                display: true,
                fontSize: 18
            },
            animation: {
                animateScale: true
            },
            tooltips: {
                callbacks: {
                    label: function (tooltipItem_1, data) {
                        try {
                            let label = ' ' + data.labels[tooltipItem_1.index] || '';

                            if (label) {
                                label += ': ';
                            }

                            const sum = data.datasets[0].data.reduce((accumulator, curValue) => {
                                return accumulator + curValue;
                            });
                            const value = data.datasets[tooltipItem_1.datasetIndex].data[tooltipItem_1.index];

                            label += Number((value / sum) * 100).toFixed(2) + '%';
                            return label;
                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        }
    });    

}

nextButton.addEventListener('click',()=>{
    if(questionCounter < questions.length  ){
        optionA.classList.remove("correct")
        optionB.classList.remove("correct")
        optionC.classList.remove("correct")
        optionD.classList.remove("correct")
        optionA.classList.remove("incorrectt")
        optionB.classList.remove("incorrectt")
        optionC.classList.remove("incorrectt")
        optionD.classList.remove("incorrectt")
        previousButton.style.display = 'block'
        getQuestion(questionCounter);
    }
    else{
        nextButton.style.display = 'none'
        backButton.style.display = 'block'
    }
})
previousButton.addEventListener('click',()=>{
    if (questionCounter > 1){
        questionCounter -= 2
        optionA.classList.remove("correct")
        optionB.classList.remove("correct")
        optionC.classList.remove("correct")
        optionD.classList.remove("correct")
        optionA.classList.remove("incorrectt")
        optionB.classList.remove("incorrectt")
        optionC.classList.remove("incorrectt")
        optionD.classList.remove("incorrectt")
        nextButton.style.display = 'block'
        backButton.style.display = 'none'
        getQuestion(questionCounter);
    }
    else{
        previousButton.style.display = 'none'
        return
    }
    
})
// getting the key of correctness
getKeyOfCorrectness = () =>{  
    var position = 0
    quiz.solvedBy.forEach(solved => {
        if(username == solved.username){
            key = solved.key
            keyOfCorrectness = solved.keyOfCorrectness
            timeForEachMcq = solved.timeForEachMcq
            myStats(solved , position)
            return 
        }else{
            position++
        }
    });
}
// side panel
getSidebar = () => {
    sidebarHTMLString = ''
    for(var i = 0 ; keyOfCorrectness.length >= i ; i++){
      if(keyOfCorrectness.length == i){
        sideBar.innerHTML = sidebarHTMLString
        indexBtns = Array.from(document.getElementsByClassName("indexBtn"));
        indexBtns.forEach(btn => {
          btn.addEventListener("click", e => {
            const selectedIndex = e.target;
            const selectedIndexNumber = selectedIndex.dataset["number"];
            questionCounter = selectedIndexNumber;
            getQuestion(Number(selectedIndexNumber));
          });
        });
      }else{
        if(keyOfCorrectness[i] == 0 ){
          // skipped
          skipped++
          sidebarHTMLString += `<div class="btn ml-3 btn-ls btn-warning indexBtn" style="width: fit-content;" data-number="${i}">${i+1}</div>`
        }else{
          if(!keyOfCorrectness[i]){
            // not attempted
            unattempted++
            sidebarHTMLString += `<div class="btn ml-3 btn-ls btn-secondary indexBtn" style="width: fit-content;" data-number="${i}">${i+1}</div>`
          }
          if(keyOfCorrectness[i] == 4  ){
            // attempted but correct
            correct++
            sidebarHTMLString += `<div class="btn ml-3 btn-ls btn-success indexBtn" style="width: fit-content;" data-number="${i}">${i+1}</div>`
          }
          if( keyOfCorrectness[i] == -1   ){
            // attempted but incorrect
            incorrect++
            sidebarHTMLString += `<div class="btn ml-3 btn-ls btn-danger indexBtn" style="width: fit-content;" data-number="${i}">${i+1}</div>`
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
//leader board function 
function leaderboard(positionArray , obj , totalScore ){
    return new Promise((resolve,reject)=>{
        for(lb=0 ;  5 >= lb ; lb++){
            if(5 == lb){
                resolve();
            }else{
                var j = lb+1
                console.log(j)
                var txtscore = "positionscore"+j.toString()
                var txtname = "positionname"+j.toString()
                var txtprogress = "progressbar"+j.toString()
    
                obj[txtscore].innerHTML = positionArray[lb].userScore
                obj[txtname].innerHTML = positionArray[lb].username
                obj[txtprogress].style.width = `${(positionArray[lb].userScore / totalScore) * 100}%`;
            }
        }
        
    }).catch(err =>{
        console.log(err)
        });
}
 
// my stats
function myStats (solved , position){
    getSidebar()
    var myScore = document.getElementById("myScore")
    var myPosition = document.getElementById("myPosition")
    var myCorrect = document.getElementById("myCorrect")
    var myIncorrect = document.getElementById("myIncorrect")
    var mySkipped = document.getElementById("mySkipped")
    myScore.innerText = solved.userScore
    myPosition.innerText = position + 1
    myCorrect.innerText = correct
    myIncorrect.innerText = incorrect
    mySkipped.innerText = skipped
   
}

function quizStats(){
    var attempts = quiz.solvedBy
    quizStatsData = {
        marksArray : Array(quiz.mcqs.length*4),
        numberOfStudents : Array(quiz.mcqs.length*4).fill(0)
    }
    attempts.forEach(attempt => {
        if(attempt.userScore > 0){
            quizStatsData.numberOfStudents[attempt.userScore - 1]++
        }
    });
    for(var i = 0 ; quiz.mcqs.length*4 >= i ; i++){
        if(quiz.mcqs.length*4 == i){
            quizStatsChart(ctxQuizStats ,"Quiz Summary" )
        }
        quizStatsData.marksArray[i] = i
    }

}

function quizStatsChart(ctx ,title){
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: quizStatsData.marksArray,
            datasets: [
                {
                label: 'Number Of Students',
                data: quizStatsData.numberOfStudents,
                backgroundColor : '#3A506B',
                borderWidth: 0.5
            }
        ]
        },
        options: {
            title: {
                display: true,
                fontSize: 18,
                text: title
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: false,
            scales: {
                xAxes: [{
                   
                    stacked : true
                }],
                yAxes: [{
                    stacked : true
                }]
            }
        }
    });
}


// extracting same data repeatedly