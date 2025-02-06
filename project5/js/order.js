
$("div.dropdown").click(function() {
    $("div.menuButton").toggleClass("change");
});
///////////////////////////////////////////////////////
var inCart = 0;

//////////////////// On Load //////////////////////

var cartString = '{"cart":[]}';
var totalItems = 0;
if(getCookie("cart") != ""){
    var cartString = getCookie("cart");
    cartObj = JSON.parse(cartString);
    cartSize= Object.keys(cartObj.cart).length;
    for(var i=0;i<cartSize;i++){
        var itemCount = parseInt(cartObj.cart[i].amount);
        totalItems += itemCount;
        var idNum = cartObj.cart[i].idNum;
        $("#countI"+idNum.toString()).val(itemCount);
    }
    updateCartTotal();
}


//////////////////////////////////////////////////

function updateCartTotal(){
    $("#itemCount").text(totalItems);
    $("#itemCountSub").text(totalItems);
}

//////////////////////////////////////////////////

$(".minus").click(minusButton);
$(".plus").click(plusButton);
function plusButton(){
    var idNum = $(this).attr('id').substring(1,2);
    var itemCount = parseInt($("#countI"+idNum).val());

    $("#countI"+idNum).val(itemCount+1);
    var itemPrice = $("#price"+idNum).text().substring(1);
    var itemName = $("#name"+idNum).text();
    remakeJsonP(idNum,itemPrice);
    totalItems++;
    updateCartTotal();
}
function minusButton(){
    var idNum = $(this).attr('id').substring(1,2);
    var itemCount = parseInt($("#countI"+idNum).val());
    if(itemCount != 0){
        $("#countI"+idNum).val(itemCount-1);
        var itemPrice = $("#price"+idNum).text().substring(1);
        var itemName = $("#name"+idNum).text();
        remakeJsonM(idNum,itemPrice);
        totalItems--;
        updateCartTotal();
    }
}
function remakeJsonM(itemId,itemPrice){
var spliceIndex = -1;
var cartObj = JSON.parse(cartString);
cartSize= Object.keys(cartObj.cart).length;
for(var i=0;i<cartSize;i++){
    if(cartObj.cart[i].idNum == itemId){
        var temp = parseInt(cartObj.cart[i].amount);
        temp = temp -1;
        if(temp == 0){
            spliceIndex = i;    
        }
        else{
            cartObj.cart[i].amount = temp.toString();    
        }
    }
}
if (spliceIndex >= 0){
    cartObj.cart.splice(spliceIndex,1);
}
cartString = JSON.stringify(cartObj);
delCookie("cart");
setCookie("cart",cartString,1);
}
function remakeJsonP(itemId,itemPrice){
var inCart = false;
var cartObj = JSON.parse(cartString);
cartSize= Object.keys(cartObj.cart).length;
for(var i=0;i<cartSize;i++){
    if(cartObj.cart[i].idNum == itemId){
        var temp = parseInt(cartObj.cart[i].amount);
        temp = temp +1;
        cartObj.cart[i].amount = temp.toString();
        cartString = JSON.stringify(cartObj);
        inCart = true;
    }
}
if(!inCart){
    var pushObj = {idNum:itemId, price:itemPrice, amount:"1"};
    cartObj['cart'].push(pushObj);
    cartString = JSON.stringify(cartObj);
}
delCookie("cart");
setCookie("cart",cartString,1);
}
function setCookie (name, value,numDays) {
var date = new Date();
date.setTime(date.getTime()+(1000*60*60*24*numDays));
var expires = "expires="+date.toUTCString();
document.cookie = name + "=" + value + ";"+expires+";path=/";
}
function delCookie (name) {
document.cookie = name + "=; expires=; path=/";
}
function getCookie (name) {
var searchName = name + "=";    

var decodedCookie = decodeURIComponent (document.cookie);
var carray = decodedCookie.split(';');      
                   
var i, oneCookie;

for (i = 0; i < carray.length; i++) {
    oneCookie = carray[i];          
    while (oneCookie.charAt(0) == ' ') {
        oneCookie = oneCookie.substring(1);
    }
    if (oneCookie.indexOf(searchName) == 0) {
        return oneCookie.substring (searchName.length, oneCookie.length);
    }
}
return "";
}
