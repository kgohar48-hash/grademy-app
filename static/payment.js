
var expireElement   = document.getElementById("expire-date")
var duration        = Number(document.getElementById('duration').innerHTML)
var plan            = document.getElementById('plan').value
var totalAmount     = document.getElementById("total-amount")
var discountpercent = document.getElementById("discount-percent")
var discountamount  = document.getElementById("discount-amount")
var totalBill       = document.getElementById("total-bill")
var planName        = Array.from(document.getElementsByClassName('plan-name'))

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December","January"];
const date = new Date();
expireElement.innerText = months[date.getMonth()+duration]+"/"+date.getUTCDate()+"/"+date.getFullYear()
var save = 0.2
if(plan != "premium"){
    base = 1500
    planName.forEach(plan=>{
        plan.innerHTML = "Premium Plus"
    })
}else{
    base = 500
    planName.forEach(plan=>{
        plan.innerHTML = "Premium"
    })

}

if(duration == 1){
    discountpercent.innerHTML = 0
    discountamount.innerHTML = 0
    totalBill.innerHTML = base
}else{
    discountpercent.innerHTML = (save*100*duration/3)
    discountamount.innerHTML  = (save*base*duration/3)*duration
    totalBill.innerHTML = (base - base*save*duration/3)*duration
}

totalAmount.innerText = base*duration
