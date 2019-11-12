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
            res.send(data);
        }).catch((err) => {
            console.log(err);
            res.end();
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
            res.send({bool:true});
        })
        .catch((err) => {
            console.log(err);
            res.end({bool:false});
        });
    res.end();
});
router.post('/deleteProduct', (req, res) => {
    product.deleteOne({
        _id: req.body._id
    }).then(() => {
        res.end();
    })
        .catch((err) => {
            console.log(err);
            res.end();
        });
});
router.get('/deleteProductByQuantity', (req, res) => {
    product.find({
        _id: req.body._id
    })
        .then((data) => {
            let Quantity = data[0].Quantity + req.body.Quantity
            product.updateOne({
                _id: req.body._id
            }, {
                Quantity: Quantity
            }).then((data) => {
                console.log(data);
                res.send({ bool: true });
            })
        }).catch((err) => {
            console.log(err);
            res.end("[]");
        })
})
/////////////////// requests - for cart /////////////////
router.post('/getCart', (req, res) => {
    cart.find({
        Email: req.body.Email
    })
        .then((data) => {
            res.send(data[0]);
        })
        .catch((err) => {
            console.log(err);
            res.end();
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
    console.log("hey");
    cart.updateMany({
        Email: req.body.Email
    }, {
        Product: req.body.Product
    }).then(() => {
        console.log('done');
        res.send({ bool: true });
    }).catch((err) => {
        console.log(err);
        res.end();
    });
});

router.get('/updateCart', (req, res) => {

    // "Email":"sarun6153@gmail.com",
    // "Quantity":"2",
    // "ProductId":"5d90eae1b84d903f806b5c6c"

    cart.find({
        Email: req.body.Email
    }).then((d) => {
        let data = d[0];
        let id = req.body.ProductId;
        let index;

        for (let i = 0; i < data.Product.length; i++) {
            if (data.Product[i].ProductId == id) {
                console.log("we found it at index :" + i)
                index = i;
            }
        }
        console.log(data.Product[index].Quantity);
        let Quantity = data.Product[index].Quantity - req.body.Quantity;
        console.log(Quantity);
        cart.update({
            Email: req.body.Email,
            Product: { $elemMatch: { Quantity: { $eq: data.Product[index].Quantity }, ProductId: { $eq: req.body.ProductId } } }
        }, {
            $set: {
                "Product.$.Quantity": Quantity
            }
        }).then(() => {
            res.send({ bool: true })
        }).catch((Err) => {
            console.log(Err);
            res.send({ bool: false })
        }).catch(err => {
            console.log(err);
            res.end();
        })
    });
});
router.post('/deleteCart', (req, res) => {
    cart.update({
        Email: req.body.Email
    }, {
        Product: []
    }).then(() => {
        res.send({ bool: true });
    })
        .catch(() => {
            res.end();
        })
})

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