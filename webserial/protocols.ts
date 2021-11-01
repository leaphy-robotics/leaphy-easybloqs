import { Series } from "async-es";
import { WebSerial } from "./webserial";

export class Stk500v1 {
    bootload = (stream: WebSerial, hex: Buffer, opt: any, done: (err: any) => void) => {

        var parameters = {
            pagesizehigh: (opt.pagesizehigh << 8 & 0xff),
            pagesizelow: opt.pagesizelow & 0xff
        }

        Series([
            // send two dummy syncs like avrdude does
            this.sync.bind(this, stream, 3, opt.timeout),
            this.sync.bind(this, stream, 3, opt.timeout),
            this.sync.bind(this, stream, 3, opt.timeout),
            this.verifySignature.bind(this, stream, opt.signature, opt.timeout),
            //this.setOptions.bind(this, stream, parameters, opt.timeout),
            //this.enterProgrammingMode.bind(this, stream, opt.timeout),
            //this.upload.bind(this, stream, hex, opt.pageSize, opt.timeout),
            //this.verify.bind(this, stream, hex, opt.pageSize, opt.timeout),
            //this.exitProgrammingMode.bind(this, stream, opt.timeout)
        ], function (error: any) {
            return done(error);
        });
    };

    sync = (webSerial: WebSerial, attempts: number, timeout: number, done: (err: any, data: Uint8Array | null) => void) => {
        console.log("sync");
        var tries = 1;

        var opt = {
            cmd: [
                this.Cmnd_STK_GET_SYNC
            ],
            responseData: this.OK_RESPONSE,
            timeout: timeout
        };
        const attempt = async () => {
            tries = tries + 1;
            await this.sendCommand(webSerial, opt, function (err, data) {
                if (err && tries <= attempts) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("failed attempt again", tries);
                    return attempt();
                }
                console.log('sync complete', err, data, tries);
                done(err, data);
            });
        }
        attempt();
    };

    verifySignature = (stream: WebSerial, signature: Buffer, timeout: number, done: (err: any, data: Uint8Array | null) => void) => {
        console.log("verify signature");
        const match = Buffer.concat([
            Buffer.from([this.Resp_STK_INSYNC]),
            signature,
            Buffer.from([this.Resp_STK_OK])
        ]);

        var opt = {
            cmd: [
                this.Cmnd_STK_READ_SIGN
            ],
            responseLength: match.length,
            timeout: timeout
        };
        this.sendCommand(stream, opt, (err: any, data: Buffer | null) => {
            if (data) {
                console.log('confirm signature', err, data, data.toString('hex'));
            } else {
                console.log('confirm signature', err, 'no data');
            }
            done(err, data);
        });
    };

    sendCommand = (stream: WebSerial, opt: any, callback: (err: Error | null, data: Buffer | null) => void) => {
        var timeout = opt.timeout || 0;
        var startingBytes = [
            this.Resp_STK_INSYNC,
            this.Resp_STK_NOSYNC
        ];
        var responseData: Buffer | null = null;
        var responseLength = 0;
        var error;

        if (opt.responseData && opt.responseData.length > 0) {
            responseData = opt.responseData;
        }
        if (responseData) {
            responseLength = responseData.length;
        }
        if (opt.responseLength) {
            responseLength = opt.responseLength;
        }
        var cmd = opt.cmd;
        if (cmd instanceof Array) {
            cmd = Buffer.from(cmd.concat(this.Sync_CRC_EOP));
        }

        stream.write(cmd, (err) => {
            if (err) {
                error = new Error('Sending ' + cmd.toString('hex') + ': ' + err.message);
                return callback(error, null);
            }
            this.receiveData(stream, timeout, responseLength, function (err, data) {
                if (err) {
                    error = new Error('Sending ' + cmd.toString('hex') + ': ' + err.message);
                    return callback(error, null);
                }

                if (responseData && !data.equals(responseData)) {
                    error = new Error(cmd + ' response mismatch: ' + data.toString('hex') + ', ' + responseData.toString('hex'));
                    return callback(error, null);
                }
                callback(null, data);
            });
        });
    };

    receiveData = (stream: WebSerial, timeout: number, responseLength: number, callback: (err: Error | null, data: Buffer) => void) => {
        var buffer = Buffer.alloc(0);
        var started = false;
        var timeoutId: any = null;
        var handleChunk = (data: Uint8Array) => {
            var index = 0;
            while (!started && index < data.length) {
                var byte = data[index];
                if (this.startingBytes.indexOf(byte) !== -1) {
                    data = data.slice(index, data.length - index);
                    started = true;
                }
                index++;
            }
            if (started) {
                buffer = Buffer.concat([buffer, data]);
            }
            if (buffer.length > responseLength) {
                // or ignore after
                return finished(new Error('buffer overflow ' + buffer.length + ' > ' + responseLength));
            }
            if (buffer.length == responseLength) {
                finished(null);
            }
        };
        var finished = function (err: Error | null) {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            // VALIDATE TERMINAL BYTE?
            stream.removeListener('data', handleChunk);
            callback(err, buffer);
        };
        if (timeout && timeout > 0) {
            timeoutId = setTimeout(function () {
                timeoutId = null;
                finished(new Error('receiveData timeout after ' + timeout + 'ms'));
            }, timeout);
        }
        stream.on('data', handleChunk);
    };

    Cmnd_STK_GET_SYNC: number = 0x30;
    Cmnd_STK_SET_DEVICE: number = 0x42;
    Cmnd_STK_ENTER_PROGMODE: number = 0x50;
    Cmnd_STK_LOAD_ADDRESS: number = 0x55;
    Cmnd_STK_PROG_PAGE: number = 0x64;
    Cmnd_STK_LEAVE_PROGMODE: number = 0x51;
    Cmnd_STK_READ_SIGN: number = 0x75;

    Sync_CRC_EOP: number = 0x20;

    Resp_STK_OK: number = 0x10;
    Resp_STK_INSYNC: number = 0x14;
    Resp_STK_NOSYNC: number = 0x15;

    Cmnd_STK_READ_PAGE: number = 0x74;
    OK_RESPONSE: Buffer = Buffer.from([this.Resp_STK_INSYNC, this.Resp_STK_OK])

    startingBytes = [
        this.Resp_STK_INSYNC
    ];
}