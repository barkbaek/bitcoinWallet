var http = require('http');
var request = require('request');

http.createServer( (req, res) => {
    request({
       url: "https://api.blockchain.info/stats",
       json: true
    }, (error, response, body) => {
        if (error) {
            console.log("error : " + error);
        }
        console.log("market_price_usd: " + body.market_price_usd);

    });
    console.log("Hi I am a new bitcoin user.");
    res.end("bitcoin to the moon");
} ).listen(8080);