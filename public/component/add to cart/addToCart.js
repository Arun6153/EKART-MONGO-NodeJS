var divListProductID = document.getElementById("listProductId");
var productObjArrayForId = [];
var userCart = {};
var oldCheck = true;
var cartListCount = document.getElementById("itemCount");
////////////// AJAX //////////////////
var cartXttp = new XMLHttpRequest();
var productXttp = new XMLHttpRequest();
var userSession = JSON.parse(sessionStorage.getItem("userSessionKey"));


/////////////////////////////////////
function updateEverything() {
    getStoredProducts();
    productXttp.onreadystatechange = function () {
        if (productXttp.readyState == 4 && productXttp.status == 200) {
            productObjArrayForId = JSON.parse(productXttp.responseText);
            productObjArrayForId.forEach(function (prod) {
                addToDomOfProductID(prod);
            });
            document.getElementById("aUserName").innerHTML = "" + userSession.Name;
            getUserCartFromLocalStorage(userSession.Email);
        }
    };
}
function getUserCartFromLocalStorage(Email) {
    cartXttp.open("POST", "http://localhost:3000/getCart");
    cartXttp.setRequestHeader("Content-Type", "application/json");
    cartXttp.send(JSON.stringify({ Email }));
    cartXttp.onreadystatechange = function () {
        if (cartXttp.status == 200 && cartXttp.readyState == 4) {
            userCart = JSON.parse(cartXttp.responseText);
            if (userCart.bool!="false") {
                oldCheck = false;
                cartListCount.innerHTML = "Items in cart : " + userCart.Product.length;
            }
            else {
                userCart={};
                console.log("Yeah Baby");
            }
        }
    };
}
function getStoredProducts() {
    productXttp.open("GET", "http://localhost:3000/getProduct");
    productXttp.setRequestHeader("Content-Type", "application/json");
    productXttp.send();
}
function storeProducts(product) {
    productXttp.open("POST", "http://localhost:3000/postProduct");
    productXttp.setRequestHeader("Content-Type", "application/json");
    productXttp.send(JSON.stringify(product));
}
function storeProductsAddedToCart(cart) {
    console.log(cart);
    if(oldCheck){
        oldCheck=false;
        cartXttp.open("POST", "http://localhost:3000/postCart");
        cartXttp.setRequestHeader("Content-Type", "application/JSON");
        cartXttp.send(JSON.stringify(cart));
    }
    else{
        cartXttp.open("POST", "http://localhost:3000/postCartForNew");
        cartXttp.setRequestHeader("Content-Type", "application/JSON");
        cartXttp.send(JSON.stringify(cart));
    }
}
function addToDomOfProductID(objectP) {
    //////// Product ID div //////////
    var divForProduct = document.createElement("div");
    divListProductID.appendChild(divForProduct);
    divForProduct.style.width = "100%";
    divForProduct.style.border = "1px";
    divForProduct.style.borderStyle = "solid";
    divForProduct.style.borderColor = "black";
    divForProduct.style.padding = "2px";
    divForProduct.style.padding = "2px";
    divForProduct.style.margin = "4px";

    //////// Adding Product Id ////////
    var titleProductId = document.createElement("a");
    titleProductId.innerHTML = "<b>Product Id : </b>";
    divForProduct.appendChild(titleProductId);
    var valProductID = document.createTextNode(objectP._id);
    divForProduct.appendChild(valProductID);
    addSpaceLine(divForProduct);

    var titleProductQuantity = document.createElement("a");
    titleProductQuantity.innerHTML = "<b>Product Quantity : </b>" + objectP.Quantity;
    divForProduct.appendChild(titleProductQuantity);
    var fieldProductQuantity = document.createElement("input");
    fieldProductQuantity.setAttribute("type", "number");
    fieldProductQuantity.setAttribute("placeholder", "Enter Quantity Needed");
    fieldProductQuantity.setAttribute("id", "Q" + objectP._id);
    divForProduct.appendChild(fieldProductQuantity);

    ////////// Add To Cart Button ///////
    var cartBtn = document.createElement("input");
    cartBtn.setAttribute("type", "submit");
    cartBtn.setAttribute("value", "Add To ->");
    divForProduct.appendChild(cartBtn);
    cartBtn.style.marginBottom = "2px";
    cartBtn.style.marginTop = "-15px";
    ////////// Add To Button Operation /////

    cartBtn.addEventListener("click", function () {
        var idOfField = document.getElementById("Q" + objectP._id);
        if (idOfField.value == "") {
            alert("Don't leave field empty");
            idOfField.focus();
        }
        if (!checkValue(idOfField.value, objectP.Quantity)) {
            idOfField.focus();
        }
        else {
            titleProductQuantity.innerHTML = "<b>Product Quantity : </b>" + (objectP.Quantity - idOfField.value);
            var productIndex = getIndexOfArray(objectP._id);
            productObjArrayForId[productIndex].Quantity = objectP.Quantity - idOfField.value;
            if (Object.keys(userCart).length) {
                console.log(userCart);
                userCart = (returnUpdatedCartObj((productObjArrayForId[productIndex]), idOfField.value), userSession.Email);
            }
            else {
                let index = getIndexOfProductInCart(objectP._id);
                if ( index == -1) {
                    userCart.Product.push(returnUpdatedCartObj((productObjArrayForId[productIndex]), idOfField.value,userSession.Email));
                }
                else {
                    userCart.Product[index].Quantity += parseInt(idOfField.value);
                }
            }

            storeProductsAddedToCart(userCart);
            storeProducts(productObjArrayForId);
            if(userCart.Product.length)
                cartListCount.innerHTML = "Items in cart : " + userCart.Product.length;
            else cartListCount.innerHTML = "Items in cart : " + 0;
            idOfField.value = "";
        }
    });
}
function returnUpdatedCartObj(obj,quantity, mail) {
    
    var Email = mail;
    var Name = obj.Name;
    var Description = obj.Description;
    var Quantity =quantity;
    var Price = obj.Price;
    var ProductID = obj._id;

    return { Email, Product: { Name, Description, Quantity, Price, ProductID } };
}
function getIndexOfArray(id) {
    for (var i = 0; i < productObjArrayForId.length; i++) {
        if (productObjArrayForId[i]._id == id) {
            return i;
        }
    }
}
function getIndexOfProductInCart(id) {
    console.log(userCart);
    if(userCart) return -1;
    for (var i = 0; i < userCart.Product.length; i++)
        if (userCart.Product[i]._id == id) {
            return i;
        }
    return -1;
}
function checkValue(newVal, oldVal) {
    if (oldVal - newVal < 0 || newVal < 1) {
        alert("Enter a valid Quantity");
        return false;
    }
    else return true;
}
function addSpaceLine(spaceP) {
    var sp = document.createElement("br");
    spaceP.appendChild(sp);
}
function logout() {
    location.assign('../../Login.html');
    sessionStorage.removeItem("userSessionKey");
}