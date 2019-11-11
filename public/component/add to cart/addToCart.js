var divListProductID = document.getElementById("listProductId");
var productObjArrayForId = [];
var userCart = [];
var oldCheck = true;
var cartListCount = document.getElementById("itemCount");
////////////// AJAX //////////////////
var cartXttp = new XMLHttpRequest();
var productXttp = new XMLHttpRequest();
var updateProductXttp = new XMLHttpRequest();
var getCartXttp = new XMLHttpRequest();
var cartNewXttp = new XMLHttpRequest();
var userSession = JSON.parse(sessionStorage.getItem("userSessionKey"));


/////////////////////////////////////
function updateEverything() {
    productXttp.open("GET", "http://localhost:3000/getProduct");
    productXttp.setRequestHeader("Content-Type", "application/json");
    productXttp.send();
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
    getCartXttp.open("POST", "http://localhost:3000/getCart");
    getCartXttp.setRequestHeader("Content-Type", "application/json");
    getCartXttp.send(JSON.stringify({ Email }));
    getCartXttp.onreadystatechange = function () {
        if (getCartXttp.status == 200 && getCartXttp.readyState == 4) {
            userCart = JSON.parse(getCartXttp.responseText);
            console.log(userCart)
            if (!userCart.length) {
                oldCheck = false;
            }
            else {
                cartListCount.innerHTML = userCart[0].Product.length;
            }
        }
    };
}

function storeProducts(product) {
    var Product = product;
    updateProductXttp.open("POST", "http://localhost:3000/updateProduct");
    updateProductXttp.setRequestHeader("Content-Type", "application/json");
    updateProductXttp.send(JSON.stringify(Product));
}

function storeProductsAddedToCart() {
    var cart = userCart;
    if(oldCheck){
        cartXttp.open("POST", "http://localhost:3000/postCart");
        cartXttp.setRequestHeader("Content-Type", "application/JSON");
        cartXttp.send(JSON.stringify(cart));
    }
    else{
        oldCheck = true;
        cartNewXttp.open("POST", "http://localhost:3000/postCartForNew");
        cartNewXttp.setRequestHeader("Content-Type", "application/JSON");
        cartNewXttp.send(JSON.stringify(cart[cart.length-1]));
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
    var titleProductName = document.createElement("a");
    titleProductName.innerHTML = "<b>Product Name : </b>";
    divForProduct.appendChild(titleProductName);
    var valProductName = document.createTextNode(objectP.Name);
    divForProduct.appendChild(valProductName);
    addSpaceLine(divForProduct);

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
    cartBtn.setAttribute("type", "button");
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
        else if (!checkValue(idOfField.value, objectP.Quantity)) {
            idOfField.focus();
        }
        else {
            titleProductQuantity.innerHTML = "<b>Product Quantity : </b>" + (objectP.Quantity - idOfField.value);
            var productIndex = getIndexOfArray(objectP._id);
            productObjArrayForId[productIndex].Quantity = objectP.Quantity - idOfField.value;
                let index = getIndexOfProductInCart(objectP._id);
                if ( index == -1) {
                    if (!userCart.length)
                        userCart.push(returnUpdatedCartObj((productObjArrayForId[productIndex]), idOfField.value, userSession.Email));
                    else {
                        var obj = returnUpdatedCartObj((productObjArrayForId[productIndex]), idOfField.value, userSession.Email)
                        userCart[0].Product.push(obj.Product[0]);
                    }
                    cartListCount.innerHTML = parseInt(parseInt(cartListCount.innerHTML) + 1);
                }
                else {
                    userCart[0].Product[index].Quantity = parseInt(parseInt(userCart[0].Product[index].Quantity) + parseInt(idOfField.value));
                }
            storeProductsAddedToCart();
            storeProducts(objectP);
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
    var ProductId = obj._id;

    return { Email, Product: [{ Name, Description, Quantity, Price, ProductId }] };
}

function getIndexOfArray(id) {
    for (var i = 0; i < productObjArrayForId.length; i++) {
        if (productObjArrayForId[i]._id == id) {
            return i;
        }
    }
}

function getIndexOfProductInCart(id) {
    if (!userCart.length)
        return -1
    for (var i = 0; i < userCart[0].Product.length; i++)
        if (userCart[0].Product[i].ProductId == id) {
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
    location.assign('../../index.html');
    sessionStorage.removeItem("userSessionKey");
}