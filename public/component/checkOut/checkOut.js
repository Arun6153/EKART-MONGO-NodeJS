var divCartList = document.getElementById("cartlistProductId");
var cartRawProducts = [];
var cartItemCount = document.getElementById("itemCount");
var billForCart = 0;
var originalProduct_arrayObject = [];
var userIndex;

//////// Xttp request  and session/////////
var productXttp = new XMLHttpRequest();
var originalCartXttp = new XMLHttpRequest();
var cartXttp = new XMLHttpRequest();
var userSession ;

///////////////////////////////
function updateEverything()
{
    userSession  = JSON.parse(sessionStorage.getItem("userSessionKey"));
    document.getElementById("aUserName").innerHTML = ""+ userSession.Name;
    getStoredProducts(userSession.Email);
    billFunction(billForCart);
    // getOriginalStoredProducts();
}
/////////////////////////////////////////////////////
// function getOriginalStoredProducts() {

//     originalCartXttp.open("GET","http://localhost:3000/getNewProduct");
//     originalCartXttp.send();
//     originalCartXttp.onreadystatechange = function(){
//         if(originalCartXttp.status == 200 && originalCartXttp.readyState == 4)
//         {
//             originalProduct_arrayObject = JSON.parse(originalCartXttp.responseText);
//             originalProduct_arrayObject = originalProduct_arrayObject.product;
//             if(isUserExists(userSession.EmailId) != -1){
//                 cartItemCount.innerHTML = "Items in cart : " + cartRawProducts[isUserExists(userSession.EmailId)].product.length;
//             }
//         }
//     };
// }
function storeOriginalStoredProducts(product){
    console.log("reached");
    let prodct = {product:product};
   originalCartXttp.open("POST","http://localhost:3000/postNewProduct");
   var stringproduct = JSON.stringify(prodct);
   originalCartXttp.setRequestHeader("Content-Type","application/JSON");
   originalCartXttp.send(stringproduct);
}
/////////////////////////////////////////////////////
function storeProducts(products) {
   let cart = {cart:products};
   cartXttp.open("POST","http://localhost:3000/postCart");
   var stringCart = JSON.stringify(cart);
   cartXttp.setRequestHeader("Content-Type","application/JSON");
   cartXttp.send(stringCart);
}
function getStoredProducts(Email) {
    productXttp.open("POST", "http://localhost:3000/getCart");
    productXttp.setRequestHeader("Content-Type", "application/json");
    productXttp.send(JSON.stringify({ Email: Email }));
    productXttp.onreadystatechange = function () {
        if (productXttp.readyState == 4 && productXttp.status == 200) {
            cartRawProducts = JSON.parse(productXttp.responseText);
            if (cartRawProducts.length != 0) {
                var len = cartRawProducts[0].Product.length;
                for (var i = 0; i < len; i++) {
                    addToDomOfProduct(cartRawProducts[0].Product[i]);
                }
            }
        }
    };
}
/////////////////////////////////////////////////////
function saveEverything()
{   
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
    aLink.setAttribute("href","../add to cart/addToCart.html");
    aLink.innerHTML="want to do more shopping !";
    divCartList.appendChild(aLink);
}
function addToDomOfProduct(objectP)
{
    var userId = 0;
    var divForProduct = document.createElement("div");
    var divForProduct = document.createElement("div");
    divCartList.appendChild(divForProduct);
    divForProduct.setAttribute("id","div-list");

    //////// Adding Product in Div //////////
    var productId       = document.createElement("label");
    var productName     = document.createElement("label");
    var productQuantity = document.createElement("label");
    var productPrice    = document.createElement("label");

    productId.innerHTML = "<b>P-ID : </b>"+objectP.ProductID;
    divForProduct.appendChild(productId);
    addSpaceLine(divForProduct);
    productName.innerHTML = "<b>Name : </b>"+objectP.Name;
    divForProduct.appendChild(productName);
    addSpaceLine(divForProduct);
    productPrice.innerHTML = "<b>Price :</b>"+objectP.Price+"rs / unit\t";
    divForProduct.appendChild(productPrice);
    addSpaceLine(divForProduct);
    productQuantity.innerHTML = "<b>Quantity :</b>"+objectP.Quantity+" units";
    divForProduct.appendChild(productQuantity);
    
    ////////// DELETE BUTTON ////////////
    var deleteBtn = document.createElement("input");
    deleteBtn.setAttribute("type", "button");
    deleteBtn.setAttribute("value", "Delete");
    divForProduct.appendChild(deleteBtn);
    /////////// Delete operation ////////
    
    deleteBtn.addEventListener("click",function(e){
        var target = e.target;
        var productNo = findProduct(target.parentNode.childNodes[0].childNodes[1].nodeValue);
        var product = cartRawProducts[userId].product[findProduct(target.parentNode.childNodes[0].childNodes[1].nodeValue)]
        if(product.Quantity == 1){
            cartRawProducts[userId].product.splice(productNo,1);
            target.parentNode.remove(target);
        }
        else{
            cartRawProducts[userId].product[productNo].Quantity--;
            productQuantity.innerHTML = "<b>Quantity :</b>"+objectP.Quantity+" units";
        }
        billForCart-=objectP.Price;
        billFunction(billForCart);
        console.log(cartRawProducts);
        storeProducts(cartRawProducts);
        originalProduct_arrayObject[findProductInProducts(target.parentNode.childNodes[0].childNodes[1].nodeValue)].Quantity++;
        storeOriginalStoredProducts(originalProduct_arrayObject);
        cartItemCount.innerHTML = "Items in a cart :"+cartRawProducts[userId].Product.length;
    }); 
    cartItemCount.innerHTML = "Items in a cart :"+cartRawProducts[userId].Product.length;
    ////// Bill For The Cart ///////
    billForCart+=objectP.Quantity*objectP.Price;
    billFunction(billForCart);
}

function findProduct(id){
    var userId = isUserExists(userSession.EmailId);
    for(var i=0;i<cartRawProducts[userId].product.length;i++)
    {
        if(cartRawProducts[userId].product[i].ProductID  == id)
        {
            return i;
        }
    }
    return -1;
}

function findProductInProducts(id){
    
    for(var i=0;i<originalProduct_arrayObject.length;i++)
    {console.log(id);
        if(originalProduct_arrayObject[i].ProductID  == id)
        {
            return i;
        }
    }
    return 0;
}

function isUserExists(id)
{
    for(var i=0;i<cartRawProducts.length;i++)
    {
        if(cartRawProducts[i].Email == id)
        {
            return i;
        }
    }
    return -1;
}

function billFunction(bill)
{
    document.getElementById("bill").innerHTML = "<b>Bill :</b>"+bill+"rs";
}

function getIndexOfArray(arrayO,id)
{
    for(var i=0;i<arrayO.length;i++)
    {
        if(arrayO[i].ProductID == id ){
            return i;
        }
    }
}
function checkValue(newVal,oldVal)
{
    if(oldVal - newVal < 0)
    {   alert("Enter a valid Quantity");
        return false;
    }
    else return true;
}
function addSpaceLine(spaceP) {
    var sp = document.createElement("br");
    spaceP.appendChild(sp);
}