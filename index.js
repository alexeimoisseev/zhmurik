'use strict';
function decorator(requestModule, _trigger) {

    var oldRequest = requestModule.request;
    var listeners = [];

    function trigger() {
        var args = arguments;
        listeners.forEach(function (listener) {
            setTimeout(function() {
                listener.apply(listener, args);
            }, 0);
        });
        return _trigger.apply(_trigger, args);
    }

    function end(options, timers, err, res) {
        timers.total = Math.round(timers.end - timers.socket);
        trigger({
            timers: timers,
            code: err ? getCode(err.code) : res.statusCode,
            options: options
        });
    }

    function request(options, callback) {
        var timers = {
            start: Date.now()
        };
        var req = oldRequest(options, function (res) {
            timers.ttfb = Date.now();
            res.on('data', function () {
                // this needs to set end handler
            });
            res.on('end', function () {
                timers.end = Date.now();
                end(options, timers, null, res);
            });
            res.on('close', function (err) {
                timers.end = Date.now();
                end(options, timers, {
                    code: 503
                });
            });
            return callback(res);
        });
        req.on('socket', function () {
            timers.socket = Date.now();
        });
        req.on('response', function () {
            timers.response = Date.now();
        });
        req.on('error', function (err) {
            timers.end = Date.now();
            end(options, timers, err);
        });
        return req;
    }

    requestModule.request = request;

    return function (listener) {
        listeners.push(listener);
    }
}

function getCode(error) {
    return typeof error === 'number' ? error : 504;
}

module.exports = decorator;
