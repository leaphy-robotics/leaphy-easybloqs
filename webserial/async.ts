export class Async {
    whilst = (test: any, iterator: any, callback: any) => {
        if (test()) {
            iterator((err: any) => {
                if (err) {
                    return callback(err);
                }
                this.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    series = (tasks: any, callback: any) => {
        callback = callback || function () {};
        if (Array.isArray(tasks)) {
            this.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    _asyncMap = (eachfn: any, arr: any, iterator: any, callback: any) => {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    doSeries = (fn: any) => {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };
    
    mapSeries = this.doSeries(this._asyncMap);

    
}