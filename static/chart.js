var footer = document.getElementById('footer')
    footer.style.display = 'none'

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

$('textarea').keyup(function() {
    
    var characterCount = $(this).val().length,
        current = $('#current'),
        maximum = $('#maximum'),
        theCount = $('#the-count');
      
    current.text(characterCount);
   
    
    /*This isn't entirely necessary, just playin around*/
    if (characterCount < 70) {
      current.css('color', '#FFF');
    }
    if (characterCount > 70 && characterCount < 90) {
      current.css('color', '#6d5555');
    }
    if (characterCount > 90 && characterCount < 100) {
      current.css('color', '#793535');
    }
    if (characterCount > 100 && characterCount < 120) {
      current.css('color', '#841c1c');
    }
    if (characterCount > 120 && characterCount < 139) {
      current.css('color', '#8f0001');
    }
    
    if (characterCount >= 140) {
      maximum.css('color', '#8f0001');
      current.css('color', '#8f0001');
      theCount.css('font-weight','bold');
    } else {
      maximum.css('color','#666');
      theCount.css('font-weight','normal');
    }
});
function run (){
    return new Promise((resolve,reject)=>{
        //charts
        ctxAllUserScore = document.getElementById('allUserScore').getContext('2d');
        ctxTotalScore = document.getElementById('totalScore').getContext('2d');
        ctxScoreDistribution = document.getElementById('scoreDistribution').getContext('2d');
        if(currentuser.category=="MDCAT"){
            //biology charts
            ctxBiologyChartOfChapters = document.getElementById('biologyChartOfChapters').getContext('2d');
            ctxBiologyScoreChart = document.getElementById('biologyScoreChart').getContext('2d');
        }else{
            //biology charts
            ctxMathChartOfChapters = document.getElementById('mathChartOfChapters').getContext('2d');
            ctxMathScoreChart = document.getElementById('mathScoreChart').getContext('2d');
        }
        
        //physics charts
        ctxPhysicsChartOfChapters = document.getElementById('physicsChartOfChapters').getContext('2d');
        ctxPhysicsScoreChart = document.getElementById('physicsScoreChart').getContext('2d');
        //chemistry charts
        ctxChemistryChartOfChapters = document.getElementById('chemistryChartOfChapters').getContext('2d');
        ctxChemistryScoreChart = document.getElementById('chemistryScoreChart').getContext('2d');
        //english charts
        ctxEnglishChartOfChapters = document.getElementById('englishChartOfChapters').getContext('2d');
        ctxEnglishScoreChart = document.getElementById('englishScoreChart').getContext('2d');

        //overall card
        myscore = document.getElementById("myscore")
        attempts = document.getElementById("attempts")
        myposition = document.getElementById("position")
        //subject cards
        if(currentuser.category=="MDCAT"){
            biologyScore = document.getElementById('biologyScore')
            biologyPosition = document.getElementById('biologyPosition')
            biologyScoreProgress = document.getElementById('biologyScoreProgress')
            biologyattempts = document.getElementById("biologyattempts")
        }else{
            mathScore = document.getElementById('mathScore')
            mathPosition = document.getElementById('mathPosition')
            mathScoreProgress = document.getElementById('mathScoreProgress')
            mathattempts = document.getElementById("mathattempts")

        }
        physicsScore = document.getElementById('physicsScore')
        physicsPosition = document.getElementById('physicsPosition')
        physicsScoreProgress = document.getElementById('physicsScoreProgress')
        physicsattempts = document.getElementById("physicsattempts")

        chemistryScore = document.getElementById('chemistryScore')
        chemistryPosition = document.getElementById('chemistryPosition')
        chemistryScoreProgress = document.getElementById('chemistryScoreProgress')
        chemistryattempts = document.getElementById("chemistryattempts")

        englishScore = document.getElementById('englishScore')
        englishPosition = document.getElementById('englishPosition')
        englishScoreProgress = document.getElementById('englishScoreProgress')
        englishattempts = document.getElementById("englishattempts")

        //leaderboard overall
        overallPositions = {
            positionname1 : document.getElementById("1positionname"),
            positionname2 : document.getElementById("2positionname"),
            positionname3 : document.getElementById("3positionname"),
            positionname4 : document.getElementById("4positionname"),
            positionname5 : document.getElementById("5positionname"),
            positionname6 : document.getElementById("6positionname"),
            positionname7 : document.getElementById("7positionname"),
            positionname8 : document.getElementById("8positionname"),
            positionname9 : document.getElementById("9positionname"),
            positionname10 : document.getElementById("10positionname"),
            positionscore1  : document.getElementById("1positionscore") ,
            positionscore2  : document.getElementById("2positionscore") ,
            positionscore3  : document.getElementById("3positionscore") ,
            positionscore4  : document.getElementById("4positionscore") ,
            positionscore5  : document.getElementById("5positionscore") ,
            positionscore6  : document.getElementById("6positionscore") ,
            positionscore7  : document.getElementById("7positionscore") ,
            positionscore8  : document.getElementById("8positionscore") ,
            positionscore9  : document.getElementById("9positionscore") ,
            positionscore10  : document.getElementById("10positionscore") ,
            progressbar1 : document.getElementById("1positionprogressbar"),
            progressbar2 : document.getElementById("2positionprogressbar"),
            progressbar3 : document.getElementById("3positionprogressbar"),
            progressbar4 : document.getElementById("4positionprogressbar"),
            progressbar5 : document.getElementById("5positionprogressbar"),
            progressbar6 : document.getElementById("6positionprogressbar"),
            progressbar7 : document.getElementById("7positionprogressbar"),
            progressbar8 : document.getElementById("8positionprogressbar"),
            progressbar9 : document.getElementById("9positionprogressbar"),
            progressbar10 : document.getElementById("10positionprogressbar")
        }
        if(currentuser.category=="MDCAT"){
            //leaderboard biology
            biologyPositions = {
                positionname1 : document.getElementById("1biologypositionname"),
                positionname2 : document.getElementById("2biologypositionname"),
                positionname3 : document.getElementById("3biologypositionname"),
                positionname4 : document.getElementById("4biologypositionname"),
                positionname5 : document.getElementById("5biologypositionname"),
                positionname6 : document.getElementById("6biologypositionname"),
                positionname7 : document.getElementById("7biologypositionname"),
                positionname8 : document.getElementById("8biologypositionname"),
                positionname9 : document.getElementById("9biologypositionname"),
                positionname10 : document.getElementById("10biologypositionname"),
                positionscore1  : document.getElementById("1biologypositionscore") ,
                positionscore2  : document.getElementById("2biologypositionscore") ,
                positionscore3  : document.getElementById("3biologypositionscore") ,
                positionscore4  : document.getElementById("4biologypositionscore") ,
                positionscore5  : document.getElementById("5biologypositionscore") ,
                positionscore6  : document.getElementById("6biologypositionscore") ,
                positionscore7  : document.getElementById("7biologypositionscore") ,
                positionscore8  : document.getElementById("8biologypositionscore") ,
                positionscore9  : document.getElementById("9biologypositionscore") ,
                positionscore10  : document.getElementById("10biologypositionscore") ,
                progressbar1 : document.getElementById("1biologypositionprogressbar"),
                progressbar2 : document.getElementById("2biologypositionprogressbar"),
                progressbar3 : document.getElementById("3biologypositionprogressbar"),
                progressbar4 : document.getElementById("4biologypositionprogressbar"),
                progressbar5 : document.getElementById("5biologypositionprogressbar"),
                progressbar6 : document.getElementById("6biologypositionprogressbar"),
                progressbar7 : document.getElementById("7biologypositionprogressbar"),
                progressbar8 : document.getElementById("8biologypositionprogressbar"),
                progressbar9 : document.getElementById("9biologypositionprogressbar"),
                progressbar10 : document.getElementById("10biologypositionprogressbar")
            } 
        }else{
              //leaderboard math
              mathPositions = {
                positionname1 : document.getElementById("1mathpositionname"),
                positionname2 : document.getElementById("2mathpositionname"),
                positionname3 : document.getElementById("3mathpositionname"),
                positionname4 : document.getElementById("4mathpositionname"),
                positionname5 : document.getElementById("5mathpositionname"),
                positionname6 : document.getElementById("6mathpositionname"),
                positionname7 : document.getElementById("7mathpositionname"),
                positionname8 : document.getElementById("8mathpositionname"),
                positionname9 : document.getElementById("9mathpositionname"),
                positionname10 : document.getElementById("10mathpositionname"),
                positionscore1  : document.getElementById("1mathpositionscore") ,
                positionscore2  : document.getElementById("2mathpositionscore") ,
                positionscore3  : document.getElementById("3mathpositionscore") ,
                positionscore4  : document.getElementById("4mathpositionscore") ,
                positionscore5  : document.getElementById("5mathpositionscore") ,
                positionscore6  : document.getElementById("6mathpositionscore") ,
                positionscore7  : document.getElementById("7mathpositionscore") ,
                positionscore8  : document.getElementById("8mathpositionscore") ,
                positionscore9  : document.getElementById("9mathpositionscore") ,
                positionscore10  : document.getElementById("10mathpositionscore") ,
                progressbar1 : document.getElementById("1mathpositionprogressbar"),
                progressbar2 : document.getElementById("2mathpositionprogressbar"),
                progressbar3 : document.getElementById("3mathpositionprogressbar"),
                progressbar4 : document.getElementById("4mathpositionprogressbar"),
                progressbar5 : document.getElementById("5mathpositionprogressbar"),
                progressbar6 : document.getElementById("6mathpositionprogressbar"),
                progressbar7 : document.getElementById("7mathpositionprogressbar"),
                progressbar8 : document.getElementById("8mathpositionprogressbar"),
                progressbar9 : document.getElementById("9mathpositionprogressbar"),
                progressbar10 : document.getElementById("10mathpositionprogressbar")
            } 
        }
        //leaderboard physics
        physicsPositions = {
            positionname1 : document.getElementById("1physicspositionname"),
            positionname2 : document.getElementById("2physicspositionname"),
            positionname3 : document.getElementById("3physicspositionname"),
            positionname4 : document.getElementById("4physicspositionname"),
            positionname5 : document.getElementById("5physicspositionname"),
            positionname6 : document.getElementById("6physicspositionname"),
            positionname7 : document.getElementById("7physicspositionname"),
            positionname8 : document.getElementById("8physicspositionname"),
            positionname9 : document.getElementById("9physicspositionname"),
            positionname10 : document.getElementById("10physicspositionname"),
            positionscore1  : document.getElementById("1physicspositionscore") ,
            positionscore2  : document.getElementById("2physicspositionscore") ,
            positionscore3  : document.getElementById("3physicspositionscore") ,
            positionscore4  : document.getElementById("4physicspositionscore") ,
            positionscore5  : document.getElementById("5physicspositionscore") ,
            positionscore6  : document.getElementById("6physicspositionscore") ,
            positionscore7  : document.getElementById("7physicspositionscore") ,
            positionscore8  : document.getElementById("8physicspositionscore") ,
            positionscore9  : document.getElementById("9physicspositionscore") ,
            positionscore10  : document.getElementById("10physicspositionscore") ,
            progressbar1 : document.getElementById("1physicspositionprogressbar"),
            progressbar2 : document.getElementById("2physicspositionprogressbar"),
            progressbar3 : document.getElementById("3physicspositionprogressbar"),
            progressbar4 : document.getElementById("4physicspositionprogressbar"),
            progressbar5 : document.getElementById("5physicspositionprogressbar"),
            progressbar6 : document.getElementById("6physicspositionprogressbar"),
            progressbar7 : document.getElementById("7physicspositionprogressbar"),
            progressbar8 : document.getElementById("8physicspositionprogressbar"),
            progressbar9 : document.getElementById("9physicspositionprogressbar"),
            progressbar10 : document.getElementById("10physicspositionprogressbar")
        }
        //leaderboard chemistry
        chemistryPositions = {
            positionname1 : document.getElementById("1chemistrypositionname"),
            positionname2 : document.getElementById("2chemistrypositionname"),
            positionname3 : document.getElementById("3chemistrypositionname"),
            positionname4 : document.getElementById("4chemistrypositionname"),
            positionname5 : document.getElementById("5chemistrypositionname"),
            positionname6 : document.getElementById("6chemistrypositionname"),
            positionname7 : document.getElementById("7chemistrypositionname"),
            positionname8 : document.getElementById("8chemistrypositionname"),
            positionname9 : document.getElementById("9chemistrypositionname"),
            positionname10 : document.getElementById("10chemistrypositionname"),
            positionscore1  : document.getElementById("1chemistrypositionscore") ,
            positionscore2  : document.getElementById("2chemistrypositionscore") ,
            positionscore3  : document.getElementById("3chemistrypositionscore") ,
            positionscore4  : document.getElementById("4chemistrypositionscore") ,
            positionscore5  : document.getElementById("5chemistrypositionscore") ,
            positionscore6  : document.getElementById("6chemistrypositionscore") ,
            positionscore7  : document.getElementById("7chemistrypositionscore") ,
            positionscore8  : document.getElementById("8chemistrypositionscore") ,
            positionscore9  : document.getElementById("9chemistrypositionscore") ,
            positionscore10  : document.getElementById("10chemistrypositionscore") ,
            progressbar1 : document.getElementById("1chemistrypositionprogressbar"),
            progressbar2 : document.getElementById("2chemistrypositionprogressbar"),
            progressbar3 : document.getElementById("3chemistrypositionprogressbar"),
            progressbar4 : document.getElementById("4chemistrypositionprogressbar"),
            progressbar5 : document.getElementById("5chemistrypositionprogressbar"),
            progressbar6 : document.getElementById("6chemistrypositionprogressbar"),
            progressbar7 : document.getElementById("7chemistrypositionprogressbar"),
            progressbar8 : document.getElementById("8chemistrypositionprogressbar"),
            progressbar9 : document.getElementById("9chemistrypositionprogressbar"),
            progressbar10 : document.getElementById("10chemistrypositionprogressbar")
        }
        //leaderboard english
        englishPositions = {
            positionname1 : document.getElementById("1englishpositionname"),
            positionname2 : document.getElementById("2englishpositionname"),
            positionname3 : document.getElementById("3englishpositionname"),
            positionname4 : document.getElementById("4englishpositionname"),
            positionname5 : document.getElementById("5englishpositionname"),
            positionname6 : document.getElementById("6englishpositionname"),
            positionname7 : document.getElementById("7englishpositionname"),
            positionname8 : document.getElementById("8englishpositionname"),
            positionname9 : document.getElementById("9englishpositionname"),
            positionname10 : document.getElementById("10englishpositionname"),
            positionscore1  : document.getElementById("1englishpositionscore") ,
            positionscore2  : document.getElementById("2englishpositionscore") ,
            positionscore3  : document.getElementById("3englishpositionscore") ,
            positionscore4  : document.getElementById("4englishpositionscore") ,
            positionscore5  : document.getElementById("5englishpositionscore") ,
            positionscore6  : document.getElementById("6englishpositionscore") ,
            positionscore7  : document.getElementById("7englishpositionscore") ,
            positionscore8  : document.getElementById("8englishpositionscore") ,
            positionscore9  : document.getElementById("9englishpositionscore") ,
            positionscore10  : document.getElementById("10englishpositionscore") ,
            progressbar1 : document.getElementById("1englishpositionprogressbar"),
            progressbar2 : document.getElementById("2englishpositionprogressbar"),
            progressbar3 : document.getElementById("3englishpositionprogressbar"),
            progressbar4 : document.getElementById("4englishpositionprogressbar"),
            progressbar5 : document.getElementById("5englishpositionprogressbar"),
            progressbar6 : document.getElementById("6englishpositionprogressbar"),
            progressbar7 : document.getElementById("7englishpositionprogressbar"),
            progressbar8 : document.getElementById("8englishpositionprogressbar"),
            progressbar9 : document.getElementById("9englishpositionprogressbar"),
            progressbar10 : document.getElementById("10englishpositionprogressbar")
        }
        resolve()
    })
}

