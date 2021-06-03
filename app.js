var express = require('express');
var app = express();
var request = require('request');
var bodyParser = require('body-parser');
var bitcore = require('bitcore-lib');

// request({
//     url: "https://api.blockchain.info/stats",
//     json: true
// }, (error, response, body) => {
//     btcPrice = body.market_price_usd;
//     btcBlock = body.blocks_size;
// });

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.set("view engine", "ejs");

function brainWallet(uinput, callback) {
    var input = new Buffer(uinput);
    var hash = bitcore.crypto.Hash.sha256(input);
    var bn = bitcore.crypto.BN.fromBuffer(hash);
    var pk = new bitcore.PrivateKey(bn).toWIF();
    var addy = new bitcore.PrivateKey(bn).toAddress();
    callback(pk, addy);
}

var price = 0;
request({
    url: "https://api.blockchain.info/stats",
    json:true
}, (error, response, body) => {
    console.log(body.market_price_usd);
    price = body.market_price_usd;
});

app.get("/", (req, res, next) => {
    // res.sendFile(__dirname + "/index.html");
    res.render("index", {lastPrice: price});
});

app.get("/brain", (req, res, next) => {
    // res.sendFile(__dirname + "/index.html");
    res.render("brain", {lastPrice: price});
});

app.get("/converter", (req, res, next) => {
    // res.sendFile(__dirname + "/index.html");
    res.render("converter", {lastPrice: price});
});

app.post("/wallet", (req, res, next) => {
    var brainsrc = req.body.brainsrc;
    console.log("Complete " + brainsrc);

    brainWallet(brainsrc, (privateKey, address) => {
        res.send("The brain wallet of " + brainsrc + "<br> address : " + address + "<br> privateKey: " + privateKey);
    });
});
// app.get("/block", (req, res, next) => {
//     //res.send("Current blocks : " + btcBlock);
//     res.sendFile("index.html");
// });

app.get("/walletInfo", (req, res, next) => {
    // res.sendFile(__dirname + "/index.html");
    res.render("walletInfo", {lastPrice: price, balance: 0, totalReceived: 0, totalSent: 0});
});

app.post("/walletInfo", (req, res, next) => {
    var account = req.body.account;
    request({
        url: "https://blockexplorer.com/api/addr/" + account,
        json:true
    }, (error, response, body) => {
        res.render("walletInfo", {lastPrice: price, balance: response.body.balance, totalReceived: response.body.totalReceived, totalSent: response.body.totalSent});
    });
});

app.listen(8080, () => {
    console.log("go");
});