$(document).ready(function(){
    $(".orderConfirmation").addClass("displayNone");
});

$("div.dropdown").click(function() {
    $("div.menuButton").toggleClass("change");
});


var boolOpen = false;

$("#payNow").click(function(){
    boolOpen = true;
    $(".paymentMenu").css("display", "block");
    $(".most").addClass("blurr");
    $(".orderSummary").css("overflow-y", "hidden");
});

$(".close").click(function(){
    if(boolOpen) {
        $(".paymentMenu").css("display", "none");
        $(".most").removeClass("blurr");
        $(".orderSummary").css("overflow-y", "scroll");
        boolOpen = false;
    }
});

//get cart
var totalItems = 0;
var subtotal = 0.00;
var total = 0.00;


$('.itemInfo').toggleClass("hideClass");

var cart = getCookie("cart");
if(getCookie("cart") != ""){
    cartObj = JSON.parse(cart);
    cartSize= Object.keys(cartObj.cart).length;
    for(var i=0;i<cartSize;i++){
        var price = parseFloat(cartObj.cart[i].price) * parseInt(cartObj.cart[i].amount);
        totalItems += parseInt(cartObj.cart[i].amount);
        subtotal += price;
        price = "$"+price.toFixed(2);
        $('.itemInfo').eq(cartObj.cart[i].idNum).children().eq(1).children().eq(1).text(price);
        $('.itemInfo').eq(cartObj.cart[i].idNum).children().eq(1).children().eq(2).text(cartObj.cart[i].amount);
        $('.itemInfo').eq(cartObj.cart[i].idNum).toggleClass("hideClass");
    }
}
updateCartTotal();
function updateCartTotal(){
    $("#itemCount").text(totalItems);
    $("#itemCountSub").text(totalItems);
}
subtotal = subtotal.toFixed(2);
var tax = (0.0625 * parseFloat(subtotal)).toFixed(2);
total = (1.0625 * parseFloat(subtotal)).toFixed(2);
var whitespace = " ";
if(subtotal.length < total.length){
    for(var i=0; i < (total.length-subtotal.length);i++){
        whitespace += " ";
    }
}
$("#bottomRow").children().eq(1).children().eq(0).text("Subtotal:"+whitespace+ "$"+subtotal);
whitespace="      ";
if(tax.length < total.length){
    for(var i=0; i < (total.length-tax.length);i++){
        whitespace += " ";
    }
}
$("#bottomRow").children().eq(1).children().eq(1).text("Tax:"+whitespace+ "$"+tax);
whitespace="    ";
$("#bottomRow").children().eq(1).children().eq(2).text("Total:"+whitespace+ "$"+total);

//////////////////////////////////////////////////////////////////////////////////////////////

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
function delCookie (name) {
    document.cookie = name + "=; expires=; path=/";
}


$("#submitButton").click(function(){
    var first = $("#firstName").val();
    var last = $("#lastName").val();
    var email = $("#email").val();
    var card = $("#cardInfo").val();

    var string = "Thank you for your order, " + first + " " + last + "!";

    if(first != "" && last != "" && email != "" && card != "") {
        $(".most, .paymentMenu, .navBar").toggleClass("displayNone");
        $(".orderConfirmation").removeClass("displayNone");

        $(".thankYou").text(string);
        $(".emailConf").text("We have sent a confirmation email of your order to " + email);
    }
    else {
        alert("Please fill all input fields.");
    }
});

$(".backUp").click(function(){
    $(".most, .paymentMenu, .navBar").toggleClass("displayNone");
    $(".orderConfirmation").addClass("displayNone");
    if(boolOpen) {
        $(".paymentMenu").css("display", "none");
        $(".most").removeClass("blurr");
        $(".orderSummary").css("overflow-y", "scroll");
        boolOpen = false;
    }
});


$(".resetPage").click(function() {
    $("#firstName").val("");
    $("#lastName").val("");
    $("#email").val("");
    $("#cardInfo").val("");
    delCookie("cart");
    window.location.href = "index.html";
});