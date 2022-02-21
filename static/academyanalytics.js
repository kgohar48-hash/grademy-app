fetch('https://www.grademy.org/academy/analytics/'+document.getElementById('id').value)
.then(response => response.json())
.then(data => {
    // data sorting
    allQuizzes = []
    data.quizCategories.forEach(category => {
        allQuizzes = [...allQuizzes,...category.quizzes]
    });
    quizAttempts = allQuizzes.map((quiz)=>{return quiz.solvedBy})
    // chart element
    ctxSignupChart                  = document.getElementById('signupChart').getContext('2d');
    ctxQuizAttemptChart             = document.getElementById('quizAttemptChart').getContext('2d');

    // other elements
    totalRefsElement            = document.getElementById("totalSignupsElement")
    totalQuizAttemptsElement    = document.getElementById("totalQuizAttemptsElement")

    // stats variables
    var refStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    quizAttemptStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    // total variables
    totalRefs = 0
    totalQuizAttempts = 0
    // calling data extraction functions
    extractAttemptStats(quizAttempts)
    totalRefs           = extractStats(data.refs.createdAt,"createdAt",refStats,"Signups through my quizzes stats",totalRefs)

    // call chart constructor
    chartOfDateStats(ctxSignupChart , refStats.chart.labels  ,"Signups through my quizzes stats", refStats.chart.data)
    chartOfDateStats(ctxQuizAttemptChart , quizAttemptStats.chart.labels  ,"Quiz attempts", quizAttemptStats.chart.data)

    // updating the total element
    totalRefsElement.innerText              = totalRefs
    totalQuizAttemptsElement.innerText      = totalQuizAttempts
    // date extraction function
    function extractStats (array,dateName,statsObj,statsOf,totalVariable){
        for(var i = 0 ; i <= array.length ; i++){
            if(i == array.length ){
                return totalVariable
            }else{
                // total 
                totalVariable++
                if(statsOf == "Signups through my quizzes stats"){
                    fetchDate = new Date(array[i])
                }else{
                    fetchDate = new Date(array[i][dateName])
                }
                // ref = data.users[i].ref
                year = fetchDate.getFullYear()
                month = 1 + fetchDate.getMonth()
                date = fetchDate.getDate()
                if(typeof statsObj[year] == 'undefined'){
                    // if that year doesn't exist
                    statsObj[year] = statsObj[year] || {};
                }
                if(typeof statsObj[year][month] == 'undefined'){
                    // if that month doesn't exist
                    statsObj[year][month] = statsObj[year][month] || {};
                }
                if(typeof statsObj[year][month][date] == 'undefined'){
                    // if that date doesn't exist
                    statsObj[year][month][date] = 1 ;
                    if(statsObj.chart.labels.at(-1) != year.toString()+"/"+month.toString()+"/"+date.toString() && statsOf != "attempt quiz stats"){
                        statsObj.chart.labels.push(year.toString()+"/"+month.toString()+"/"+date.toString())
                        statsObj.chart.data.push(1)
                    }
                }
                if(typeof statsObj[year][month][date] != 'undefined'){
                    
                    statsObj[year][month][date]++
                    if(statsOf != "attempt quiz stats"){
                        statsObj.chart.data[statsObj.chart.data.length - 1] ++
                    }
                }
            }
        }
    }
    // data extraction for attempts
    function extractAttemptStats(solvedBy){
        for(var i = 0 ; i <= solvedBy.length;i++){
            if(i == solvedBy.length){
                combineDataToCharts(quizAttemptStats,"2021")
                combineDataToCharts(quizAttemptStats,"2022")
                return
            }else{
                totalQuizAttempts = extractStats(solvedBy[i],"date",quizAttemptStats,"attempt quiz stats",totalQuizAttempts)
            }
        }
    }
    // filling chart data
    function combineDataToCharts(stats,year){
        for(var i = 0 ; i < Object.keys(stats[year]).length ; i++){
            for(var j= 0 ; j < Object.keys(stats[year][Object.keys(stats[year])[i]]).length ; j++ ){
                quizAttemptStats.chart.labels.push(year+"/"+Object.keys(stats[year])[i]+"/"+Object.keys(stats[year][Object.keys(stats[year])[i]])[j])
                quizAttemptStats.chart.data.push(stats[year][Object.keys(stats[year])[i]][Object.keys(stats[year][Object.keys(stats[year])[i]])[j]])
            }
        }
    }
    // chart constructor
    // dates chart function
    function chartOfDateStats(ctx , labels ,title,data){
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                    label: 'hits',
                    data: data,
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
});

