var bitcore = require('bitcore-lib');
var Insight = require('bitcore-explorers').Insight;

var value = new Buffer("This is a way to generate an address from a sentence19");
var hash = bitcore.crypto.Hash.sha256(value);
var bn = bitcore.crypto.BN.fromBuffer(hash);
var privateKey = new bitcore.PrivateKey(bn, "testnet");
var address = new bitcore.PrivateKey(bn, "testnet").toAddress();

console.log("Address : " + address);

var insight = new Insight('https://explorer.btc.zelcore.io/');

insight.getUnspentUtxos(address, function (err, utxos) {
    if(err) {
        console.log("err : ");
        console.dir(err);
    } else {
        console.log("utxos: " + utxos);
    }
});