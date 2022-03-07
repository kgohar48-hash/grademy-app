var string1 = '';
var arr = [];
var arr2 = [];
var arr3=[];
var dataArray = {}
var subjectData = []

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
// api calls
var client = new HttpClient();
client.get('https://www.grademy.org/mcqsinfoapi',async function(res) {
  var mcqsInfo = JSON.parse(res)
  dataArray.biology =  dataExtraction(mcqsInfo.FUNG.biology || mcqsInfo.MDCAT.biology)
  dataArray.math =  dataExtraction(mcqsInfo.FUNG.math)
  dataArray.physics =  dataExtraction(mcqsInfo.FUNG.physics)
  dataArray.chemistry =  dataExtraction(mcqsInfo.FUNG.chemistry)
  dataArray.english =  dataExtraction(mcqsInfo.FUNG.english)

});

document.getElementById("add").addEventListener("click",()=>{
    index = document.getElementById("addons").value
    arr = []
    for(var i = 1 ; i <= index;i++){
        string1 =  '<div class="form-inline"><div class="input-group mb-3 mr-4"><div class="input-group-prepend"><label class="input-group-text">Subject</label></div><select name="subjects" class="custom-select" id="subjectname'+ i.toString() +'" required><option selected value="a" >Choose...</option></select></div><div class="input-group mb-3 mr-4"><div class="input-group-prepend"><label class="input-group-text">Chapter</label></div><select name="chapters" class="custom-select" id="chaptername'+ i.toString() +'" required><option selected value="a" >Choose...</option></select></div><div class="input-group mb-3"><div class="input-group-prepend"><label class="input-group-text">Number of Mcqs</label></div><select name="numberOfMcqs" class="custom-select" id="numberofmcqs'+ i.toString() +'" required><option selected value="a" >Choose...</option></select></div></div>'
        arr.push(string1)
    }
    var sum = arr.reduce(function(a, b){
        return a + b;
    }, );
    document.getElementById("addon").innerHTML = sum ;
    for(var i = 1 ; i <=  index;i++){
        displayoptions1(i)
    }
    
    document.getElementById("submit").innerHTML = '<input type="submit" class="btn btn-primary">'
    
})
    
function displayoptions1(index){
    document.getElementById("subjectname"+index).addEventListener("click" , ()=>{
        document.getElementById("numberofmcqs"+index) .innerHTML = '<option selected value="a" >Choose...</option>'
        document.getElementById("chaptername" +index).innerHTML = '<option selected value="a" >Choose...</option>'
        if(document.getElementById("subjectname"+index).value == "a"){
            if(document.getElementById("category").value == "MDCAT"){
                document.getElementById("subjectname"+index).innerHTML = '<option value="biology" >Biology</option><option value="chemistry" >Chemistry</option><option value="physics" >Physics</option><option value="english" >English</option>'
            }
            if(document.getElementById("category").value == "FUNG"){
                document.getElementById("subjectname"+index).innerHTML = '<option value="math" >Math</option><option value="chemistry" >Chemistry</option><option value="physics" >Physics</option><option value="english" >English</option>'
            }
            document.getElementById("chaptername" +index).addEventListener("click" , ()=>{
                document.getElementById("numberofmcqs"+index) .innerHTML = '<option selected value="a" >Choose...</option>'
                if(document.getElementById("chaptername" +index).value == "a"){
                    arr2 = [];
                    for(cn=0 ; cn < dataArray[document.getElementById("subjectname"+index).value].length; cn++){
                        chapternamehtml = '<option value="'+ dataArray[document.getElementById("subjectname"+index).value][cn].name +'">'+ dataArray[document.getElementById("subjectname"+index).value][cn].name +'</option>'
                        arr2.push(chapternamehtml)
                        if(cn == dataArray[document.getElementById("subjectname"+index).value].length -1 ){
                            var sum = arr2.reduce(function(a, b){
                                return a + b;
                            }, );
                            document.getElementById("chaptername" +index).innerHTML = sum ;
                            document.getElementById("numberofmcqs"+index) .addEventListener("click" , ()=>{
                                if(document.getElementById("numberofmcqs"+index).value == "a"){
                                    arr3 = []
                                    chapterIndex = checkChapterIndex(document.getElementById("chaptername" +index).value , document.getElementById("subjectname" +index).value )
                                    numberOfMcqs = Number(dataArray[document.getElementById("subjectname"+index).value][chapterIndex].mcqs)
                                    for(nom = 5 ; nom < numberOfMcqs + 1 ; nom = nom +5){
                                        stringNOM = '<option value="'+nom+'">'+ nom +'</option>'
                                        arr3.push(stringNOM)
                                        if( numberOfMcqs - nom <= 5){
                                            var sum = arr3.reduce(function(a, b){
                                                return a + b;
                                            }, );
                                            document.getElementById("numberofmcqs"+index) .innerHTML = sum ;
                                        }
                                    }
                                }
                            })
                        }
                    } 
                }
            })
        }
    })
}

function dataExtraction(subject){
  subjectData = []
  chapterNames = Object.keys(subject)
  for(var i =0 ; chapterNames.length >= i ; i++){
    if( i == chapterNames.length){
      return subjectData;
    }else{
      subjectData.push({name : chapterNames[i] , mcqs : subject[chapterNames[i]]})
    }
  }
  
}

function checkChapterIndex(name , subject) {
    for(var i = 0 ; dataArray[subject].length > i ; i++ ){
        if(dataArray[subject][i].name == name ){
            return i
        }
    }
    
}
