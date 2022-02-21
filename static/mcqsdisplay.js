chapterObj = {}
fetch('https://www.grademy.org/mcqsattempted/'+document.getElementById("user-id").value)
.then(response => response.json())
.then(data => {
    username = data.username
    allmcqs = [...data.incorrect,...data.correct,...data.skipped]
    var commentsDisplay = document.getElementById('comment-display')
    var commentCount = document.getElementById('comment-count')
    const quizBox = document.querySelector('.quiz_box');
    const quizTitle = quizBox.querySelector('.title');
    const queText = quizBox.querySelector('.que_text');
    const optionList = quizBox.querySelector('.option_list');
    const totalQue = quizBox.querySelector('.total_que');
    const nextButton = quizBox.querySelector('.next_btn');
    const finishButton = quizBox.querySelector('.finish_btn')
    const toggler = quizBox.querySelector('.t_buttons');
    const tButtons = toggler.children;
    const options = optionList.children;
    var subjectArea = document.getElementById('subject-area')
    currentQuestionId = ''
    commentDisplayHtml = ''
    questionIndex = 0 // made for comment fuction to know the index
    var currentIndex = 0;
    const isDisplayed = [];
    userResponse = [];
    userKey = []
    for (let i = 0; i < allmcqs.length ; i++) {
        isDisplayed.push(false);
        if(i<data.incorrect.length){
            userResponse.push(allmcqs[i].attempted[0]);
        }else if(i < data.incorrect.length + data.correct.length){
            userResponse.push(allmcqs[i].id.answer[0]);
        }else if(i < data.incorrect.length + data.correct.length + data.skipped.length){
            userResponse.push('0');
        }
    }
    sortMCQs(allmcqs)
    displaySubjectArea()
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };
    
    function startQuiz(mcqs,userKey) {
        createToggler(userKey);
        displayQues(currentIndex,mcqs);
    }
    
    function displayQues(index,mcqs) {
        attempted = fetchAttempt(mcqs[index].id)
        quizTitle.textContent = `${capitalizeFirstLetter(mcqs[index].id.subject)} - ${mcqs[index].id.chapter}`;
        totalAttempts = mcqs[index].id.userResponse.reduce((a, b) => a + b, 0)
        queText.innerHTML = `<span><b>${index + 1}</b>.  ${capitalizeFirstLetter(mcqs[index].id.question)}</span>`;
        optionList.innerHTML = '<div class="option"><span>' + mcqs[index].id.choice[0] + '</span><span class="float_right">'+((mcqs[index].id.userResponse[1]/totalAttempts)*100).toFixed(0) +'%</span></div>'
            + '<div class="option"><span>' + mcqs[index].id.choice[1] + '</span><span class="float_right">'+((mcqs[index].id.userResponse[2]/totalAttempts)*100).toFixed(0) +'%</span></div>'
            + '<div class="option"><span>' + mcqs[index].id.choice[2] + '</span><span class="float_right">'+((mcqs[index].id.userResponse[3]/totalAttempts)*100).toFixed(0) +'%</span></div>'
            + '<div class="option"><span>' + mcqs[index].id.choice[3] + '</span><span class="float_right">'+((mcqs[index].id.userResponse[4]/totalAttempts)*100).toFixed(0) +'%</span></div>';
        qCounter(index);
        
        for(var i = 0 ; options.length > i;i++){
            options[i].style.background =`linear-gradient(to right, #cce5ff  ${(mcqs[index].id.userResponse[i+1]/totalAttempts)*100}%,aliceblue ${(mcqs[index].id.userResponse[i+1]/totalAttempts)*100}%)`
        }
        if(mcqs[index].id.answer[0] == attempted || attempted == "0"){
            options[(mcqs[index].id.answer[0] - 1)].classList.add('correct');
        }else{
            options[(attempted - 1)].classList.add('incorrect');
            options[(mcqs[index].id.answer[0] - 1)].classList.add('correct');
        }
        queTimer(index);
        tButtons[index].classList.add('select');
        for (i = 0; i < tButtons.length; i++) {
            i != index && tButtons[i].classList.remove('select');
        }
        // update mcq id for comment
        currentQuestionId = mcqs[index].id._id
        questionIndex = index
        commentCount.innerText = ''
        if(mcqs[index].id.comments.length != 0){
            commentCount.innerText = mcqs[index].id.comments.length
        }
        // display comments
        commentDisplayHtml = ''
        mcqs[index].id.comments.reverse().forEach(comment => {
            commentDisplayHtml += `<div class="row text-white">
                                            <div class="col-1">
                                                <img src="https://www.w3schools.com/howto/img_avatar.png" class="profile-icon " alt="Avatar">
                                            </div>
                                            <div class="col-9">
                                                <div>
                                                    <h6 class="float-left mr-1">
                                                        ${comment.author.username} :
                                                    </h6>
                                                </div>
                                                <div>
                                                    <p class="float-left">
                                                        ${comment.text}
                                                    </p>
                                                </div>
                                            </div>
                                            <div class="col-2">
                                            </div>
                                        </div>
                                        <hr style="border-top: 1px solid rgb(87, 87, 87); margin: 5px 10px;">`
        })
        commentsDisplay.innerHTML = commentDisplayHtml
    }
    
    function qCounter(index) {
        totalQue.innerHTML = `<span><p>${index + 1}</p> of <p>${mcqs.length}</p> Questions</span>`;
        currentIndex = index;
    }
    
    nextButton.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex === (mcqs.length)) { currentIndex = 0 }
        displayQues(currentIndex,mcqs);
    })
    
    finishButton.addEventListener('click', () => {
        window.location = "https://www.grademy.org/dashboard/quiz/redirect/"+quiz._id;
    })
    
    function createToggler(userKey) {
        toggler.innerHTML = ''
        for (i = 0; i < mcqs.length; i++) {
            let button = document.createElement('button');
            button.textContent = `${i + 1}`;
            button.classList.add('t_btn');
            if(mcqs[i].id.answer[0]==userKey[i]){
                button.classList.add('t_correct');
            }else{
                if(userKey[i]==0){
                    button.classList.add('t_skipped');
                }else{
                    button.classList.add('t_incorrect');
                }
            }
            button.addEventListener('click', () => {
                displayQues((parseInt(button.textContent) - 1),mcqs)
            })
            toggler.append(button);
        }
    }
    
    function queTimer(index) {
        if (isDisplayed[index] = false) {
            isDisplayed[index] = true;
        }        
    }
    // fetch user attempt
    function fetchAttempt(mcq){
        for(var i = 0 ; i <= mcq.solvedBy.length ; i++){
            if(i == mcq.solvedBy.length){
                return '0'
            }else{
                if(mcq.solvedBy[i].username == data.username){
                    return mcq.solvedBy[i].attempted[0]
                }
            }
        }
    }
    
    // comment btn action
    document.getElementById('comment-btn').addEventListener("click" , function(){
        const options = {
            method : 'POST' ,
            headers : {
            'Content-type' : 'application/json'
            },
            body : JSON.stringify({
                text : document.querySelector('.comment-text').value
            })
        }
        fetch("https://www.grademy.org/mcq/"+currentQuestionId+"/comment" , options);
        mcqs[questionIndex].id.comments.push({
            author : {
                username : username
            },
            text : document.querySelector('.comment-text').value
        })
        document.querySelector('.comment-text').value = ''
        displayQues(questionIndex,mcqs)
    })
    function sortMCQs(mcqs){
        for(var i = 0 ; i <= mcqs.length ; i++){
            if(i == mcqs.length){
            }else{
                if(typeof chapterObj[mcqs[i].id.subject] == 'undefined'){
                    // if that subject doesn't exist
                    chapterObj[mcqs[i].id.subject] = chapterObj[mcqs[i].id.subject] || {};
                }
                if(typeof chapterObj[mcqs[i].id.subject][mcqs[i].id.chapter] == 'undefined'){
                    // if that chapter doesn't exist
                    chapterObj[mcqs[i].id.subject][mcqs[i].id.chapter] = chapterObj[mcqs[i].id.subject][mcqs[i].id.chapter]|| {incorrect : [], correct : [], skipped : []};
                }
                if(userResponse[i] == mcqs[i].id.answer[0]){
                    chapterObj[mcqs[i].id.subject][mcqs[i].id.chapter].correct.push(mcqs[i])
                }else if(userResponse[i] == '0'){
                    chapterObj[mcqs[i].id.subject][mcqs[i].id.chapter].skipped.push(mcqs[i])
                }else{
                    chapterObj[mcqs[i].id.subject][mcqs[i].id.chapter].incorrect.push(mcqs[i])
                }
            }
        }
    }
    
    function selectedChapter(subject,chapter){
        userKey = []
        mcqs = [...chapterObj[subject][chapter].incorrect,...chapterObj[subject][chapter].correct,...chapterObj[subject][chapter].skipped]
        currentChapterMCQs = chapterObj[subject][chapter]
        for (let i = 0; i < mcqs.length ; i++) {
            if(i<currentChapterMCQs.incorrect.length){
                userKey.push(mcqs[i].attempted[0]);
            }else if(i < currentChapterMCQs.incorrect.length + currentChapterMCQs.correct.length){
                userKey.push(mcqs[i].id.answer[0]);
            }else if(i < currentChapterMCQs.incorrect.length + currentChapterMCQs.correct.length + currentChapterMCQs.skipped.length){
                userKey.push('0');
            }
        }
        startQuiz(mcqs,userKey);
    }
    // function to display subject chapter selection area
    function displaySubjectArea(){
        subjectAreaHTML = ''
        subjects = Object.keys(chapterObj)
        for(var i = 0 ; i <= subjects.length ; i++){
            if(i == subjects.length){
                subjectArea.innerHTML = subjectAreaHTML
                chapterBtns = Array.from(document.getElementsByClassName("chapter-btn"));
                chapterBtns.forEach(btn => {
                    btn.addEventListener("click", e => {
                        var selectedBtn = e.target;
                        var chapterIndex = selectedBtn.dataset["number"];
                        var subjectIndex = selectedBtn.parentNode.dataset["number"]
                        selectedChapter(subjects[subjectIndex],Object.keys(chapterObj[subjects[subjectIndex]])[chapterIndex])
                    });
                  });
            }else{
                subjectAreaHTML += `<a data-toggle="collapse" class="btn btn-primary btn-lg mt-3 mb-3 btn-block" href="#${subjects[i]}" role="button" aria-expanded="false" style="color: blanchedalmond;">
                                        ${subjects[i]} 
                                    </a>
                                    <div class="collapse" id="${subjects[i]}">
                                    <div class="card card-body" style="width: auto; height: auto; background: #414345;" data-number="${i}">`
                chapters = Object.keys(chapterObj[subjects[i]])
                for(var j = 0 ; j <= chapters.length ; j++){
                    if(j == chapters.length){
                        subjectAreaHTML +=  `</div>
                                            </div>`
                    }else{
                        subjectAreaHTML += `<div class="btn btn-lg btn-success btn-block chapter-btn" data-number="${j}">
                                                ${chapters[j]}
                                            </div>`
                    }
                }
            }
        }
    }
})




