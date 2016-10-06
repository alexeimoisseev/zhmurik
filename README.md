# Zhmurik
## Node.js http/https request logger.

### Overview
Every time you use http.request, `zhmurik` intercepts it, takes some
measurements, collects errors, then calls callback with measurement
results that can be then passed to any logger you prefer.

### Usage
```javascript
var http = require('http');
var zhmurik = require('zhmurik');
zhmurik(http, function (result) {
    // put your logger here
    console.log(result);
    /*
    {
      timers: {
        start: datetime,
        socket: datetime,
        ttfb: datetime,
        response: datetime,
        end: datetime
      },
      code: 200,
      options: {...options that you passed to http.request()...}
    }
    */
});

var request = http.request({
    host: 'ya.ru',
    xRequestId: Math.abs(Math.round(Math.random() * 100000))
}, function (res) {
    // process result
});
request.end();
```


