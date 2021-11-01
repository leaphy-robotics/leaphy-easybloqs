import { Board, boards } from './boards';
import { EventEmitter } from "events";
import * as inherits from 'inherits-ex/lib/inherits';

type AvrgirlArduinoOpts = {
    debug: boolean | ConsoleLog,
    megaDebug: boolean,
    board: string | Board,
    port: string,
    manualReset: boolean,
    disableVerify: boolean
}

type ConsoleLog = { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; };

export class AvrgirlArduino {
    debug: string | ConsoleLog
    connection: Connection;
    protocol: Stk500v1;

    options: AvrgirlArduinoOpts;

    constructor(opts: AvrgirlArduinoOpts) {
        this.options = {
            debug: opts.debug || false,
            megaDebug: opts.megaDebug || false,
            board: opts.board || 'uno',
            port: opts.port || '',
            manualReset: opts.manualReset || false,
            disableVerify: opts.disableVerify || false
        };

        // this here checks for 3 conditions:
        // if debug option is simply true, we want to fall back to default debug function
        // if a custom debug function is passed in, we want to assign debug to be that
        // if debug option is false, then run debug as a no-op
        if (this.options.debug === true) {
            this.debug = this.options.debug = console.log.bind(console);
        } else if (typeof this.options.debug === 'function') {
            this.debug = this.options.debug = this.options.debug;
        } else {
            this.debug = this.options.debug = function debugNoop() { };
        }

        // handle 'sparse' boards, ie. boards with only the 'name' property defined
        if (typeof this.options.board === 'object') {
            const properties = Object.getOwnPropertyNames(this.options.board);
            if ((properties.length === 1) && (properties[0] === 'name')) {
                this.options.board = this.options.board.name;
            }
        }

        if (typeof this.options.board === 'string') {
            this.options.board = boards[this.options.board];
        }

        if (this.options.board && !this.options.board.manualReset) {
            this.options.board.manualReset = this.options.manualReset;
        }

        if (this.options.board && !this.options.board.disableVerify) {
            this.options.board.disableVerify = this.options.disableVerify;
        }

        this.connection = new Connection(this.options);
        if (!this.options.board) {
            console.log('No board specified')
            throw new Error('No board specified');
        }

        this.protocol = new Stk500v1({
            board: this.options.board,
            connection: this.connection,
            debug: this.debug,
            megaDebug: this.options.megaDebug
        });

        EventEmitter.call(this as unknown);
    }

    /**
   * Public method for flashing a hex file to the main program allocation of the Arduino
   *
   * @param {string} file - path to hex file for uploading
   * @param {function} callback - function to run upon completion/error
   */
    flash = (file: ArrayBuffer, callback: ErrorCallback) => {
        // validate board properties first
        this._validateBoard((error) => {
            if (error) { return callback(error); }

            // set up serialport connection
            this.connection._init((error) => {
                if (error) { return callback(error); }

                // upload file to board
                this.protocol._upload(file, callback);
            });
        });
    };

    _validateBoard = (callback: ErrorCallback) => {
        if (typeof this.options.board !== 'object') {
            // cannot find a matching board in supported list
            return callback(new Error('"' + this.options.board + '" is not a supported board type.'));

        } else if (!this.protocol.chip) {
            // something went wrong trying to set up the protocol
            var errorMsg = 'not a supported programming protocol: ' + this.options.board.protocol;
            return callback(new Error(errorMsg));

        } else if (!this.options.port && this.options.board.name === 'pro-mini') {
            // when using a pro mini, a port is required in the options
            return callback(new Error('using a pro-mini, please specify the port in your options.'));

        } else {
            // all good
            return callback(null);
        }
    };
}

inherits(AvrgirlArduino, EventEmitter);

export class Connection {
    _setDTR(arg0: boolean, arg1: number, arg2: (error: Error) => void) {
        throw new Error('Method not implemented.');
    }
    options: any;
    debug: ConsoleLog
    board: Board;

    constructor(options: AvrgirlArduinoOpts) {
        this.options = options;
        this.debug = this.options.debug ? console.log.bind(console) : function () { };
        this.board = this.options.board as Board;
        // TODO: support avr109 boards
        if (this.board.protocol === 'avr109') {
            throw new Error(
                `Sorry, we currently don't support ${this.board.name} or other avr109 boards in webserial. Please see https://github.com/noopkat/avrgirl-arduino/issues/204#issuecomment-703284131 for further details`
            );
        }
    }
    serialPort: Serialport | undefined;

