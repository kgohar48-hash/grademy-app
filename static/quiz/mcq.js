fetch('http://localhost:8000/mcq/ask/'+document.getElementById('id').value)
.then(response => response.json())
.then(data => {
    console.log(data)
    totalAttempts = data.userResponse.reduce((a, b) => a + b, 0)
    var commentsDisplay = document.getElementById('comment-display')
    var commentCount = document.getElementById('comment-count')
    var username    = document.getElementById('user').value
    options = Array.from(document.getElementsByClassName("option"));
    responses = Array.from(document.getElementsByClassName("response"));
    console.log(username)

    options.forEach(option => {
        option.addEventListener("click", e => {
            var selectedChoice = e.target.dataset["number"];
            console.log(selectedChoice)
            if(data.answer[0] == selectedChoice){
                option.classList.add('correct')
            }else{
                option.classList.add('incorrect')
                options[Number(data.answer[0]) - 1].classList.add('correct')
            }
            for(var i = 0 ; options.length > i;i++){
                options[i].style.background =`linear-gradient(to right, #cce5ff  ${(data.userResponse[i+1]/totalAttempts)*100}%,aliceblue ${(data.userResponse[i+1]/totalAttempts)*100}%)`
                responses[i].innerHTML = ((data.userResponse[i+1]/totalAttempts)*100).toFixed(0) +" %"
            }
        });
    });
    commentDisplay()
    function commentDisplay(){
        commentCount.innerText = ''
        if(data.comments.length != 0){
            commentCount.innerText = "("+data.comments.length+")"
        }
        commentDisplayHtml = ''
        data.comments.reverse().forEach(comment => {
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
    // comment btn action
    document.getElementById('comment-btn').addEventListener("click" , function(){
        const options = {
        method : 'POST' ,
        headers : {
            'Content-type' : 'application/json'
        },
        body : JSON.stringify({
            text : document.querySelector('.comment-text').value ,
            username : username
        })
        }
        fetch("http://localhost:8000/mcq/"+data._id.toString()+"/comment" , options);
        data.comments.push({
            author : {
                username : username 
            },
            text : document.querySelector('.comment-text').value
        })
        document.querySelector('.comment-text').value = ''
        commentDisplay()
    })
});

