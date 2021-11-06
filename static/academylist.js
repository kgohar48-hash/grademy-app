
fetch('http://localhost:8000/data')
.then(response => response.json())
.then(data => {
    var i = 0;
    data.forEach(academy=>{
    ratingsum = 0;
    
    console.log("yo",Object.keys(academy.reviews).length )
    for(var j=0 ; Object.keys(academy.reviews).length >=j ; j++){
        if(Object.keys(academy.reviews).length ==j){
            if(Object.keys(academy.reviews).length == 0){
                avgRatings[i].innerText =0; 
            }else{
                avgRatings[i].innerText =  Math.round(ratingsum/Object.keys(academy.reviews).length * 10) / 10
            }
        }else{
            ratingsum += academy.reviews[j].rating
        }
    }
    i++
    })
});

var avgRatings = Array.from(document.getElementsByClassName("avgrating"));

var joinBtns = Array.from(document.getElementsByClassName("join-btn"));
joinBtns.forEach(btn => {
    btn.addEventListener("click" , e=>{
        if(e.target.innerHTML == "Joined"){
            e.target.classList.add('btn-primary')
            e.target.classList.remove('btn-success')
            e.target.innerHTML = "Join+" 
            academyToBeUnjoined = e.target.dataset["number"]
            console.log("unjoined : ", academyToBeUnjoined)
            var options = {
                method : 'POST' ,
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({academyId : academyToBeUnjoined})
                }
            fetch("http://localhost:8000/academy/leave" , options);
        }else{
            e.target.classList.remove('btn-primary')
            e.target.classList.add('btn-success')
            e.target.innerHTML = "Joined"
            academyToBeJoined = e.target.dataset["number"]
            console.log("joined : ", academyToBeJoined)
            var options = {
                method : 'POST' ,
                headers : {
                    'Content-type' : 'application/json'
                },
                body : JSON.stringify({academyId : academyToBeJoined})
            }
            fetch("http://localhost:8000/academy/join" , options);
        }
    })
});