    _init = (callback: ErrorCallback) => {
        this._setUpSerial(function (error) {
            return callback(error);
        });
    };

    _setUpSerial = (callback: ErrorCallback) => {
        this.serialPort = new Serialport('', {
            baudRate: this.board.baud,
            autoOpen: false
        });
        this.serialPort.on('open', function () {
            //    this.emit('connection:open');
        })
        return callback(null);
    };
}

type SerialPortOptions = {
    baudRate: number,
    autoOpen: false,
    path?: any
}

export class Serialport extends EventEmitter {
    options: SerialPortOptions;
    browser: boolean;
    path: any;
    isOpen: boolean;
    port: SerialPort | null;
    writer: WritableStreamDefaultWriter<Uint8Array> | null;
    reader: ReadableStreamDefaultReader<Uint8Array> | null;
    baudRate: number;
    requestOptions: any;

    constructor(port: string, options: SerialPortOptions) {
        //super(options);
        super();
        this.options = options || {};

        this.browser = true;
        this.path = this.options.path;
        this.isOpen = false;
        this.port = null;
        this.writer = null;
        this.reader = null;
        this.baudRate = this.options.baudRate;
        //this.requestOptions = this.options.requestOptions || {};
        this.requestOptions = {};

        if (this.options.autoOpen) this.open();
    }
    list(callback: (error: Error | null, list?: SerialPort[]) => void) {
        return navigator.serial.getPorts()
            .then((list) => { if (callback) { return callback(null, list) } })
            .catch((error) => { if (callback) { return callback(error) } });
    }

    open(callback?: ErrorCallback) {
        window.navigator.serial.requestPort(this.requestOptions)
            .then(serialPort => {
                this.port = serialPort;
                if (this.isOpen) return;
                return this.port.open({ baudRate: this.baudRate || 57600 });
            })
            .then(() => this.writer = this.port!.writable!.getWriter())
            .then(() => this.reader = this.port!.readable!.getReader())
            .then(async () => {
                this.emit('open');
                this.isOpen = true;
                if (callback) callback(null);
                while (this.port!.readable!.locked) {
                    try {
                        const { value, done } = await this.reader!.read();
                        if (done) {
                            break;
                        }
                        this.emit('data', Buffer.from(value as Uint8Array));
                    } catch (e) {
                        console.error(e);
                    }
                }
            })
            .catch(error => { if (callback) callback(error) });
    }

    async close(callback: ErrorCallback) {
        try {
            this.reader!.releaseLock();
            this.writer!.releaseLock();
            await this.port!.close();
            this.isOpen = false;
        } catch (error) {
            if (callback) return callback(error as Error);
            throw error;
        }
        callback && callback(null);
    }

    async set(props: any = {}, callback?: ErrorCallback) {
        try {
            const signals: any = {};
            if (Object.prototype.hasOwnProperty.call(props, 'dtr')) {
                signals.dataTerminalReady = props.dtr;
            }
            if (Object.prototype.hasOwnProperty.call(props, 'rts')) {
                signals.requestToSend = props.rts;
            }
            if (Object.prototype.hasOwnProperty.call(props, 'brk')) {
                signals.break = props.brk;
            }
            if (Object.keys(signals).length > 0) {
                await this.port!.setSignals(signals);
            }
        } catch (error) {
            if (callback) return callback(error as Error);
            throw error;
        }
        if (callback) return callback(null);
    }

    write(buffer: Uint8Array, callback?: ErrorCallback) {
        this.writer!.write(buffer);
        if (callback) return callback(null);
    }

    async read(callback: (error: Error | null, data?: ReadableStreamDefaultReadResult<Uint8Array>) => void) {
        let buffer: ReadableStreamDefaultReadResult<Uint8Array>;
        try {
            buffer = await this.reader!.read();
        } catch (error) {
            if (callback) return callback(error as Error);
            throw error;
        }
        if (callback) callback(null, buffer);
    }

    // TODO: is this correct?
    flush(callback: ErrorCallback) {
        //this.port.flush(); // is this sync or a promise?
        console.warn('flush method is a NOP right now');
        if (callback) return callback(null);
    }

    // TODO: is this correct?
    drain(callback: ErrorCallback) {
        // this.port.drain(); // is this sync or a promise?
        console.warn('drain method is a NOP right now');
        if (callback) return callback(null);
    }
}

type ProtocolOptions = {
    debug: ConsoleLog,
    megaDebug: boolean,
    connection: Connection,
    board: string | Board
}

