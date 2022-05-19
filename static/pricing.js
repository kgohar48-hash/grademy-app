
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
var pricingBtns     = Array.from(document.getElementsByClassName("pricing-btn"));
var totalPrice1     = document.getElementById("t-price-1")
var totalPrice3     = document.getElementById("t-price-3")
var totalPrice6     = document.getElementById("t-price-6")
var totalMonth1    = document.getElementById("t-month-1")
var totalMonth3    = document.getElementById("t-month-3")
var totalMonth6    = document.getElementById("t-month-6")
var totalSave1     = document.getElementById("t-save-1")
var totalSave3     = document.getElementById("t-save-3")
var totalSave6     = document.getElementById("t-save-6")
var perMonth1     = document.getElementById("t-per-month-1")
var perMonth3     = document.getElementById("t-per-month-3")
var perMonth6     = document.getElementById("t-per-month-6")
var paymentBtn1     = document.getElementById("payment-btn1")
var paymentBtn3     = document.getElementById("payment-btn3")
var paymentBtn6     = document.getElementById("payment-btn6")



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

pricingBtns.forEach(btn => {
    btn.addEventListener("click", e => {
        save = 0.20
        plan = e.target.dataset["number"]
        console.log(plan)
        if(plan == "premium"){
            base = 500
            pricingBtns[1].classList.remove("btn-success")
            pricingBtns[0].classList.add("btn-success")
        }else{
            base = 1500
            pricingBtns[0].classList.remove("btn-success")
            pricingBtns[1].classList.add("btn-success")
            plan = "premiumplus"
        }
        totalPrice1.innerText       = "Total Rs."+base 
        totalPrice3.innerText       = "Total Rs."+(base - base*save)*3
        totalPrice6.innerText       = "Total Rs."+(base - base*save*2)*6
        totalMonth1.innerText       = "1"
        totalMonth3.innerText       = "3"
        totalMonth6.innerText       = "6"
        totalSave1.innerText        = ""
        totalSave3.innerText        = "SAVE "+(save*100)+"%"
        totalSave6.innerText        = "SAVE "+(save*200)+"%"
        perMonth1.innerText         = "Rs."+(base)+"/mo"
        perMonth3.innerText         = "Rs."+(base - base*save)+"/mo"
        perMonth6.innerText         = "Rs."+(base - base*save*2)+"/mo"
        paymentBtn1.href            = "/payment/plan/"+plan+"/1"
        paymentBtn3.href            = "/payment/plan/"+plan+"/3"
        paymentBtn6.href            = "/payment/plan/"+plan+"/6"
        console.log(paymentBtn3.href)
    });
  });

// pricing details animation
$(".pricing-container").click(function(){
    $(".pricing-container").removeClass("active");
    $(this).addClass("active");
});