init();
async function init(){
    
    await fetchingcurrentuser();
    await run();
    thuk();
    function thuk(){
        currentuser.score.history.push({x : currentuser.score.attempted , y : currentuser.score.score})
        if(currentuser.category =="MDCAT"){
            currentuser.score.biology.history.push({x : currentuser.score.biology.attempted , y : currentuser.score.biology.score})
        }else{
            currentuser.score.math.history.push({x : currentuser.score.math.attempted , y : currentuser.score.math.score})
        }
        currentuser.score.physics.history.push({x : currentuser.score.physics.attempted , y : currentuser.score.physics.score})
        currentuser.score.chemistry.history.push({x : currentuser.score.chemistry.attempted , y : currentuser.score.chemistry.score})
        currentuser.score.english.history.push({x : currentuser.score.english.attempted , y : currentuser.score.english.score})
    }
    console.log("1")
    var myPositionObj = await myPositions();
    makeScoreDistributionChart(positionArr , 1600 , 50)
    settingScore(myPositionObj);
    var totalHistory = await fetchingHistory(currentuser.score.history , {});

    chartOfHistory(ctxTotalScore , totalHistory.labels , totalHistory.history, "Total Score History" , "Last 1000 mcqs")
    console.log("1.2")

    if(currentuser.category=="MDCAT"){
        var biologyChapters =  await fetchingSubjectChapters( currentuser,'biology');
        chartOfChapters(ctxBiologyChartOfChapters , biologyChapters.labels ,"Biology Chapters",biologyChapters.skipped, biologyChapters.correct , biologyChapters.incorrect)

        var biologyHistory = await fetchingHistory(currentuser.score.biology.history , 'biology')
        chartOfHistory(ctxBiologyScoreChart , biologyHistory.labels , biologyHistory.history, "Biology Score History" , "Last 400 mcqs")
        //leaderboard biology
        await leaderboard (biologyPositionArr , biologyPositions , 400)
        await scoreDistributionfunction("Total Score Distribution",'Maintain it at : Bio 40%,Che 30%, Phy 20%, Eng 10%' , "Biology" , "biology",2,3);
    }else{
        var mathChapters =  await fetchingSubjectChapters( currentuser,'math');
        chartOfChapters(ctxMathChartOfChapters ,mathChapters.labels ,"Math Chapters",mathChapters.skipped, mathChapters.correct , mathChapters.incorrect)
        var mathHistory = await fetchingHistory(currentuser.score.math.history , 'math')
        chartOfHistory(ctxMathScoreChart , mathHistory.labels , mathHistory.history, "Math Score History" , "Last 400 mcqs")
        //leaderboard math
        console.log("1.3")

        await leaderboard (mathPositionArr , mathPositions , 400)
        await scoreDistributionfunction("Total Score Distribution",'Maintain it at : Math 40%, Phy 30%, Che 20%, Eng 10%', "Math" , "math",3,2);
    }
    console.log("2")

    //physics charts
    var physicsChapters = await fetchingSubjectChapters(currentuser ,'physics');
    chartOfChapters(ctxPhysicsChartOfChapters , physicsChapters.labels ,"Physics Chapters",physicsChapters.skipped, physicsChapters.correct , physicsChapters.incorrect)
    var physicsHistory = await fetchingHistory(currentuser.score.physics.history)
    chartOfHistory(ctxPhysicsScoreChart , physicsHistory.labels , physicsHistory.history, "Physics Score History" , "Last 400 mcqs")
    //chemistry charts
    var chemistryChapters = await fetchingSubjectChapters(currentuser ,'chemistry');
    chartOfChapters(ctxChemistryChartOfChapters , chemistryChapters.labels  ,"Chemistry Chapters",chemistryChapters.skipped, chemistryChapters.correct , chemistryChapters.incorrect)
    var chemistryHistory = await fetchingHistory(currentuser.score.chemistry.history)
    chartOfHistory(ctxChemistryScoreChart , chemistryHistory.labels , chemistryHistory.history, "Chemistry Score History" , "Last 400 mcqs")
    //English charts
    console.log("3")

    var englishChapters = await fetchingSubjectChapters(currentuser ,'english');
    chartOfChapters(ctxEnglishChartOfChapters , englishChapters.labels  ,"English Chapters",englishChapters.skipped, englishChapters.correct , englishChapters.incorrect)
    var englishHistory = await fetchingHistory(currentuser.score.english.history)
    chartOfHistory(ctxEnglishScoreChart , englishHistory.labels , englishHistory.history, "English Score History" , "Last 400 mcqs")
    // leaderboard overall

    await leaderboard (positionArr , overallPositions , 1600)
    //leaderboard physics
    await leaderboard (physicsPositionArr , physicsPositions , 400)
    //leaderboard physics
    await leaderboard (chemistryPositionArr , chemistryPositions , 400)
    //leaderboard english
    await leaderboard (englishPositionArr , englishPositions , 400)
    setTimeout(function () {
        document.getElementById("loader").style.display = "none";
        document.getElementById("myDiv").style.display = "block";
        footer.style.display = 'block'
    }, 3000);
    Chart.defaults.global.defaultFontColor = "#fff";
}
//fetching currentuser API

