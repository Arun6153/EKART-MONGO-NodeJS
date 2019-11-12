var aAddNewProduct = document.getElementById("aAddNewProduct");
var divToAddProduct = document.getElementById("divToAddProduct");
var divListProducts = document.getElementById("divListProducts");
var product = [];
var getStoreProductXttp = new XMLHttpRequest();
var postStoreProductXttp = new XMLHttpRequest();
var updateProductXttp = new XMLHttpRequest();
var deleteProductXttp = new XMLHttpRequest();
var currentPage = 0;

window.updateEverything = function () {
    getStoredProducts();
    getStoreProductXttp.onreadystatechange = function () {
        if (getStoreProductXttp.readyState == 4 && getStoreProductXttp.status == 200) {
            product = JSON.parse(getStoreProductXttp.responseText);
            if (product) {
                if(product.length > 10) {
                    pagination();
                }
                else {
                    for (var i = 0; i < product.length; i++) {
                        addToDomOfProduct(product[i]);
                    }
                }
            }
            else {
                product = [];
            }
        }
    }
}

function loadNextUsers() {
    currentPage+=10;
    $("#divListProducts").empty();
    pagination();
}

function loadPreviousUsers() {
    currentPage-=10;
    $("#divListProducts").empty();
    pagination();
}

function addPaginationButtons() {
    if (product.length < 11) {
        $('#paginationButtons').remove();
    }
    else {
        if (currentPage == 0)
            $("#divListProducts").append("<div id='paginationButtons'><button disabled type='button'>Previous</button>\
    <button style='margin-left:5px' onclick='loadNextUsers()' type='button'>Next</button><br><br></div>");

        else if (currentPage + 10 > product.length)
            $("#divListProducts").append("<div id='paginationButtons'><button type='button' onclick='loadPreviousUsers()'>Previous</button>\
    <button disabled style='margin-left:5px' onclick='loadNextUsers()' type='button'>Next</button><br><br></div>");

        else
            $("#divListProducts").append("<div id='paginationButtons'><button type='button' onclick='loadPreviousUsers()'>Previous</button>\
    <button style='margin-left:5px' type='button'>Next</button><br><br></div>");
    }
}

function pagination() {
    for(var i = currentPage; i < currentPage+10; i++) {
        if(i == product.length)
            break;
        addToDomOfProduct(product[i]);
    }
    addPaginationButtons();
}

////// Product operation ////////////////
function storeProducts(product) {
    postStoreProductXttp.open("POST", "http://localhost:3000/postProduct");
    postStoreProductXttp.setRequestHeader("Content-Type", "application/json");
    postStoreProductXttp.send(JSON.stringify(product));
}
function updateProducts(product) {
    updateProductXttp.open("POST", "http://localhost:3000/updateProduct");
    updateProductXttp.setRequestHeader("Content-Type", "application/json");
    updateProductXttp.send(JSON.stringify(product));
}
function getStoredProducts() {
    getStoreProductXttp.open("GET", "http://localhost:3000/getProduct");
    getStoreProductXttp.send();
}
function deleteProduct(product){
    deleteProductXttp.open("POST", "http://localhost:3000/deleteProduct");
    deleteProductXttp.setRequestHeader("Content-Type", "application/json");
    deleteProductXttp.send(JSON.stringify(product));
}
/////////////////////////////////////////

