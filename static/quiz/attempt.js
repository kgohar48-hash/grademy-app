
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
  client.get('https://www.grademy.org/quiz/api/'+document.getElementById("quiz-id").value,async function(res) {
    data = JSON.parse(res).foundQuiz
    user = JSON.parse(res).currentuser

const startButton = document.querySelector('.start_button');
const infoBox = document.querySelector('.info_box');
const quizBox = document.querySelector('.quiz_box');
const quizSub = infoBox.querySelector('.sub');
const quizChap = infoBox.querySelector('.chap');
const num = infoBox.querySelector('.num');
const exitButton = infoBox.querySelector('.quit');
const continueButton = infoBox.querySelector('.start');
const quizTitle = quizBox.querySelector('.title');
const tMin = quizBox.querySelector('.timer_min');
const tSec = quizBox.querySelector('.timer_sec');
const iMin = parseInt(tMin.textContent);
const iSec = parseInt(tSec.textContent);
const timeLine = quizBox.querySelector('.time_line');
const queText = quizBox.querySelector('.que_text');
const optionList = quizBox.querySelector('.option_list');
const totalQue = quizBox.querySelector('.total_que');
const nextButton = quizBox.querySelector('.next_btn');
const skipButton = quizBox.querySelector('.skip_btn');
const toggler = quizBox.querySelector('.t_buttons');
const tButtons = toggler.children;
const options = optionList.children;
const finish = quizBox.querySelector('.finish');
const resultBox = document.querySelector('.result_box');
const cNum = resultBox.querySelector('.correct_text b');
const iNum = resultBox.querySelector('.incorrect_text b');
const sNum = resultBox.querySelector('.skip_text b');
const reviewButton = resultBox.querySelector('.review');
const quitButton = resultBox.querySelector('.quit');

var timeElement = document.getElementById("timefortest")
skipped = 0
correct = 0
incorrect = 0

var userObject = {
    key: [],
    keyOfCorrectness: [],
    timeForEachMcq: [],
    quizId : data._id,
    username: user.username,
    userScore: 0
}
const isDisplayed = [];
const userResponse = [];
for (let i = 0; i < data.mcqs.length ; i++) {
    isDisplayed.push(false);
    userResponse.push(0);
    userObject.timeForEachMcq.push(0);
}
let currentIndex = 0;

startButton.addEventListener('click', () => {
    startButton.classList.toggle('hide')
    infoBox.classList.toggle('hide');
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
quizSub.textContent = capitalizeFirstLetter(data.mcqs[0].subject);
quizChap.textContent = data.mcqs[0].chapter;
num.textContent = data.mcqs.length;
timeElement.innerText = data.mcqs.length


exitButton.addEventListener('click', () => {
    infoBox.classList.toggle('hide');
    startButton.classList.toggle('hide')
})

continueButton.addEventListener('click', () => {
    infoBox.classList.toggle('hide');
    quizBox.classList.toggle('hide');
    startQuiz();
})

// quizTitle.append(document.createElement('span').textContent = `${capitalizeFirstLetter(data.mcqs[0].subject)} -`);
// quizTitle.append(document.createElement('br'));
// quizTitle.append(document.createElement('span').textContent = `${data.mcqs[0].chapter}`);

function startQuiz() {
    startTimer(data.mcqs.length, iSec);
    createToggler();
    displayQues(currentIndex);
}

function startTimer(min, sec) {
    counter = setInterval(timer, 1000);
    function timer() {
        sec--;
        if (sec < 0 && min > 0) {
            sec = 59;
            min--;
        }
        tSec.textContent = sec;
        tMin.textContent = min;
        if (sec < 10) {
            let addZero = tSec.textContent;
            tSec.textContent = "0" + addZero;
        }
        if (min < 10) {
            let addZero = tMin.textContent;
            tMin.textContent = "0" + addZero;
        }
        if (sec <= 0 && min == 0) {
            clearInterval(counter);
            endQuiz();
        }
        timeLineWidth(min, sec, iMin, iSec);
    }
}

function timeLineWidth(min, sec, iMin, iSec) {
    let width = (((iMin * 60 + iSec) - (min * 60 + sec)) / (iMin * 60 + iSec)) * 100;
    timeLine.style.width = width + '%';
}

function displayQues(index) {
    quizTitle.textContent = `${capitalizeFirstLetter(data.mcqs[index].subject)} - ${data.mcqs[index].chapter}`;

    queText.innerHTML = `<span><b>${index + 1}</b>.  ${capitalizeFirstLetter(data.mcqs[index].question)}</span>`;
    optionList.innerHTML = '<div class="option"><span>' + data.mcqs[index].choice[0] + '</span></div>'
        + '<div class="option"><span>' + data.mcqs[index].choice[1] + '</span></div>'
        + '<div class="option"><span>' + data.mcqs[index].choice[2] + '</span></div>'
        + '<div class="option"><span>' + data.mcqs[index].choice[3] + '</span></div>';
    qCounter(index);
    if (userResponse[index] != 0) {
        options[(userResponse[index] - 1)].classList.add('selected');
    }
    for (let i = 0; i < options.length; i++) {
        options[i].addEventListener('click', () => {
            options[i].classList.add('selected');
            for (let j = 0; j < options.length; j++) {
                j != i && options[j].classList.remove('selected');
            }
            userResponse[index] = i + 1;
            !tButtons[index].classList.contains('marked') && tButtons[index].classList.add('marked');
            tButtons[index].classList.contains('skipped') && tButtons[index].classList.remove('skipped');
            let n = 0;
            for (btn of tButtons) {
                if (btn.classList.contains('marked') || btn.classList.contains('skipped')) { n++ }
            }
            if (n === data.mcqs.length) { finish.classList.remove('hide') }
        })
    }
    queTimer(index);
    tButtons[index].classList.add('select');
    for (i = 0; i < tButtons.length; i++) {
        i != index && tButtons[i].classList.remove('select');
    }
}

function qCounter(index) {
    totalQue.innerHTML = `<span><p>${index + 1}</p> of <p>${data.mcqs.length}</p> Questions</span>`;
    currentIndex = index;
}

nextButton.addEventListener('click', () => {
    currentIndex++;
    if (currentIndex === (data.mcqs.length)) { currentIndex = 0 }
    clearInterval(qTimer);
    displayQues(currentIndex);
})

skipButton.addEventListener('click', () => {
    !tButtons[currentIndex].classList.contains('skipped') && tButtons[currentIndex].classList.add('skipped');
    tButtons[currentIndex].classList.contains('marked') && tButtons[currentIndex].classList.remove('marked');
    let n = 0;
    for (btn of tButtons) {
        if (btn.classList.contains('marked') || btn.classList.contains('skipped')) { n++ }
    }
    if (n === data.mcqs.length) { finish.classList.remove('hide') }
    userResponse[currentIndex] = 0;
    currentIndex++;
    if (currentIndex === (data.mcqs.length)) { currentIndex = 0 }
    clearInterval(qTimer);
    displayQues(currentIndex);
})

function createToggler() {
    for (i = 0; i < data.mcqs.length; i++) {
        let button = document.createElement('button');
        button.textContent = `${i + 1}`;
        button.classList.add('t_btn');
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

finish.addEventListener('click', () => {
    endQuiz();
})

reviewButton.addEventListener('click', () => {
    window.location = "https://www.grademy.org/dashboard/newcustomquiz/view/view/"+data._id
    // inset link to review page
})



function endQuiz() {
    clearInterval(qTimer);
    clearInterval(counter);
    quizBox.classList.toggle('hide');
    resultBox.classList.toggle('hide');
    let n = 0;
    for (let i = 0; i < userResponse.length; i++) {
        userObject.key.push([`${userResponse[i]}`]);
        if (userResponse[i] === 0) {
            skipped++
            userObject.keyOfCorrectness.push(0);
            n++;
        }
        else if (userObject.key[i][0] === data.mcqs[i].answer[0]) {
            correct++
            userObject.keyOfCorrectness.push(4);
        }
        else {
            incorrect++
            userObject.keyOfCorrectness.push(-1);
        }
    }
    cNum.textContent = correct;
    iNum.textContent = incorrect;
    sNum.textContent = n;
    userObject.userScore = userObject.keyOfCorrectness.reduce((a, b) => a + b);
     const options = {
        method : 'POST' ,
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify(userObject)
        }
        fetch("https://www.grademy.org/newcustomquiz" , options);
    
}
})

