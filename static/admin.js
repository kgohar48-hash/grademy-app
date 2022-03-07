attemtpdata = {}
fetch('https://www.grademy.org/user/admin/data/api')
.then(response => response.json())
.then(data => {
    // variables
    var signupStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    var billingVisitStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    var paymentVisitStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    var loginVisitStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    var makeQuizStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    var attemptQuizStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    var viewQuizStats = {
        chart : {
            labels : [],
            data : []
        }
    }
    totalQuizAttempts       = 0
    totalQuizMade           = 0
    totalQuizViews          = 0
    totalBillingVisits      = 0
    totalPaymentVisits      = 0
    totalLoginRedirects     = 0
    totalSignups            = 0

    associatesStats = {}
    // Charts variables
    ctxSignupChart                  = document.getElementById('signupChart').getContext('2d');
    ctxbillingChart                 = document.getElementById('billingChart').getContext('2d');
    ctxpaymentChart                 = document.getElementById('paymentChart').getContext('2d');
    ctxloginChart                   = document.getElementById('loginChart').getContext('2d');
    ctxquizAttemptChart             = document.getElementById('quizAttemptChart').getContext('2d');
    ctxquizViewChart                = document.getElementById('quizViewChart').getContext('2d');
    ctxquizMakeChart                = document.getElementById('quizMakeChart').getContext('2d');
    // total stats elements variables
    var totalAttemptsElement        = document.getElementById('totalQuizAttemptsElement')
    var totalQuizzesElement         = document.getElementById('totalQuizzes')
    var totalQuizViewsElement       = document.getElementById('totalQuizViews')
    var totalBillingVisitsElement   = document.getElementById('totalBillingVisits')
    var totalPaymentVisitsElement   = document.getElementById('totalPaymentVisitsElement')
    var totalLoginRedirectsElement   = document.getElementById('totalLoginredirects')

    // data extraction function calls
    extractAttemptStats(data.quizzes.solvedBy)
    totalBillingVisits  = extractStats(data.useractivity.billing,"date",billingVisitStats,"Billing visit stats", totalBillingVisits)
    totalPaymentVisits  = extractStats(data.useractivity.payment,"date",paymentVisitStats,"Payment visit stats",totalPaymentVisits)
    totalLoginRedirects = extractStats(data.useractivity.login,"date",loginVisitStats,"Login visit stats",totalLoginRedirects)
    totalQuizMade       = extractStats(data.quizzes.createdAt,"createdAt",makeQuizStats,"Make quiz stats", totalQuizMade)
    totalQuizViews      = extractStats(data.useractivity.quizView,"date",viewQuizStats,"View quiz stats",totalQuizViews)
    totalSignups        = extractStats(data.users,"createdAt",signupStats,"Sign up stats",totalSignups)

    // chart function calls
    chartOfDateStats(ctxSignupChart , signupStats.chart.labels  ,"Signup stats", signupStats.chart.data)
    chartOfDateStats(ctxbillingChart , billingVisitStats.chart.labels  ,"Billing visits stats", billingVisitStats.chart.data)
    chartOfDateStats(ctxpaymentChart , paymentVisitStats.chart.labels  ,"Payment visit stats", paymentVisitStats.chart.data)
    chartOfDateStats(ctxloginChart , loginVisitStats.chart.labels  ,"Login redirect stats", loginVisitStats.chart.data)
    chartOfDateStats(ctxquizAttemptChart , attemptQuizStats.chart.labels  ,"Quiz attempt stats", attemptQuizStats.chart.data)
    chartOfDateStats(ctxquizViewChart , viewQuizStats.chart.labels  ,"Quiz view stats", viewQuizStats.chart.data)
    chartOfDateStats(ctxquizMakeChart , makeQuizStats.chart.labels  ,"Make quiz stats", makeQuizStats.chart.data)
    // total print
    totalAttemptsElement.innerText          = totalQuizAttempts
    totalQuizzesElement.innerText           = totalQuizMade
    totalQuizViewsElement.innerText         = totalQuizViews
    totalBillingVisitsElement.innerText     = totalBillingVisits
    totalPaymentVisitsElement.innerText     = totalPaymentVisits
    totalLoginRedirectsElement.innerText    = totalLoginRedirects


    // date extraction function
    function extractStats (array,dateName,statsObj,statsOf,totalVariable){
        for(var i = 0 ; i <= array.length ; i++){
            if(i == array.length ){
                return totalVariable
            }else{
                // total 
                totalVariable++
                if(statsOf == "Make quiz stats"){
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
                // // associate stats
                // if(typeof associatesStats[ref] == 'undefined'){
                //     associatesStats[ref] = 1
                // }else{
                //     associatesStats[ref]++
                // }
            }
        }
    }
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
    // data extraction for attempts
    function extractAttemptStats(solvedBy){
        for(var i = 0 ; i <= solvedBy.length;i++){
            if(i == solvedBy.length){
                combineDataToCharts(attemptQuizStats,"2021")
                combineDataToCharts(attemptQuizStats,"2022")
                attemtpdata = attemptQuizStats
                return
            }else{
                totalQuizAttempts = extractStats(solvedBy[i],"date",attemptQuizStats,"attempt quiz stats",totalQuizAttempts)
            }
        }
    }
    // filling chart data
    function combineDataToCharts(stats,year){
        for(var i = 0 ; i < Object.keys(stats[year]).length ; i++){
            for(var j= 0 ; j < Object.keys(stats[year][Object.keys(stats[year])[i]]).length ; j++ ){
                attemptQuizStats.chart.labels.push(year+"/"+Object.keys(stats[year])[i]+"/"+Object.keys(stats[year][Object.keys(stats[year])[i]])[j])
                attemptQuizStats.chart.data.push(stats[year][Object.keys(stats[year])[i]][Object.keys(stats[year][Object.keys(stats[year])[i]])[j]])
            }
        }
    }
});

