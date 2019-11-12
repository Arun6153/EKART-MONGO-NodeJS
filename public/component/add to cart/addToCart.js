var divListProductID = document.getElementById("listProductId");
var productObjArrayForId = [];
var userCart = [];
var oldCheck = true;
var cartListCount = document.getElementById("itemCount");
////////////// AJAX //////////////////
var cartXHttp = new XMLHttpRequest();
var pushCart = new XMLHttpRequest();
var productXHttp = new XMLHttpRequest();
var updateProductXHttp = new XMLHttpRequest();
var getCartXHttp = new XMLHttpRequest();
var cartNewXHttp = new XMLHttpRequest();
var userSession = JSON.parse(sessionStorage.getItem("userSessionKey"));
var currentPage = 0;

/////////////////////////////////////
function updateEverything() {
    productXHttp.open("GET", "http://localhost:3000/getProduct");
    productXHttp.setRequestHeader("Content-Type", "application/json");
    productXHttp.send();
    productXHttp.onreadystatechange = function () {
        if (productXHttp.readyState == 4 && productXHttp.status == 200) {
            productObjArrayForId = JSON.parse(productXHttp.responseText);
            if (productObjArrayForId.length > 10) {
                pagination();
            }
            else {
                productObjArrayForId.forEach(function (prod) {
                    addToDomOfProductID(prod);
                });
            }
            document.getElementById("aUserName").innerHTML = "" + userSession.Name;
            getUserCartFromLocalStorage(userSession.Email);
        }
    };
}

function loadNextUsers() {
    currentPage+=10;
    $("#listProductId").empty();
    pagination();
}

function loadPreviousUsers() {
    currentPage-=10;
    $("#listProductId").empty();
    pagination();
}

function pagination() {
    for(var i = currentPage; i < currentPage+10; i++) {
        if(i == productObjArrayForId.length)
            break;
        addToDomOfProductID(productObjArrayForId[i]);
    }
    if(currentPage == 0)
    $("#listProductId").append("<button disabled type='button'>Previous</button>\
    <button style='margin-left:5px' onclick='loadNextUsers()' type='button'>Next</button><br><br>");

    else if(currentPage+10 > productObjArrayForId.length)
    $("#listProductId").append("<button type='button' onclick='loadPreviousUsers()'>Previous</button>\
    <button disabled style='margin-left:5px' onclick='loadNextUsers()' type='button'>Next</button><br><br>");

    else
    $("#listProductId").append("<button type='button' onclick='loadPreviousUsers()'>Previous</button>\
    <button style='margin-left:5px' type='button'>Next</button><br><br>");
}

function getUserCartFromLocalStorage(Email) {
    getCartXHttp.open("POST", "http://localhost:3000/getCart");
    getCartXHttp.setRequestHeader("Content-Type", "application/json");
    getCartXHttp.send(JSON.stringify({ Email }));
    getCartXHttp.onreadystatechange = function () {
        if (getCartXHttp.status == 200 && getCartXHttp.readyState == 4) {
            userCart = JSON.parse(getCartXHttp.responseText);
            console.log(userCart.Product);
            if (!userCart.Product.length) {
                oldCheck = false;
            }
            else {
                cartListCount.innerHTML = userCart.Product.length;
            }
        }
    };
}

function storeProducts(product) {
    var Product = product;
    updateProductXHttp.open("POST", "http://localhost:3000/updateProduct");
    updateProductXHttp.setRequestHeader("Content-Type", "application/json");
    updateProductXHttp.send(JSON.stringify(Product));
}

function storeProductsAddedToCart(userCart) {
    console.log(userCart);
    var cart = userCart;
    if(oldCheck){
        pushCart.open("POST", "http://localhost:3000/postCart");
        pushCart.setRequestHeader("Content-Type", "application/JSON");
        pushCart.send(JSON.stringify(cart));
    }
    else{
        oldCheck = true;
        cartNewXHttp.open("POST", "http://localhost:3000/postCartForNew");
        cartNewXHttp.setRequestHeader("Content-Type", "application/JSON");
        cartNewXHttp.send(JSON.stringify(cart[cart.length-1]));
    }
}

function addToDomOfProductID(objectP) {
    //////// Product ID div //////////
    var divForProduct = document.createElement("div");
    divListProductID.appendChild(divForProduct);
    divForProduct.setAttribute("id","div-list");

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

    ////////// Add To Cart Button ///////
    var cartBtn = document.createElement("input");
    cartBtn.setAttribute("type", "button");
    cartBtn.setAttribute("value", "Add To Cart  >>");
    divForProduct.appendChild(cartBtn);
    divForProduct.appendChild(fieldProductQuantity);

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
            console.log(productIndex);
            productObjArrayForId[productIndex].Quantity = objectP.Quantity - idOfField.value;
            let index = getIndexOfProductInCart(objectP._id);
                if ( index == -1) {
                    if (!userCart.Product.length)
                        userCart.push(returnUpdatedCartObj((productObjArrayForId[productIndex]), idOfField.value, userSession.Email));
                    else {
                        var obj = returnUpdatedCartObj((productObjArrayForId[productIndex]), idOfField.value, userSession.Email)
                        userCart.Product.push(obj.Product[0]);
                    }
                    cartListCount.innerHTML = parseInt(parseInt(cartListCount.innerHTML) + 1);
                }
                else {
                    userCart.Product[index].Quantity = parseInt(parseInt(userCart.Product[index].Quantity) + parseInt(idOfField.value));
                }
            storeProductsAddedToCart(userCart);
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
    if (!userCart.Product.length)
        return -1
    for (var i = 0; i < userCart.Product.length; i++)
        if (userCart.Product[i].ProductId == id) {
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