class Protocol {
    debug: ConsoleLog;
    megaDebug: boolean;
    board: string | Board;
    connection: Connection;
    chip: Stk500Chip;

    constructor(options: ProtocolOptions) {
        this.debug = options.debug;
        this.megaDebug = options.megaDebug;

        this.board = options.board;
        this.connection = options.connection;
        // eslint-disable-next-line new-cap
        this.chip = new Stk500Chip({ quiet: !this.megaDebug });
    }

    _reset = (callback: ErrorCallback) => {
        // set DTR from high to low
        this.connection._setDTR(false, 250, (error: Error) => {
            if (!error) {
                this.debug('reset complete.');
            }

            return callback(error);
        });
    };
}

import { Tools } from './tools';

class Stk500v1 extends Protocol {
    serialPort: Serialport | undefined;
    tools: Tools;

    constructor(opts: ProtocolOptions) {
        super(opts);
        this.tools = new Tools();
    }

    _upload = (file: ArrayBuffer, callback: ErrorCallback) => {
        this.serialPort = this.connection.serialPort;

        // open/parse supplied hex file
        var hex = this.tools._parseHex(file);
        if (!Buffer.isBuffer(hex)) {
            return callback(hex as Error);
        }

        // open connection
        this.serialPort!.open((error) => {
            if (error) { return callback(error); }

            this.debug('connected');

            // reset
            this._reset((error) => {
                if (error) { return callback(error); }

                this.debug('flashing, please wait...');

                // flash
                this.chip.bootload(this.serialPort, hex, this.board, (error: Error) => {

                    this.debug('flash complete.');

                    // Always close the serialport
                    this.serialPort!.close(() => null);

                    return callback(error);
                });
            });
        });
    };

    _reset = (callback: ErrorCallback) => {

        this.connection._setDTR(false, 250, (error) => {
            if (error) { return callback(error); }

            this.connection._setDTR(true, 50, (error) => {
                this.debug('reset complete.');
                return callback(error);
            });
        });
    };
}

type ChipOptions = {
    quiet: boolean
}

import { Statics } from './statics';
import { Async } from './async';

class Stk500Chip {
    opts: ChipOptions;
    quiet: boolean;
    log: ConsoleLog;
    async: Async;
    constructor(opts: ChipOptions) {
        this.opts = opts || {};
        this.quiet = this.opts.quiet || false;
        if (this.quiet) {
            this.log = function () { };
        } else {
            if (typeof window === 'object') {
                this.log = console.log.bind(window);
            } else {
                this.log = console.log;
            }
        }
        this.async = new Async();
    }

    sendCommand = (stream: Serialport, opt: any, callback: PayloadCallback) => {
        var timeout = opt.timeout || 0;
        var startingBytes = [
            Statics.Resp_STK_INSYNC,
            Statics.Resp_STK_NOSYNC
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
            cmd = Buffer.from(cmd.concat(Statics.Sync_CRC_EOP));
        }

        stream.write(cmd, (err) => {
            if (err) {
                error = new Error('Sending ' + cmd.toString('hex') + ': ' + err.message);
                return callback(error, null);
            }
            this.receiveData(stream, timeout, responseLength, (err: Error | null, data: Buffer | null) => {
                if (err) {
                    error = new Error('Sending ' + cmd.toString('hex') + ': ' + err.message);
                    return callback(error, null);
                }

                if (responseData && !data!.equals(responseData)) {
                    error = new Error(cmd + ' response mismatch: ' + data!.toString('hex') + ', ' + responseData.toString('hex'));
                    return callback(error, null);
                }
                callback(null, data);
            });
        });
    }

    startingBytes = [
        Statics.Resp_STK_INSYNC
    ];