function createProductPanel(newP, index, PrId) {
    hidePanel(aAddNewProduct);
    divToAddProduct.innerHTML = ("<h3>Add Product</h3>");
    var productName = document.createElement("input");
    var productDesc = document.createElement("input");
    var productQuantity = document.createElement("input");
    var productPrice = document.createElement("input");
    var submitBtn = document.createElement("input");

    productName.setAttribute("id", "pName");
    productDesc.setAttribute("id", "pDesc");
    productQuantity.setAttribute("id", "pQuantity");
    productPrice.setAttribute("id", "pPrice");
    submitBtn.setAttribute("type", "submit");
    submitBtn.setAttribute("value", "Submit Here!");

    productName.setAttribute("type", "text");
    productDesc.setAttribute("type", "text");
    productQuantity.setAttribute("type", "number");
    productPrice.setAttribute("type", "number");

    divToAddProduct.appendChild(productName);
    addSpaceLine(divToAddProduct);
    divToAddProduct.appendChild(productDesc);
    addSpaceLine(divToAddProduct);
    divToAddProduct.appendChild(productQuantity);
    addSpaceLine(divToAddProduct);
    divToAddProduct.appendChild(productPrice);
    addSpaceLine(divToAddProduct);
    divToAddProduct.appendChild(submitBtn);
    if (newP) {
        productName.setAttribute("placeholder", "Enter A Product Name");
        productDesc.setAttribute("placeholder", "Enter A Product Description");
        productQuantity.setAttribute("placeholder", "Enter Quantity of Product");
        productPrice.setAttribute("placeholder", "Enter A Product Price");
    } else {
        document.getElementById("pName").value = product[index].Name;
        document.getElementById("pDesc").value = product[index].Description;
        document.getElementById("pQuantity").value = product[index].Quantity;
        document.getElementById("pPrice").value = product[index].Price;
    }
    submitBtn.addEventListener("click", function () {
        var Name = document.getElementById("pName").value;
        var Description = document.getElementById("pDesc").value;
        var Quantity = document.getElementById("pQuantity").value;
        var Price = document.getElementById("pPrice").value;
        var productObject = {
            Name,
            Description,
            Quantity,
            Price,
        };
        if (newP) {
            if (!checkValues(productObject)) {
                createProductPanel(true);
            }
            else {
                addNewProductToArray(productObject);
                if(product.length <= currentPage+10) {
                    addToDomOfProduct(productObject);
                }
                else {
                    addPaginationButtons();
                    destroyPanel();
                }
                showPanel(aAddNewProduct);
            }
        }/////////  Edited data - update /////////
        else {
            product[index] = productObject;
            product[index]._id = PrId;
            destroyPanel();
            updateProducts(product[index]);
            addToDomOfProduct(product[index]);
            showPanel(aAddNewProduct);
        }
    });
}
function addNewProductToArray(obj) {
    product.push(obj);
    storeProducts(obj);
    getStoredProducts();
    getStoreProductXttp.onreadystatechange = function () {
        if (getStoreProductXttp.readyState == 4 && getStoreProductXttp.status == 200) {
            product = JSON.parse(getStoreProductXttp.responseText);
        }
    }
}
function addToDomOfProduct(objectP) {
    //////////// DomProduct Div ////////////
    var newDivListProduct = document.createElement("div");
    divListProducts.appendChild(newDivListProduct);
    newDivListProduct.style.width = "100%";
    newDivListProduct.style.border = "1px";
    newDivListProduct.style.borderStyle = "solid";
    newDivListProduct.style.borderColor = "black";
    newDivListProduct.style.padding = "2px";
    newDivListProduct.style.margin = "4px";
    ////////// Name & Description /////////
    var LableName = document.createElement("a");
    LableName.innerHTML = "<b>Name   : </b>";
    newDivListProduct.appendChild(LableName);
    var aName = document.createElement("a");
    aName.setAttribute("href", "./component/add to cart/addToCart.html");
    aName.setAttribute("target", "_blank");
    aName.innerHTML = objectP.Name + "<br>";
    newDivListProduct.appendChild(aName);

    var tDesc = document.createElement("a");
    tDesc.innerHTML = "<b>Details :</b> " + objectP.Description;
    newDivListProduct.appendChild(tDesc);

    ////////// Delete button //////////////
    var deleteBtn = document.createElement("input");
    deleteBtn.setAttribute("type", "submit");
    deleteBtn.setAttribute("value", "Delete");
    newDivListProduct.appendChild(deleteBtn);
    deleteBtn.style.cssFloat = "right";
    deleteBtn.style.borderLeft = 0;
    deleteBtn.style.marginBottom = "2px";
    deleteBtn.style.marginTop = "-12px";
    ////////// Edit button ////////////////
    var editBtn = document.createElement("input");
    editBtn.setAttribute("type", "submit");
    editBtn.setAttribute("value", "Edit");
    newDivListProduct.appendChild(editBtn);
    editBtn.style.cssFloat = "right";
    editBtn.style.marginBottom = "2px";
    editBtn.style.marginTop = "-12px";

    ////////// Delete OPERATION ///////////
    deleteBtn.addEventListener("click", function (e) {
        var target = e.target;
        target.parentNode.remove(target);
        removeFromProductsArray(objectP._id);
        if(product.length <= currentPage && currentPage != 0) {
            loadPreviousUsers();
        }
        else {
            destroyProductsFromDOM();
            pagination();
        }
    });
    ////////// Edit OPERATION /////////////
    editBtn.addEventListener("click", function (e) {
        var targetParent = e.target.parentNode;
        createProductPanel(false, getIndexFromId(objectP._id), objectP._id);
        targetParent.parentNode.removeChild(targetParent);
    });
    destroyPanel();
}
function removeFromProductsArray(id) {
    for (var i = 0; i < product.length; i++) {
        if (product[i]._id == id) {
            console.log(product[i])
            deleteProduct(product[i]);
            product.splice(i, 1);
            break;
        }
    }
}
function getIndexFromId(id) {
    if (!product) return false;
    for (var i = 0; i < product.length; i++) {
        if (product[i]._id == id) {
            return i;
        }
    }
}
function checkValues(obj) {
    if (obj.Name && obj.Price && obj.Quantity && obj.Description) {
        return true;
    }
    else {
        alert("Fill the empty form to proceed.");
        return false;
    }
}
function destroyPanel() {
    while (divToAddProduct.hasChildNodes()) {
        divToAddProduct.removeChild(divToAddProduct.firstChild);
    }
}
function destroyProductsFromDOM() {
    while(divListProducts.hasChildNodes()) {
        divListProducts.removeChild(divListProducts.firstChild);
    }
}
function hidePanel(hideP) {
    hideP.style.visibility = "hidden";
}

function showPanel(showP) {
    showP.style.visibility = "visible";
}

function addSpaceLine(spaceP) {
    var sp = document.createElement("br");
    spaceP.appendChild(sp);
    sp = document.createElement("br");
    spaceP.appendChild(sp);
}