// https://protected-mesa-71767.herokuapp.com/currentuser
function fetchingcurrentuser(){
    return new Promise((resolve,reject)=>{
        var client = new HttpClient();
        client.get('https://protected-mesa-71767.herokuapp.com/currentuser', function(res) {
            var loadedData = JSON.parse(res)
            currentuser = loadedData.user;
            positionArr = loadedData.position
            biologyPositionArr = loadedData.biologyPosition
            mathPositionArr = loadedData.mathPosition
            physicsPositionArr = loadedData.physicsPosition
            chemistryPositionArr = loadedData.chemistryPosition
            englishPositionArr = loadedData.englishPosition
            resolve();
        });
    }).catch(err =>{
        console.log(err)
    });
}
//fetchinh mypositions
function myPositions(){
    return new Promise( async (resolve,reject)=>{
        var positionObj = {
            overallPositionNumber : await positionCheck(positionArr) ,
            biologyPositionNumber : await positionCheck(biologyPositionArr) ,
            mathPositionNumber : await positionCheck(mathPositionArr) ,
            physicsPositionNumber : await positionCheck(physicsPositionArr) ,
            chemistryPositionNumber : await positionCheck(chemistryPositionArr) ,
            englishgyPositionNumber : await positionCheck(englishPositionArr) 
        }
       resolve(positionObj)
    })
}
//checkingPosition
function positionCheck(array){
    return new Promise((resolve,reject)=>{
        var indexNumber = 0;
        // if there is only one user
        if(array.length==0){
            resolve(0)
        }
        array.forEach(position => {
            if(currentuser.username == position.username){
                resolve(indexNumber) ;
            }else{
                indexNumber ++
            }
        });
    }).catch((reject)=>{
        console.log("error here in positioncheck : " + reject)
    })
 }
