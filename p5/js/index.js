        
        var totalItems = 0;
        var cart = getCookie("cart");
        if(getCookie("cart") != ""){
            cartObj = JSON.parse(cart);
            cartSize= Object.keys(cartObj.cart).length;
            for(var i=0;i<cartSize;i++){
                totalItems += parseInt(cartObj.cart[i].amount);
            }
        }
        updateCartTotal();

        $("div.dropdown").click(function() {
            $("div.menuButton").toggleClass("change");
        });

        function updateCartTotal(){
            $("#itemCount").text(totalItems);
            $("#itemCountSub").text(totalItems);
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