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
var listOfChapters = [
    "Bio-diversity",
    "Bio-energetic",
    "Biological molecules",
    "Cell structure and function",
    "Coordination and control/nervous & chemical coordination",
    "Diversity among animals",
    "Enzymes",
    "Evolution",
    "Life process in animals and plants (nutrition/gaseous exchange/transport)",
    "Prokaryotes",
    "Reproduction",
    "Support and movement",
    "Variation and genetics/inheritance",
    "Wrong MCQ",
    "None of these chapters",
    "Skip"
]

var username = document.getElementById('username').value
var questionText = document.getElementById("questionText")
var choicesContainer = document.getElementById('choices-container')
var progressBarFull = document.getElementById("progressBarFull")
var progressText = document.getElementById("progressText")
var nextButton = document.getElementById("nextButton")
var previousButton = document.getElementById("previousButton")
const submitButton = document.getElementById("submit-button");
const sideBar = document.getElementById("sidebar-container")

var chapterContainer = document.getElementsByClassName("chapter-container")
var chapterContainerHTML = ''
var selectedChapters = []
var questionCounter = 0 ;
var question = []

init();
async function init(){
    await fetchingData();
    getQuestion(0);
}
// https://immense-waters-07682.herokuapp.com/data
// http://localhost:3000/data
//Questions fetch APi
function fetchingData (){
    return new Promise((resolve,reject)=>{
        var client = new HttpClient();
        client.get('https://www.grademy.org/sort/biology',async function(res) {
            mcqs = JSON.parse(res) 
            console.log(mcqs)
            questions = mcqs
            
            resolve();          
        });
    }).catch(err =>{
        console.log(err)
        });
}

async function getQuestion(i){
   
    if(selectedChapters.length == mcqs.length){
        submitButton.innerHTML = '<form action="/sorting/redirect" method="POST"><button class="btn btn-primary btn-lg" id="submit">Submit</button></form>'
        const submit = document.getElementById("submit");
        submiting()
        console.log("done sorting")
    }
    if(i == 20){
        nextButton.style.display = 'none'
    }
    questionCounter = i + 1
    progressBarFull.style.width = `${(questionCounter / questions.length) * 100}%`;
    progressText.innerText = `Question ${questionCounter}/${questions.length}`;
    questionText.innerHTML = questions[i].question
    currentQuestion = questions[i]
    // chapter box
    chapterSelected = false
    chapterNumber = 0
    for(var c = 0 ; selectedChapters.length > c ; c++){
        if(selectedChapters[c].id == currentQuestion._id ){
            chapterSelected = true
            chapterNumber = selectedChapters[c].dataNumber
        }
    }
    
    chapterAdded = false
    chapterContainerHTML = ''
    for(var n = 0 ; listOfChapters.length >= n ; n++){
        if(listOfChapters.length == n){
            chapterContainer[0].innerHTML = chapterContainerHTML
            chapterboxes = Array.from(document.getElementsByClassName("chapterbox"));
            chapterboxes.forEach(box => {
                box.addEventListener("click", e => {
                  const selectedBox = e.target.dataset["number"];
                  chapterAdded = false
                  selectedChapterArrayLength = selectedChapters.length
                  for(var t = 0; selectedChapterArrayLength >= t; t++){
                      if(selectedChapterArrayLength == t && !chapterAdded){
                          console.log("adding brand new")
                        selectedChapters.push({
                            id : currentQuestion._id,
                            chapter : listOfChapters[selectedBox],
                            dataNumber : selectedBox
                        })
                        e.target.classList.add('selectedChapter');
                        chapterAdded = true
                        getQuestion(i)
                      }else{
                          if(t != selectedChapterArrayLength){
                            if(currentQuestion._id == selectedChapters[t].id && !chapterAdded){
                                selectedChapters.splice(t,1)
                                console.log("splice")
                                selectedChapters.push({
                                    id : currentQuestion._id,
                                    chapter : listOfChapters[selectedBox],
                                    dataNumber : selectedBox
                                })
                                chapterAdded = true
                                e.target.classList.add('selectedChapter');
                                t = selectedChapterArrayLength
                                getQuestion(i)
                            }
                          }
                      }
                  }
                  
                });
              });
        }else{
            if(chapterSelected && n == chapterNumber){
                chapterContainerHTML += `<div class="col-md-3 selectedChapter chapterbox mb-2 ml-2" data-number="${n}">${listOfChapters[n]} </div>`
            }else{
                chapterContainerHTML += `<div class="col-md-3 chapterbox mb-2 ml-2" data-number="${n}">${listOfChapters[n]} </div>`
            }
        }
    }
    // choices
    var choicesString = ''
    totalAttempts = currentQuestion.userResponse.reduce((a, b) => a + b, 0)
    for(var choiceIndex = 0 ; currentQuestion.choice.length >= choiceIndex ; choiceIndex++){
      if(currentQuestion.choice.length > choiceIndex){
        choicesString += `<div class="choice-container" id="option&#${65 + choiceIndex}"><p class="choice-prefix">&#${65 + choiceIndex}</p><p class="choice-text"  data-number="${1 + choiceIndex}">Loading </p></div>`
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
            }
        });
      }
    }
      
}
function submiting(){
    submit.addEventListener("click" , function(){
      submit.style.display = 'none'
      const options = {
        method : 'POST' ,
        headers : {
          'Content-type' : 'application/json'
        },
        body : JSON.stringify(selectedChapters)
      }
      fetch("https://www.grademy.org/sorting/biology" , options);
    })
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