// setting score
function settingScore(myPositionObj){
    //overall card 
    myscore.innerHTML = currentuser.score.score
    myposition.innerHTML = myPositionObj.overallPositionNumber + 1
    attempts.innerHTML = currentuser.score.attempted
    if(currentuser.category=="MDCAT"){
        //biology score card
        biologyScore.innerHTML = currentuser.score.biology.score
        biologyPosition.innerHTML =  myPositionObj.biologyPositionNumber + 1
        biologyScoreProgress.style.width = `${(currentuser.score.biology.score / 400) * 100}%`;
        biologyattempts.innerHTML = currentuser.score.biology.attempted
    }else{
        //math score card
        mathScore.innerHTML = currentuser.score.math.score
        mathPosition.innerHTML =  myPositionObj.mathPositionNumber + 1
        mathScoreProgress.style.width = `${(currentuser.score.math.score / 400) * 100}%`;
        mathattempts.innerHTML = currentuser.score.math.attempted

    }
    //physics score card
    physicsScore.innerHTML = currentuser.score.physics.score
    physicsPosition.innerHTML =  myPositionObj.physicsPositionNumber + 1
    physicsScoreProgress.style.width = `${(currentuser.score.physics.score / 400) * 100}%`;
    physicsattempts.innerHTML = currentuser.score.physics.attempted

     //chemistry score card
    chemistryScore.innerHTML = currentuser.score.chemistry.score
    chemistryPosition.innerHTML = myPositionObj.chemistryPositionNumber + 1
    chemistryScoreProgress.style.width = `${(currentuser.score.chemistry.score / 400) * 100}%`;
    chemistryattempts.innerHTML = currentuser.score.chemistry.attempted

    //english score card
    englishScore.innerHTML = currentuser.score.english.score
    englishPosition.innerHTML =  myPositionObj.englishgyPositionNumber + 1
    englishScoreProgress.style.width = `${(currentuser.score.english.score / 400) * 100}%`;
    englishattempts.innerHTML = currentuser.score.english.attempted


}
//fetching biology chapter data 
function fetchingSubjectChapters( currentuser,subject){
    return new Promise((resolve,reject)=>{
        var labels = [] 
        var correct = []
        var incorrect = []
        var skipped = []
        if(!currentuser.score[subject].chapters ){
            console.log(subject+" : undefined")
            var obj = { 
                correct,
                incorrect,
                skipped,
                labels
            }
            resolve(obj); 
        }else{
            for(i = 0; Object.keys(currentuser.score[subject].chapters).length >= i ; i++){
                if(Object.keys(currentuser.score[subject].chapters).length == i ){
                    var obj = { 
                        correct,
                        incorrect,
                        skipped,
                        labels
                    }
                    resolve(obj);
                }else{
                    dataFromChapter = currentuser.score[subject].chapters[Object.keys(currentuser.score[subject].chapters)[i]]
                    correct.push(dataFromChapter.correct)
                    incorrect.push(dataFromChapter.incorrect*-1)
                    skipped.push(dataFromChapter.skipped)
                    labels.push(Object.keys(currentuser.score[subject].chapters)[i])
                }
            }
        }
    }).catch((reject)=>{
        console.log("error here in fetchingSubjectChapters : " + reject)
    })
}
//fetching total hsitory
function fetchingHistory(history){
    return new Promise((resolve,reject)=>{
        var historyLabels = []
        if (history.length == 0){
            var obj = {
                labels : [] ,
                history : []
            }
            resolve(obj)
        }
        for(i=0;i<history.length;i++){
            historyLabels.push(history[i].x)
            if(i == history.length -1){
                var obj = {
                    labels : historyLabels ,
                    history : history
                }
                resolve(obj)
            }
        }

    }).catch((reject)=>{
        console.log("error here in fetchingHistory : " + reject)
    })
}
// total history chart
function chartOfHistory(ctx , labels , data,title , labelString ){
    return new Promise((resolve,reject)=>{
        var totalScore = new Chart(ctx, {
            type: 'line',
            data : {
                labels : labels,
                datasets : [
                    {
                        data: data ,
                        label: 'Score',
                        fill: false,
                        borderColor: "#4E8397",
                        backgroundColor: "#3FAB2E",
                        pointBackgroundColor: "#3FAB2E",
                        pointBorderColor: "#3FAB2E",
                        pointHoverBackgroundColor: "#FFF",
                        pointHoverBorderColor: "#FFF"
                    }
                ]
            },
            options: {
                responsive: true,
                title: {
                    display: true,
                    text: title,
                    fontSize : 18,
                    fontStyle : 'bold'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                },
                hover: {
                    mode: 'nearest',
                    intersect: true
                },
                scales: {
                    xAxes: [{
                        display: true,
                        gridLines: {
                            display : false
                        },
                        scaleLabel: {
                            display: true,
                            labelString: labelString 
                        },
                        
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Score'
                        }
                    }]
                }
            }
        });
        resolve()
    }).catch((reject)=>{
        console.log("error here in chartOfHistory : " + reject)
    })
}