    receiveData = (stream: Serialport, timeout: number, responseLength: number, callback: PayloadCallback) => {
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

    sync = (stream: Serialport, attempts: number, timeout: number, done: PayloadCallback) => {
        this.log("sync");
        var self = this;
        var tries = 1;

        var opt = {
            cmd: [
                Statics.Cmnd_STK_GET_SYNC
            ],
            responseData: Statics.OK_RESPONSE,
            timeout: timeout
        };
        let attempt = () => {
            tries = tries + 1;
            this.sendCommand(stream, opt, (err, data) => {
                if (err && tries <= attempts) {
                    if (err) {
                        self.log(err);
                    }
                    self.log("failed attempt again", tries);
                    return attempt();
                }
                self.log('sync complete', err, data, tries);
                done(err, data);
            });
        }
        attempt();
    };

    verifySignature = (stream: Serialport, signature: Buffer, timeout: number, done: PayloadCallback) => {
        this.log("verify signature");
        var self = this;
        var match = Buffer.concat([
            Buffer.from([Statics.Resp_STK_INSYNC]),
            signature,
            Buffer.from([Statics.Resp_STK_OK])
        ]);

        var opt = {
            cmd: [
                Statics.Cmnd_STK_READ_SIGN
            ],
            responseLength: match.length,
            timeout: timeout
        };
        this.sendCommand(stream, opt, function (err, data) {
            if (data) {
                self.log('confirm signature', err, data, data.toString('hex'));
            } else {
                self.log('confirm signature', err, 'no data');
            }
            done(err, data);
        });
    };

    getSignature = (stream: Serialport, timeout: number, done: PayloadCallback) => {
        this.log("get signature");
        var opt = {
            cmd: [
                Statics.Cmnd_STK_READ_SIGN
            ],
            responseLength: 5,
            timeout: timeout
        };
        this.sendCommand(stream, opt, (err, data) => {
            this.log('getSignature', err, data);
            done(err, data);
        });
    };

    setOptions = (stream: Serialport, options: any, timeout: number, done: ErrorCallback) => {
        this.log("set device");
        var self = this;

        var opt = {
            cmd: [
                Statics.Cmnd_STK_SET_DEVICE,
                options.devicecode || 0,
                options.revision || 0,
                options.progtype || 0,
                options.parmode || 0,
                options.polling || 0,
                options.selftimed || 0,
                options.lockbytes || 0,
                options.fusebytes || 0,
                options.flashpollval1 || 0,
                options.flashpollval2 || 0,
                options.eeprompollval1 || 0,
                options.eeprompollval2 || 0,
                options.pagesizehigh || 0,
                options.pagesizelow || 0,
                options.eepromsizehigh || 0,
                options.eepromsizelow || 0,
                options.flashsize4 || 0,
                options.flashsize3 || 0,
                options.flashsize2 || 0,
                options.flashsize1 || 0
            ],
            responseData: Statics.OK_RESPONSE,
            timeout: timeout
        };
        this.sendCommand(stream, opt, function (err, data) {
            self.log('setOptions', err, data);
            if (err) {
                return done(err);
            }
            done(null);
        });
    };

    enterProgrammingMode = (stream: Serialport, timeout: number, done: PayloadCallback) => {
        this.log("send enter programming mode");
        var self = this;
        var opt = {
            cmd: [
                Statics.Cmnd_STK_ENTER_PROGMODE
            ],
            responseData: Statics.OK_RESPONSE,
            timeout: timeout
        };
        this.sendCommand(stream, opt, function (err, data) {
            self.log("sent enter programming mode", err, data);
            done(err, data);
        });
    };

    loadAddress = (stream: Serialport, useaddr: number, timeout: number, done: PayloadCallback) => {
        this.log("load address");
        var self = this;
        var addr_low = useaddr & 0xff;
        var addr_high = (useaddr >> 8) & 0xff;
        var opt = {
            cmd: [
                Statics.Cmnd_STK_LOAD_ADDRESS,
                addr_low,
                addr_high
            ],
            responseData: Statics.OK_RESPONSE,
            timeout: timeout
        };
        this.sendCommand(stream, opt, function (err, data) {
            self.log('loaded address', err, data);
            done(err, data);
        });
    };

    loadPage = (stream: Serialport, writeBytes: Buffer, timeout: number, done: PayloadCallback) => {
        this.log("load page");
        var self = this;
        var bytes_low = writeBytes.length & 0xff;
        var bytes_high = writeBytes.length >> 8;

        var cmd = Buffer.concat([
            Buffer.from([Statics.Cmnd_STK_PROG_PAGE, bytes_high, bytes_low, 0x46]),
            writeBytes,
            Buffer.from([Statics.Sync_CRC_EOP])
        ]);

        var opt = {
            cmd: cmd,
            responseData: Statics.OK_RESPONSE,
            timeout: timeout
        };
        this.sendCommand(stream, opt, function (err, data) {
            self.log('loaded page', err, data);
            done(err, data);
        });
    };

    upload = (stream: Serialport, hex: Buffer, pageSize: number, timeout: number, done: ErrorCallback) => {
        this.log("program");

        var pageaddr = 0;
        var writeBytes: any;
        var useaddr: any;

        var self = this;

        // program individual pages
        this.async.whilst(
            function () { return pageaddr < hex.length; },
            function (pagedone) {
                self.log("program page");
                async.series([
                    function (cbdone) {
                        useaddr = pageaddr >> 1;
                        cbdone();
                    },
                    function (cbdone) {
                        self.loadAddress(stream, useaddr, timeout, cbdone);
                    },
                    function (cbdone) {

                        writeBytes = hex.slice(pageaddr, (hex.length > pageSize ? (pageaddr + pageSize) : hex.length - 1))
                        cbdone();
                    },
                    function (cbdone) {
                        self.loadPage(stream, writeBytes, timeout, cbdone);
                    },
                    function (cbdone) {
                        self.log("programmed page");
                        pageaddr = pageaddr + writeBytes.length;
                        setTimeout(cbdone, 4);
                    }
                ],
                    function (error) {
                        self.log("page done");
                        pagedone(error);
                    });
            },
            function (error) {
                self.log("upload done");
                done(error);
            }
        );
    };

    exitProgrammingMode = (stream, timeout, done) => {
        this.log("send leave programming mode");
        var self = this;
        var opt = {
            cmd: [
                Statics.Cmnd_STK_LEAVE_PROGMODE
            ],
            responseData: Statics.OK_RESPONSE,
            timeout: timeout
        };
        sendCommand(stream, opt, function (err, data) {
            self.log('sent leave programming mode', err, data);
            done(err, data);
        });
    };

    verify = (stream, hex, pageSize, timeout, done) => {
        this.log("verify");

        var pageaddr = 0;
        var writeBytes;
        var useaddr;

        var self = this;

        // verify individual pages
        async.whilst(
            function () { return pageaddr < hex.length; },
            function (pagedone) {
                self.log("verify page");
                async.series([
                    function (cbdone) {
                        useaddr = pageaddr >> 1;
                        cbdone();
                    },
                    function (cbdone) {
                        self.loadAddress(stream, useaddr, timeout, cbdone);
                    },
                    function (cbdone) {

                        writeBytes = hex.slice(pageaddr, (hex.length > pageSize ? (pageaddr + pageSize) : hex.length - 1))
                        cbdone();
                    },
                    function (cbdone) {
                        self.verifyPage(stream, writeBytes, pageSize, timeout, cbdone);
                    },
                    function (cbdone) {
                        self.log("verified page");
                        pageaddr = pageaddr + writeBytes.length;
                        setTimeout(cbdone, 4);
                    }
                ],
                    function (error) {
                        self.log("verify done");
                        pagedone(error);
                    });
            },
            function (error) {
                self.log("verify done");
                done(error);
            }
        );
    };

    verifyPage = (stream, writeBytes, pageSize, timeout, done) => {
        this.log("verify page");
        var self = this;
        match = Buffer.concat([
            Buffer.from([Statics.Resp_STK_INSYNC]),
            writeBytes,
            Buffer.from([Statics.Resp_STK_OK])
        ]);

        var size = writeBytes.length >= pageSize ? pageSize : writeBytes.length;

        var opt = {
            cmd: [
                Statics.Cmnd_STK_READ_PAGE,
                (size >> 8) & 0xff,
                size & 0xff,
                0x46
            ],
            responseLength: match.length,
            timeout: timeout
        };
        sendCommand(stream, opt, function (err, data) {
            self.log('confirm page', err, data, data.toString('hex'));
            done(err, data);
        });
    };

    bootload = (stream, hex, opt, done) => {

        var parameters = {
            pagesizehigh: (opt.pagesizehigh << 8 & 0xff),
            pagesizelow: opt.pagesizelow & 0xff
        }

        async.series([
            // send two dummy syncs like avrdude does
            this.sync.bind(this, stream, 3, opt.timeout),
            this.sync.bind(this, stream, 3, opt.timeout),
            this.sync.bind(this, stream, 3, opt.timeout),
            this.verifySignature.bind(this, stream, opt.signature, opt.timeout),
            this.setOptions.bind(this, stream, parameters, opt.timeout),
            this.enterProgrammingMode.bind(this, stream, opt.timeout),
            this.upload.bind(this, stream, hex, opt.pageSize, opt.timeout),
            this.verify.bind(this, stream, hex, opt.pageSize, opt.timeout),
            this.exitProgrammingMode.bind(this, stream, opt.timeout)
        ], function (error) {
            return done(error);
        });
    };
}




type ErrorCallback = (err: Error | null) => void
type PayloadCallback = (err: Error | null, data: Buffer | null) => void


