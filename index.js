'use strict';
function decorator(requestModule, trigger) {
    var oldRequest = requestModule.request;
    function end(options, timers, err, res) {
        timers.total = Math.round(timers.end.getTime() - timers.socket.getTime());
        trigger({
            timers: timers,
            code: err ? getCode(err.code) : res.statusCode,
            options: options
        });
    }
    function request(options, callback) {
        var timers = {
            start: new Date()
        };
        var req = oldRequest(options, function (res) {
            timers.ttfb = new Date();
            res.on('data', function () {
                // this needs to set end handler
            });
            res.on('end', function () {
                timers.end = new Date();
                end(options, timers, null, res);
            });
            return callback(res);
        });
        req.on('socket', function () {
            timers.socket = new Date();
        });
        req.on('response', function () {
            timers.response = new Date();
        });
        req.on('error', function (err) {
            timers.end = new Date();
            end(options, timers, err);
        });
        return req;
    }
    requestModule.request = request;
}

function getCode(error) {
    return 504;
}

module.exports = decorator;
