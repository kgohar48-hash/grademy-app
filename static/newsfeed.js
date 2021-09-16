
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
// getting location
// ========

$.ajax({
  url: "https://geolocation-db.com/jsonp",
  jsonpCallback: "callback",
  dataType: "jsonp",
  success: function(location) {
    lastPoint ={
        city : location.city,
        state : location.state,
        country : location.country_name,
        IP : location.IPv4
    }
    init()
  }
});

// ========

var thumbsup = Array.from(document.getElementsByClassName("fa-thumbs-up"));
var thumbsdown = Array.from(document.getElementsByClassName("fa-thumbs-down"));
var voteNumber = document.getElementById('voteNumber')
var newsfeedTitle = document.getElementById('newsfeed-title')
var newsfeedTagline = document.getElementById('newsfeed-tagline')
var postForm = document.getElementById('post-form')
var choices     = Array.from(document.getElementsByClassName("choice-container"))
var lastPoint ={}
var data ={}

function init(){
    thumbsup.forEach(up => {
        up.addEventListener('click',e=>{
            console.log("up : ",e.target.dataset["number"])
            var postId = e.target.dataset["number"]
            if(e.target.classList.contains("far")){
                voteNumber.innerText++
                e.target.classList.replace("far" , "fas")
                const options = {
                    method : 'POST' ,
                    headers : {
                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        vote : 'up'
                    })
                }
                fetch("https://www.grademy.org/newsfeed/vote/"+postId , options);
            }else{
                voteNumber.innerText--
                e.target.classList.replace("fas" , "far")
                const options = {
                    method : 'POST' ,
                    headers : {
                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        vote : 'up'
                    })
                }
                fetch("https://www.grademy.org/unvote/"+postId , options);
            }
            
        })
    });
    
    thumbsdown.forEach(down => {
        down.addEventListener('click',e=>{
            console.log("down : ",e.target.dataset["number"])
            var postId = e.target.dataset["number"]
            if(e.target.classList.contains("far")){
                voteNumber.innerText--
                e.target.classList.replace("far" , "fas")
                const options = {
                    method : 'POST' ,
                    headers : {
                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        vote : 'down'
                    })
                }
                fetch("https://www.grademy.org/newsfeed/vote/"+postId, options);
            }else{
                voteNumber.innerText++
                e.target.classList.replace("fas" , "far")
                const options = {
                    method : 'POST' ,
                    headers : {
                        'Content-type' : 'application/json'
                    },
                    body : JSON.stringify({
                        vote : 'down'
                    })
                }
                fetch("https://www.grademy.org/newsfeed/unvote/"+postId, options);
            }
        })
    });
    
    // if academy
    if(window.location.href == "https://www.grademy.org/newsfeed"){
        // general
        newsfeedTitle.innerText = "Grademy Community !"
        newsfeedTagline.innerText = "Get connected with the grademy cummunity across Pakistan"
    
    }else{
        // academy
        console.log("oy :",lastPoint)
    
        client.get('https://www.grademy.org/data',async function(res) {
            data = JSON.parse(res)
            newsfeedTitle.innerText =  data.academy.academyName +" Cummunity !"
            newsfeedTagline.innerText = data.academy.punchLine
            postForm.action = "/newsfeed/"+data.academy._id
        });
        
    }
    // choice functions
    choices.forEach(choice =>{
        choice.addEventListener("click",e =>{
            var id = e.target.dataset["id"]
            var choiceSelected = e.target.dataset["number"]
            client.get('https://www.grademy.org/mcq/'+id,async function(res) {
            mcqfetched = JSON.parse(res)
            totalAttempts = mcqfetched.userResponse.reduce((a, b) => a + b, 0)
            console.log(mcqfetched)
            var choiceIndex = 0
            choices.forEach(option=>{
                if(option.dataset["id"] == id){
                    choiceIndex++
                    option.style.background =`linear-gradient(to right, #2C2C2C  ${(mcqfetched.userResponse[choiceIndex]/totalAttempts)*100}%,#1A1A1A ${(mcqfetched.userResponse[choiceIndex]/totalAttempts)*100}%)`
                    if(choiceSelected == mcqfetched.answer[0] && choiceIndex == choiceSelected){
                        option.classList.add("correct")
                    }else{
                        if(choiceIndex == choiceSelected){
                            option.classList.add("incorrect")
                        }
                        if(choiceIndex == mcqfetched.answer[0]){
                            option.classList.add("correct")
                        }
                    }
                }
               
            })
        });
        })
    })
    // when choice is clicked
}
