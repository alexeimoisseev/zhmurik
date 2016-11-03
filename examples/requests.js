const http = require('http');
const https = require('https');
const Zhmurik = require('../index');
const addListener = Zhmurik(http, function (result) {
    console.log(result);
});

addListener(function (result) {
    console.log('from listener', result);
});

var request = http.request({
    host: 'ya.ru',
    xRequestId: Math.abs(Math.round(Math.random() * 100000))
}, function (res) {
    //
});
request.end();


var request2 = https.request({
    host: 'auto.ru',
    path: '/cars/used/add/'
}, function (res) {
    console.log('https');
});
request2.end();
