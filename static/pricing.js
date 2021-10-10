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
  client.get('https://www.grademy.org/payment/transactions',async function(res) {
    user = JSON.parse(res)
    console.log(user)
    var transactionsContainer = document.getElementById('transactions-container')
    var transactionHTML = ""
    for(var i = 0; user.transactions.length >= i ; i++){
        if(user.transactions.length == i){
            // terminates
            transactionsContainer.innerHTML = transactionHTML
        }else{
            transactionHTML +=`<div class="card mb-3" style="background-color: rgb(43, 43, 43); border-right: 4px solid rgb(`
            if(user.transactions[i].from.username == user.username){
                console.log("from")
                transactionHTML =+ `204, 0, 0);"> <h5 class="mt-2 ml-3 mr-3">${user.transactions[i].statement} with TID ${user.transactions[i].TID}<span class="float-right">-${user.transactions[i].amount}</span></h5></div>`
            }else{
                if(user.transactions[i].varified){
                    transactionHTML += `0, 204, 27);"> <h5 class="mt-2 ml-3 mr-3">${user.transactions[i].statement} with TID ${user.transactions[i].TID}<span class="float-right">${user.transactions[i].amount}</span></h5></div>`
                }else{
                    transactionHTML += `68, 87, 255);"> <h5 class="mt-2 ml-3 mr-3">${user.transactions[i].statement} with TID ${user.transactions[i].TID}<span class="float-right">pending</span></h5></div>`
                }
            }
        }
    }
    
})


