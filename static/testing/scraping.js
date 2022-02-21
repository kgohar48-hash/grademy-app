var mcqs = []
var totalMcqs = 49
var type = 4197
var chapter = "Environmental Chemistry"
var container = 2
mcqsExtraction()

async function mcqsExtraction() {
    for(var i = 1 ; i <= totalMcqs; i++){
        if(!document.getElementById("mtq_answer_text-"+i+"-1-"+container) || !document.getElementById("mtq_answer_text-"+i+"-2-"+container)  || !document.getElementById("mtq_answer_text-"+i+"-3-"+container)  || !document.getElementById("mtq_answer_text-"+i+"-4-"+container)  || !document.getElementById("mtq_question_text-"+i+"-"+container)){
            console.log("yooooo : ",i)
    
        }else{
            console.log(i)
    
            mcqs.push({
                category : "FUNG" ,
                type : type,
                subject : "chemistry" ,
                chapter : chapter ,
                tags : [],
                postedBy : "saud64",
                question : document.getElementById("mtq_question_text-"+i+"-"+container).innerHTML,
                choice :[
                        document.getElementById("mtq_answer_text-"+i+"-1-"+container).innerHTML || "none",
                        document.getElementById("mtq_answer_text-"+i+"-2-"+container).innerHTML  || "none",
                        document.getElementById("mtq_answer_text-"+i+"-3-"+container).innerHTML  || "none",
                        document.getElementById("mtq_answer_text-"+i+"-4-"+container).innerHTML  || "none"
                    ],
                answer : [await fetchAnswer(i)],
                userResponse : [0,0,0,0,0]
            })
        }
       
        if(i == totalMcqs){
            console.log(mcqs)
            // const options = {
            //     method : 'POST' ,
            //     headers : {
            //         'Content-type' : 'application/json'
            //     },
            //     body : JSON.stringify({
            //         questions : mcqs
            //     })
            //     }
            //     fetch("http://localhost:8000/scrapig/mcqs" , options);
        }
    }   
}

async function fetchAnswer(questionIndex){
    try {
        return new Promise((resolve, reject) => {
            answerFound = false
            for(var j = 1 ; j < 5 ; j++){
                // console.log("j : ",j)
                if(document.getElementById("mtq_marker-"+questionIndex+"-"+j+"-"+container).getAttribute('alt') == "Correct"){
                    console.log("Found correct : ",j)
                    answerFound = true
                    resolve(j.toString())
                }else{
                    // if(j == 4 && !answerFound){
                    //     console.log("No anwser found !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
                    //     resolve("0")
                    // }
                }
            }
        });
    } catch (err) {
        console.log("error in chapter saving", err);
    }
}
