
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
    var date = new Date()

    for(var i = 0; user.transactions.length >= i ; i++){
        if(user.transactions.length == i){
            // terminates
            transactionsContainer.innerHTML = transactionHTML
            balanceIn.innerText = "Rs "+balanceInAmount
            balanceOut.innerText = "Rs "+balanceOutAmount
            currentBalance.innerText = "Rs "+(balanceInAmount - balanceOutAmount)
        }else{
            transactionHTML +=`<div class="card mb-3" style="background-color: rgb(43, 43, 43); border-right: 4px solid rgb(`
            if(user.transactions[i].from.username == user.username){
                balanceOutAmount += user.transactions[i].amount
                transactionHTML += `204, 0, 0);"> <h5 class="mt-2 ml-3 mr-3">${user.transactions[i].statement}<span class="float-right">-${user.transactions[i].amount}</span></h5></div>`
            }else{
                if(user.transactions[i].varified){
                    if(user.transactions[i].isPromo){
                        balanceInAmount += user.transactions[i].amount
                        transactionHTML += `68, 87, 255);"> <h5 class="mt-2 ml-3 mr-3">${user.transactions[i].statement} (will expire in ${(new Date(user.transactions[i].createdAt).getDate() - date.getDate() ) + 3} days)<span class="float-right">${user.transactions[i].amount}</span></h5></div>`
                    }else{
                        balanceInAmount += user.transactions[i].amount
                        transactionHTML += `0, 204, 27);"> <h5 class="mt-2 ml-3 mr-3">${user.transactions[i].statement} <span class="float-right">${user.transactions[i].amount}</span></h5></div>`
                    }
                }else{
                    transactionHTML += `68, 87, 255);"> <h5 class="mt-2 ml-3 mr-3">${user.transactions[i].statement} <span class="float-right">pending</span></h5></div>`
                }
            }
        }
    }
    
})
var transactionsContainer = document.getElementById('transactions-container')
var currentBalance  = document.getElementById("current-balance")
var balanceIn       = document.getElementById("balance-in")
var balanceOut      = document.getElementById("balance-out")
var inviteLinkInput = document.getElementById("invite-link")
var currentBalanceAmount = 0
var balanceInAmount = 0
var balanceOutAmount = 0
var transactionHTML = ""

function copyInviteLink(){

    /* Select the text field */
    inviteLinkInput.select();
    inviteLinkInput.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(inviteLinkInput.value);

    /* Alert the copied text */
    var tooltip = document.getElementById("myTooltip");
    copyBtn = document.getElementById("inviteCopyBtn")
    copyBtn.innerText = "Copied"
    copyBtn.classList.add('btn-primary')
    copyBtn.classList.remove('btn-success')

}
function copyBtnOnMounse() {
    var tooltipp = document.getElementById("myTooltipp");
    tooltipp.innerHTML = "Copy to clipboard";
  }



