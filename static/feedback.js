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
  const progressBarFull = document.getElementById("progressBarFull");
  const submitButton = document.getElementById("submit-button");
  const currentUser = document.getElementById("username");
  const academyId = document.getElementById("academyId").value
  var choices =[];
  let currentQuestion = {};
  let acceptingAnswers = false;
  let questionCounter = 0;
  let availableQuesions = [];
  let userKey = [];
  let questions = [];
  let ownerId = '' ;
  
  // https://immense-waters-07682.herokuapp.com/data
  // http://localhost:3000/data
  //Questions fetch APi
  var client = new HttpClient();
      client.get('https://www.grademy.org/data',async function(res) {
        var loadedQuiz = JSON.parse(res)
        console.log(loadedQuiz)
        questions = [{
            question : "<h1>How much fun the classes are ?</h1><p class='text-muted mt-4'>It is the measure of how fun, creative & engaging the video sessions of this instructor are : </p>",
            choice : ["1","2","3","4","5","6","7","8","9","10"],
            answer : ["1"]
        },{
            question : "<h1>How engergatic this instructor is ?</h1><p class='text-muted mt-4'>Its is the measure of how much energatic the instructor is during his/her live-recorded sessions, with how much energy does he/she appear in every live-recorded sessions :</p>",
            choice : ["1","2","3","4","5","6","7","8","9","10"],
            answer : ["1"]
        },{
            question : "<h1>How strong grip does ths istructor has over the subject ?</h1><p class='text-muted mt-4'>It is the measure of how much the background knowledge does the intrustor have regarding the subject he/she is teaching :</p>",
            choice : ["1","2","3","4","5","6","7","8","9","10"],
            answer : ["1"]
        },{
            question : "<h1>How good the teaching methodology of this instructor is ?</h1><p class='text-muted mt-4'>Don't confuse it with the subject grip. Teaching methodology is the measure of how good an instructor pass on the knowledge to his/her students, how good he/she build up the topics so that its easier for every student to understand</p>",
            choice : ["1","2","3","4","5","6","7","8","9","10"],
            answer : ["1"]
        },{
            question : "<h1>How much production quality does ths instrustor offer in his/her live-recorded sessions ?</h1><p class='text-muted mt-4'>Production quality is the measure of how much effort does the instructor put in his/her live sessions & videos. i.e animations, editing, audio & video quality.</p>",
            choice : ["1","2","3","4","5","6","7","8","9","10"],
            answer : ["1"]
        },{
            question : "<h1>How much you are satisfied with the content provided by this instructor ?</h1><p class='text-muted mt-4'>It is the measure of how likly would you recomment this instructor to your friends : </p>",
            choice : ["1","2","3","4","5","6","7","8","9","10"],
            answer : ["1"]
        },]
        
        startGame();
    });
  
  startGame = () => {
    questionCounter = 0;
    availableQuesions = [...questions];
    userKey = new Array(questions.length)
    getNewQuestion();
  };
  
  getNewQuestion = () => {
    if (availableQuesions.length === 0 || questionCounter >= questions.length) {
      submitButton.innerHTML = '<form action="/academy/dummy/'+academyId +'" method="POST"><input type="hidden" name="ownerId" value="'+userKey+'"><button  class="btn btn-primary btn-lg" id="submit">Submit</button></form>'
        submit = document.getElementById("submit");
      submiting()
      console.log("test completed")      
    }else{
      //next question
      questionCounter++;
      progressText.innerText = `Question ${questionCounter}/${questions.length}`;
      //Update the progress bar
      progressBarFull.style.width = `${(questionCounter / questions.length) * 100}%`;
  
      const questionIndex = questionCounter - 1 ;
      currentQuestion = availableQuesions[questionIndex];
      question.innerHTML = currentQuestion.question;
      // choices
      var choicesString = ''
      for(var choiceIndex = 0 ; currentQuestion.choice.length >= choiceIndex ; choiceIndex++){
        if(currentQuestion.choice.length > choiceIndex){
          choicesString += `<div class="choice-container col-md-6"><p class="choice-prefix">&#${65 + choiceIndex}</p><p class="choice-text" data-number="${1 + choiceIndex}">Choice </p></div>`
        }else{
          choicesContainer.innerHTML = choicesString
          choices = Array.from(document.getElementsByClassName("choice-text"));
          choices.forEach(choice => {
            const number = choice.dataset["number"];
            choice.innerHTML = currentQuestion.choice[number - 1];
          });
          choices.forEach(choice => {
            choice.addEventListener("click", e => {
              if (!acceptingAnswers) return;
              // choice checking
              acceptingAnswers = false;
              const selectedChoice = e.target;
              const selectedAnswer = selectedChoice.dataset["number"];
              userKey[questionCounter - 1] = selectedAnswer
              const classToApply =
                selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";
          
              selectedChoice.parentElement.classList.add(classToApply);
              setTimeout(() => {
                selectedChoice.parentElement.classList.remove(classToApply);
                getNewQuestion();
              }, 500);
            });
          });
        }
      }
      acceptingAnswers = true;
    }
  };
  
  function submiting(){
    submit.addEventListener("click" , function(){
      submit.style.display = 'none'
      submitQuiz = userKey
      const options = {
        method : 'POST' ,
        headers : {
          'Content-type' : 'application/json'
        },
        body : JSON.stringify(submitQuiz)
      }
      fetch("https://www.grademy.org/academy/feedback/"+academyId , options);
    })
  }