// score distribution chart
function scoreDistributionfunction(title ,text, subjecttitle , subject,phy,che){
    return new Promise((resolve,reject)=>{
        new Chart(ctxScoreDistribution, {
            type: 'doughnut',
            data : {
                datasets: [{
                    data: [currentuser.score[subject].score*4, currentuser.score.physics.score*phy, currentuser.score.chemistry.score*che, currentuser.score.english.score*1] ,
                    backgroundColor: [
                        '#3c14c9',
                        '#56ab2f',
                        '#5C258D',
                        '#ec008c'
                    ],
                    borderColor : [
                        '#3c14c9',
                        '#56ab2f',
                        '#5C258D',
                        '#ec008c'
                    ],
                    borderWidth : '1',
                    hoverBorderWidth : '5'
                }],
                labels: [
                    subjecttitle,
                    'Physics',
                    'Chemistry',
                    'English'
                ]
            },
            options: {
                title : {
                    text : title,
                    display : true,
                    fontSize: 18
                },
                
                center: {
                    display : true,
                    text: "jfsnjfnsln s s js s js",
                    color: '#FF6384', // Default is #000000
                    fontStyle: 'Arial', // Default is Arial
                    sidePadding: 20, // Default is 20 (as a percentage)
                    minFontSize: 25, // Default is 20 (in px), set to false and text will not wrap.
                    lineHeight: 25 // Default is 25 (in px), used for when text wraps
                },
                animation : {
                    animateScale : true 
                },
                tooltips: {
                    callbacks: {
                      label: function (tooltipItem, data) {
                        try {
                          let label = ' ' + data.labels[tooltipItem.index] || '';
                
                          if (label) {
                            label += ': ';
                          }
                
                          const sum = data.datasets[0].data.reduce((accumulator, curValue) => {
                            return accumulator + curValue;
                          });
                          const value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
                
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
        resolve()
    }).catch((reject)=>{
        console.log("error here in scoreDistributionfunction : " + reject)
    })
}

// chapter correctness chart
function chartOfChapters(ctx , labels ,title,skipped, correct , incorrect){
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                label: 'Skipped',
                data: skipped,
                backgroundColor : '#3A506B',
                borderWidth: 0.5
            },
            {
                label : 'Correct',
                data : correct,
                backgroundColor : '#018786' ,
                stack: '2',
                borderWidth : 0.5
            },
            {
                label : 'Incorrect',
                data : incorrect,
                backgroundColor : '#CF6679',
                stack: '2',
                borderWidth : 0.5
            }
        ]
        },
        options: {
            title: {
                display: true,
                fontSize: 18,
                text: title
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: true,
            scales: {
                xAxes: [{
                   
                    stacked : true
                }],
                yAxes: [{
                    stacked : true
                }]
            }
        }
    });
}
// overall users score distribution
function makeScoreDistributionChart(arr , totalScore, interval){
    scoreData = {
        marksArray : Array(totalScore/interval),
        numberOfStudents : Array(totalScore/interval).fill(0)
    }
    for(var j = 0 ; scoreData.marksArray.length >= j ; j++){
        if(scoreData.marksArray.length == j){
            for(var i = 0 ; arr.length >= i ; i++){
                if(arr.length == i){
                    console.log(scoreData)
                    allUserScoreDistributionChart(ctxAllUserScore ,"All users score summary" )
                }else{
                    if(arr[i].userScore > 0){
                        scoreData.numberOfStudents[Math.floor(arr[i].userScore/interval)]++
                    }
                }
            }
        }else{
            scoreData.marksArray[j] = j*interval+"-"+(j*interval+interval)
        }
    }
    
}
function allUserScoreDistributionChart(ctx ,title){
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: scoreData.marksArray,
            datasets: [
                {
                label: 'Number Of Students',
                data: scoreData.numberOfStudents,
                backgroundColor : '#3A506B',
                borderWidth: 0.5
            }
        ]
        },
        options: {
            title: {
                display: true,
                fontSize: 18,
                text: title
            },
            tooltips: {
                mode: 'index',
                intersect: false
            },
            responsive: false,
            scales: {
                xAxes: [{
                   
                    stacked : true
                }],
                yAxes: [{
                    stacked : true
                }]
            }
        }
    });
}
//leaderboard
function leaderboard(positionArray , obj , totalScore ){
    return new Promise((resolve,reject)=>{
        obj.positionscore1.innerHTML = positionArray[0].userScore
        obj.positionscore2.innerHTML = positionArray[1].userScore
        obj.positionscore3.innerHTML = positionArray[2].userScore
        obj.positionscore4.innerHTML = positionArray[3].userScore
        obj.positionscore5.innerHTML = positionArray[4].userScore

        obj.positionname1.innerHTML = positionArray[0].username
        obj.positionname2.innerHTML = positionArray[1].username
        obj.positionname3.innerHTML = positionArray[2].username
        obj.positionname4.innerHTML = positionArray[3].username
        obj.positionname5.innerHTML = positionArray[4].username

        obj.progressbar1.style.width = `${(positionArray[0].userScore / totalScore) * 100}%`;
        obj.progressbar2.style.width = `${(positionArray[1].userScore / totalScore) * 100}%`;
        obj.progressbar3.style.width = `${(positionArray[2].userScore / totalScore) * 100}%`;
        obj.progressbar4.style.width = `${(positionArray[3].userScore / totalScore) * 100}%`;
        obj.progressbar5.style.width = `${(positionArray[4].userScore / totalScore) * 100}%`;
       
        obj.positionscore6.innerHTML = positionArray[5].userScore
        obj.positionscore7.innerHTML = positionArray[6].userScore
        obj.positionscore8.innerHTML = positionArray[7].userScore
        obj.positionscore9.innerHTML = positionArray[8].userScore
        obj.positionscore10.innerHTML = positionArray[9].userScore

        obj.positionname6.innerHTML = positionArray[5].username
        obj.positionname7.innerHTML = positionArray[6].username
        obj.positionname8.innerHTML = positionArray[7].username
        obj.positionname9.innerHTML = positionArray[8].username
        obj.positionname10.innerHTML = positionArray[9].username

        obj.progressbar6.style.width = `${(positionArray[5].userScore / totalScore) * 100}%`;
        obj.progressbar7.style.width = `${(positionArray[6].userScore / totalScore) * 100}%`;
        obj.progressbar8.style.width = `${(positionArray[7].userScore / totalScore) * 100}%`;
        obj.progressbar9.style.width = `${(positionArray[8].userScore / totalScore) * 100}%`;
        obj.progressbar10.style.width = `${(positionArray[9].userScore / totalScore) * 100}%`;
    
        resolve()
    }).catch(err =>{
        console.log(err)
        });
}

