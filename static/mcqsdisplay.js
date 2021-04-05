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

var questionText = document.getElementById("questionText")
var choicesContainer = document.getElementById('choices-container')
var progressBarFull = document.getElementById("progressBarFull")
var progressText = document.getElementById("progressText")
var nextButton = document.getElementById("nextButton")
var previousButton = document.getElementById("previousButton")
var backButton      = document.getElementById('backButton')
const sideBar = document.getElementById("sidebar-container")
var avgTime = document.getElementById("avgTime")
var myTime = document.getElementById("myTime")
var subjectTitle = document.getElementById("subject")
var chapterTitle = document.getElementById("chapter")

var sidebarHTMLString = ''
var questionCounter = 0 ;
var key = []
var questions = []
var subjects = []
var keyOfCorrectness = []
var correct = 0 ;
var incorrect = 0 ;
var unattempted = 0;
var skipped = 0;

init();
async function init(){
    await fetchingData();
    getSidebar()
    getQuestion(0);
}
// https://immense-waters-07682.herokuapp.com/data
// http://localhost:3000/data
//Questions fetch APi
async function fetchingData (){
    try {
        return new Promise((resolve, reject) => {
            var client = new HttpClient();
            client.get('https://protected-mesa-71767.herokuapp.com/data', async function (res) {
                data = JSON.parse(res);
                console.log(data);
                if (data.category != "incorrect") {
                    questions = data.mcqs;
                    key = Array(data.mcqs.length).fill(["0"]);
                    keyOfCorrectness = Array(data.mcqs.length).fill("4");
                } else {
                    keyOfCorrectness = Array(data.mcqs.length).fill("-1")
                    await arrangeMcqs();
                }
                resolve();
            });
        });
    } catch (err) {
        console.log(err);
    }
}

function arrangeMcqs(){
    return new Promise((resolve,reject)=>{
        for(var i = 0 ; data.mcqs.length >= i ; i++){
            if(data.mcqs.length == i ){
                resolve()
            }else{
                questions.push(data.mcqs[i].id)
                key.push(data.mcqs[i].attempted)
            }
        }
    })
}

async function getQuestion(i){
    getSidebar() // re-rendering sidebar
    if(i != 0){
        questionCorrectnessChart.destroy()
    }
    questionCounter = i + 1
    progressBarFull.style.width = `${(questionCounter / questions.length) * 100}%`;
    progressText.innerText = `Question ${questionCounter}/${questions.length}`;
    questionText.innerHTML = questions[i].question
    currentQuestion = questions[i]
    // choices
    var choicesString = ''
    var totalAttempts = currentQuestion.skipped + currentQuestion.correct +currentQuestion.incorrect 
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
                choice.parentElement.classList.add("correct")
            }else{
                // if incorrect
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
    // chart of correctness
    ctxQuestionCorrectness = document.getElementById('questionCorrectness').getContext('2d');
    questionCorrectnessChart =  new Chart(ctxQuestionCorrectness, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [currentQuestion.correct, currentQuestion.incorrect, currentQuestion.skipped],
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




