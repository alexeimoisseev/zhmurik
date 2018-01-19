# Zhmurik
## Node.js http/https request logger.

### Overview
Every time you use http.request, `zhmurik` intercepts it, takes some
measurements, collects errors, then calls callback with measurement
results that can be then passed to any logger you prefer.

### Usage
```javascript
const http = require('http');
const zhmurik = require('zhmurik');
zhmurik(http, {
    onRequestEnd(result) {
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
    }
});

const request = http.request({
    host: 'ya.ru',
    xRequestId: Math.abs(Math.round(Math.random() * 100000))
}, function (res) {
    // process result
});
request.end();
```


