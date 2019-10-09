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
    res.end();
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
                res.end(JSON.stringify(data));
            }
            else
            res.end("[]");
        })
        .catch((err) => {
            console.log(err);
            res.end("[]");
        });
});
router.post('/postCartForNew', (req, res) => {
    cart.create({
        Email: req.body.Email,
        Product: req.body.Product
    })
    .then(() => {
        res.end("[]");
    })
    .catch((err) => {
        console.log(err);
        res.end("[]");
    });
});

router.post('/postCart', (req, res) => {
    for (var i = 0; i < req.body.length; i++) {
        console.log(req.body[i].Product)
        cart.updateOne({
            Email: req.body[i].Email
        }, {
            Product: req.body[0].Product
        }).then(() => {
            console.log('done');
        }).catch((err) => {
            console.log(err);
            res.end();
        });
    }
    res.end();
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