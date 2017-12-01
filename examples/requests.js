const http = require('http');
const https = require('https');
const zhmurik = require('../index');

zhmurik(http, {
    onRequestEnd: (result) => {
        console.log('http wrapper', result);
    }
});
zhmurik(https, {
    onRequestEnd: (result) => {
        console.log('https wrapper', result);
    }
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
