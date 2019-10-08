var express = require("express");
var session = require("express-session");
var router = express.Router();
var product = require('./database/model').productModel;
var cart = require('./database/model').cartModel;
var user = require('./database/model').userModel;

/////////////////// requests - for user ////////////////
router.post("/getUser", function (req, res) {
    user.find({
        Email: req.body.mail,
        Password: req.body.pass
    })
    .then((data) => {
        if (data.length) {
            res.end(JSON.stringify(data[0]));
        }
        else
            res.end("false");
    })
    .catch((err) => {
        console.log("Error While logging in User: ", err);
        res.end("false");
    });
});

router.post("/postUser", function (req, res) {
    user.create({
        Name: req.body.Name,
        Address: req.body.Address,
        Password: req.body.Password,
        Email: req.body.Email
    })
    .then((data) => {
        res.end("User registered");  
    })
    .catch((err) => {
        console.log("Error While adding User: ", err);
        res.end();
    })
});

/////////////////// Requests - for products //////////////
router.get('/getProduct', (req, res) => {
    product.find({})
    .then((data) => {
        res.end(JSON.stringify(data));
    }).catch((err) => {
        console.log(err);
        res.end("[]");
    })
});
router.post('/postProduct', (req, res) => {
    product.create({
        Name: req.body.Name,
        Description: req.body.Description,
        Quantity: req.body.Quantity,
        Price: req.body.Price,
    })
    .then(() => {
        res.end("[]");
    })
    .catch((err) => {
        console.log(err);
        res.end("[]");
    });
});
router.post('/updateProduct', (req, res) => {
    product.updateOne({
        _id: req.body._id
    },
        {
            Name: req.body.Name,
            Description: req.body.Description,
            Quantity: req.body.Quantity,
            Price: req.body.Price,
        }).then(() => {
            res.end("[]");
        })
        .catch((err) => {
            console.log(err);
            res.end("[]");
        });
});
router.post('/deleteProduct', (req, res) => {
    product.deleteOne({
        _id: req.body._id
    }).then(() => {
        res.end("[]");
    })
    .catch((err) => {
        console.log(err);
        res.end("[]");
    });
});

/////////////////// requests - for cart /////////////////
router.post('/getCart', (req, res) => {
    cart.find({
        Email: req.body.Email
    })
        .then((data) => {
            if (data.length) {
                res.end(JSON.stringify(data[0]));
            }
            else
                res.end(JSON.stringify({
                    bool: "false"
                }));
        })
        .catch((err) => {
            console.log(err);
            res.end(JSON.stringify({
                bool: "false"
            }));
        });
});
router.post('/postCartForNew', (req, res) => {
    console.log(req.body);
    cart.create({
        Email: req.body.Email,
        Product: {
            Name: req.body.Product.Name,
            Description: req.body.Product.Description,
            Quantity: req.body.Product.Quantity,
            Price: req.body.Product.Price,
            ProductId: req.body.Product.ProductId
        }
    })
        .then(() => {
            res.end("File Saved");
        })
        .catch((err) => {
            console.log(err);
            res.end("Error");
        });
});
router.post('/postCart', (req, res) => {
    console.log(req.body);
    cart.updateOne({
        Email: req.body.Email
    }, {
        $push: {
            Product: {
                Name: req.body.Product.Name,
                Description: req.body.Product.Description,
                Quantity: req.body.Product.Quantity,
                Price: req.body.Product.Price,
                ProductId: req.body.Product.ProductId
            }
        }
    }).then(() => {
        console.log('done');
        res.send();
    }).catch((err) => {
        console.log(err);
        res.end();
    });
});
////////////////////////
router.get('/getOriginalCart', (req, res) => {
    res.sendFile("originalCart.json", { root: "./database/" });
});
router.post('/postOriginalCart', (req, res) => {
    res.writeFileSync("./database/originalCart.json", JSON.stringify(req.body));
    res.send("File Saved");
});




////////////////////////
module.exports = router;