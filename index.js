'use strict';

function decorator(requestModule, callbacks = {}) {
    const oldRequest = requestModule.request;
    function end(options, timers, err, req, res) {
        const onRequestEnd = callbacks.onRequestEnd;
        if (typeof onRequestEnd === 'function') {
            timers.total = Math.round(timers.end - timers.socket);
            onRequestEnd({
                timers: timers,
                code: err ? getCode(err.code) : res.statusCode,
                options: options,
                req: req,
                res: res
            });
        }
    }
    function request(options, callback) {
        const onRequestStart = callbacks.onRequestStart;
        if (typeof onRequestStart === 'function') {
            onRequestStart(options);
        }

        const timers = {
            start: Date.now()
        };
        const req = oldRequest(options, function (res) {
            timers.ttfb = Date.now();
            res.on('data', function () {
                // this needs to set end handler
            });
            res.on('end', function () {
                timers.end = Date.now();
                end(options, timers, null, req, res);
            });
            res.on('close', function () {
                timers.end = Date.now();
                end(options, timers, {code: 503}, req, res);
            });

            if (typeof callback === 'function') {
                return callback(res);
            }
            return res;
        });
        req.on('socket', function () {
            timers.socket = Date.now();
        });
        req.on('response', function () {
            timers.response = Date.now();
        });
        req.on('error', function (err) {
            timers.end = Date.now();
            end(options, timers, err, req, null);
        });
        return req;
    }
    requestModule.request = request;
}

function getCode(error) {
    return typeof error === 'number' ? error : 504;
}

module.exports = decorator;
