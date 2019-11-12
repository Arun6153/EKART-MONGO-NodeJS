var divCartList = document.getElementById("cartlistProductId");
var cartRawProducts = [];
var cartItemCount = document.getElementById("itemCount");
var billForCart = 0;
var userIndex;
var originalProduct_arrayObject = [];
//////// XHttp request  and session/////////
let productXHttp = new XMLHttpRequest();
let originalCartXHttp = new XMLHttpRequest();
let originalProductXHttp = new XMLHttpRequest();
let cartXHttp = new XMLHttpRequest();
let userSession;
///////////////////////////////
function OriginalProductFetch() {
    originalProductXHttp.onreadystatechange = function () {
        if (originalProductXHttp.readyState == 4 && originalProductXHttp.status == 200) {
            originalProduct_arrayObject = JSON.parse(originalProductXHttp.responseText);
            console.log(originalProduct_arrayObject);
        }
    }
    console.log("In fetch")
    originalProductXHttp.open('GET', "http://localhost:3000/getProduct");
    originalProductXHttp.send();
}
function updateEverything() {
    userSession = JSON.parse(sessionStorage.getItem("userSessionKey"));
    document.getElementById("aUserName").innerHTML = "" + userSession.Name;
    OriginalProductFetch();
    getStoredProducts(userSession.Email);
    billFunction(billForCart);
}
function updateInOriginalProducts(product) {
    console.log(product);
    originalCartXHttp.open("POST", "http://localhost:3000/updateProduct");
    originalCartXHttp.setRequestHeader("Content-Type", "application/JSON");
    originalCartXHttp.send(JSON.stringify(product));
}
/////////////////////////////////////////////////////
function storeProducts(products) {
    cartXHttp.open("POST", "http://localhost:3000/postCart");
    cartXHttp.setRequestHeader("Content-Type", "application/JSON");
    cartXHttp.send(JSON.stringify(products));
}
function getStoredProducts(Email) {
    productXHttp.open("POST", "http://localhost:3000/getCart");
    productXHttp.setRequestHeader("Content-Type", "application/json");
    productXHttp.send(JSON.stringify({ Email: Email }));
    productXHttp.onreadystatechange = function () {
        if (productXHttp.readyState == 4 && productXHttp.status == 200) {
            cartRawProducts = JSON.parse(productXHttp.responseText);
            if (cartRawProducts.Product.length != 0) {
                var len = cartRawProducts.Product.length;
                for (var i = 0; i < len; i++) {
                    addToDomOfProduct(cartRawProducts.Product[i]);
                }
            }
        }
    };
}
/////////////////////////////////////////////////////
function saveEverything() {
    localStorage.userCart = JSON.stringify([]);
    localStorage.checkOutProducts = JSON.stringify(cartRawProducts);
    localStorage.billCheckedOut = JSON.stringify(billForCart);
    while (divCartList.hasChildNodes()) {
        divCartList.removeChild(divCartList.firstChild);
    }
    cartItemCount.innerHTML = "Items in cart : 0";
    document.getElementById("checkoutButton").style.visibility = "hidden";
    document.getElementById("bill").style.visibility = "hidden";
    var aLink = document.createElement("a");
    aLink.setAttribute("href", "../add to cart/addToCart.html");
    aLink.innerHTML = "want to do more shopping !";
    divCartList.appendChild(aLink);
}
function addToDomOfProduct(objectP) {
    var userId = 0;
    var divForProduct = document.createElement("div");
    var divForProduct = document.createElement("div");
    divCartList.appendChild(divForProduct);
    divForProduct.setAttribute("id", "div-list");

    //////// Adding Product in Div //////////
    var productId = document.createElement("label");
    var productName = document.createElement("label");
    var productQuantity = document.createElement("label");
    var productPrice = document.createElement("label");

    productId.innerHTML = "<b>P-ID : </b>" + objectP.ProductId;
    divForProduct.appendChild(productId);
    addSpaceLine(divForProduct);
    productName.innerHTML = "<b>Name : </b>" + objectP.Name;
    divForProduct.appendChild(productName);
    addSpaceLine(divForProduct);
    productPrice.innerHTML = "<b>Price :</b>" + objectP.Price + "rs / unit\t";
    divForProduct.appendChild(productPrice);
    addSpaceLine(divForProduct);
    productQuantity.innerHTML = "<b>Quantity :</b>" + objectP.Quantity + " units";
    divForProduct.appendChild(productQuantity);

    ////////// DELETE BUTTON ////////////
    var deleteBtn = document.createElement("input");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("value", "Delete");
    divForProduct.appendChild(deleteBtn);
    /////////// Delete operation ////////

    deleteBtn.addEventListener("click", function (e) {
        var target = e.target;
        var productNo = findProduct(target.parentNode.childNodes[0].childNodes[1].nodeValue);
        var product = cartRawProducts.Product[productNo];
        if (product.Quantity == 1) {
            cartRawProducts.Product.splice(productNo, 1);
            target.parentNode.remove(target);
        }
        else {
            cartRawProducts.Product[productNo].Quantity--;
            productQuantity.innerHTML = "<b>Quantity :</b>" + objectP.Quantity + " units";
        }
        billForCart -= objectP.Price;
        billFunction(billForCart);
        storeProducts(cartRawProducts);
        originalProduct_arrayObject[productNo].Quantity +=1;
        updateInOriginalProducts(originalProduct_arrayObject[productNo],);
        cartItemCount.innerHTML = "Items in a cart :" + cartRawProducts.Product.length;
    });
    cartItemCount.innerHTML = "Items in a cart :" + cartRawProducts.Product.length;
    ////// Bill For The Cart ///////
    billForCart += objectP.Quantity * objectP.Price;
    billFunction(billForCart);
}

function findProduct(id) {
    for (var i = 0; i < cartRawProducts.Product.length; i++) {
        if (cartRawProducts.Product[i].ProductId == id) {
            return i;
        }
    }
    return -1;
}

function findProductInProducts(id) {

    for (var i = 0; i < originalProduct_arrayObject.length; i++) {
        console.log(id);
        if (originalProduct_arrayObject[i].ProductID == id) {
            return i;
        }
    }
    return 0;
}

// function isUserExists(id)
// {
//     for(var i=0;i<cartRawProducts.length;i++)
//     {
//         if(cartRawProducts[i].Email == id)
//         {
//             return i;
//         }
//     }
//     return -1;
// }

function billFunction(bill) {
    document.getElementById("bill").innerHTML = "<b>Bill :</b>" + bill + "rs";
}

function getIndexOfArray(arrayO, id) {
    for (var i = 0; i < arrayO.length; i++) {
        if (arrayO[i].ProductID == id) {
            return i;
        }
    }
}
function checkValue(newVal, oldVal) {
    if (oldVal - newVal < 0) {
        alert("Enter a valid Quantity");
        return false;
    }
    else return true;
}
function addSpaceLine(spaceP) {
    var sp = document.createElement("br");
    spaceP.appendChild(sp);
}