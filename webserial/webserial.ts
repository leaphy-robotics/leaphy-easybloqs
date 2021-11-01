import { Stk500v1 } from "./protocols";
import { EventEmitter } from "events";

export class WebSerial extends EventEmitter {

    port: SerialPort | undefined;
    writer: WritableStreamDefaultWriter<Uint8Array> | undefined;
    reader: any;
    isOpen: boolean = false;
    protocol: Stk500v1 = new Stk500v1();

    flash = async (data: ArrayBuffer) => {
        // open/parse supplied hex file
        var hex = this._parseHex(data);

        if (!this.isOpen) {
            console.error("Serial Port connection was closed!")
            // Do something to prompt the user to reconnect
            // TODO
            return;
        }

        await this._reset();

        const options = {
            signature: Buffer.from([0x1e, 0x95, 0x0f]),
            timeout: 4000
        }

        this.protocol.bootload(this, hex, options, async (err) => {
            await this.port?.close();
        });
    }

    write = (buffer: Uint8Array, callback: (err: any) => void) => {
        this.writer!.write(buffer)
            .then((err) => callback(err));
    }

    _reset = async () => {
        // TODO Add timeouts?
        const signals1: SerialOutputSignals = {
            dataTerminalReady: false,
            requestToSend: false
        }
        await this.port?.setSignals(signals1)
        const signals2: SerialOutputSignals = {
            dataTerminalReady: true,
            requestToSend: false
        }
        await this.port?.setSignals(signals2)
    }

    getConnection = async (requestOptions: any): Promise<void> => {
        const navigator = window.navigator as any;
        if (!navigator.serial) {
            console.log("Web Serial is not supported");
            return;
        }

        navigator.serial.requestPort(requestOptions)
            .then((serialPort: SerialPort) => {
                this.port = serialPort;
                if (this.isOpen) return;
                return this.port.open({ baudRate: 57600 });
            })
            .then(() => this.writer = this.port!.writable!.getWriter())
            .then(() => this.reader = this.port!.readable!.getReader())
            .then(async () => {
                this.emit('open');
                this.isOpen = true;
                //callback(null);
                while (this.port!.readable!.locked) {
                    try {
                        const { value, done } = await this.reader.read();
                        if (done) {
                            break;
                        }
                        this.emit('data', Buffer.from(value));
                    } catch (e) {
                        console.error(e);
                    }
                }
            })
            .catch((error: any) => { console.log(error) });
    }

    _parseHex = (file: ArrayBuffer): Buffer => {
        try {
            const data = Buffer.from(file);
            return this._parseIntelHex(data).data;

        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    //Intel Hex record types
    private readonly DATA = 0;
    private readonly END_OF_FILE = 1;
    private readonly EXT_SEGMENT_ADDR = 2;
    private readonly START_SEGMENT_ADDR = 3;
    private readonly EXT_LINEAR_ADDR = 4;
    private readonly START_LINEAR_ADDR = 5;
    private readonly EMPTY_VALUE = 0xFF;

    // TODO Move to utils file
    _parseIntelHex = (data: Buffer): { data: Buffer, startSegmentAddress: number, startLinearAddress: number } => {
        const dataString = data.toString("ascii");
        //Initialization
        var buf = Buffer.alloc(8192),
            bufLength = 0, //Length of data in the buffer
            highAddress = 0, //upper address
            startSegmentAddress = null,
            startLinearAddress = null,
            lineNum = 0, //Line number in the Intel Hex string
            pos = 0; //Current position in the Intel Hex string
        const SMALLEST_LINE = 11;
        while (pos + SMALLEST_LINE <= dataString.length) {
            //Parse an entire line
            if (dataString.charAt(pos++) != ":")
                throw new Error("Line " + (lineNum + 1) +
                    " does not start with a colon (:).");
            else
                lineNum++;
            //Number of bytes (hex digit pairs) in the data field
            var dataLength = parseInt(dataString.substr(pos, 2), 16);
            pos += 2;
            //Get 16-bit address (big-endian)
            var lowAddress = parseInt(dataString.substr(pos, 4), 16);
            pos += 4;
            //Record type
            var recordType = parseInt(dataString.substr(pos, 2), 16);
            pos += 2;
            //Data field (hex-encoded string)
            var dataField = dataString.substr(pos, dataLength * 2),
                dataFieldBuf = Buffer.from(dataField, "hex");
            pos += dataLength * 2;
            //Checksum
            var checksum = parseInt(dataString.substr(pos, 2), 16);
            pos += 2;
            //Validate checksum
            var calcChecksum = (dataLength + (lowAddress >> 8) +
                lowAddress + recordType) & 0xFF;
            for (var i = 0; i < dataLength; i++)
                calcChecksum = (calcChecksum + dataFieldBuf[i]) & 0xFF;
            calcChecksum = (0x100 - calcChecksum) & 0xFF;
            if (checksum != calcChecksum)
                throw new Error("Invalid checksum on line " + lineNum +
                    ": got " + checksum + ", but expected " + calcChecksum);
            //Parse the record based on its recordType
            switch (recordType) {
                case this.DATA:
                    var absoluteAddress = highAddress + lowAddress;
                    //Expand buf, if necessary
                    if (absoluteAddress + dataLength >= buf.length) {
                        var tmp = Buffer.alloc((absoluteAddress + dataLength) * 2);
                        buf.copy(tmp, 0, 0, bufLength);
                        buf = tmp;
                    }
                    //Write over skipped bytes with EMPTY_VALUE
                    if (absoluteAddress > bufLength)
                        buf.fill(this.EMPTY_VALUE, bufLength, absoluteAddress);
                    //Write the dataFieldBuf to buf
                    dataFieldBuf.copy(buf, absoluteAddress);
                    bufLength = Math.max(bufLength, absoluteAddress + dataLength);
                    break;
                case this.END_OF_FILE:
                    if (dataLength != 0)
                        throw new Error("Invalid EOF record on line " +
                            lineNum + ".");
                    return {
                        "data": buf.slice(0, bufLength),
                        "startSegmentAddress": startSegmentAddress!,
                        "startLinearAddress": startLinearAddress!
                    };
                    break;
                case this.EXT_SEGMENT_ADDR:
                    if (dataLength != 2 || lowAddress != 0)
                        throw new Error("Invalid extended segment address record on line " +
                            lineNum + ".");
                    highAddress = parseInt(dataField, 16) << 4;
                    break;
                case this.START_SEGMENT_ADDR:
                    if (dataLength != 4 || lowAddress != 0)
                        throw new Error("Invalid start segment address record on line " +
                            lineNum + ".");
                    startSegmentAddress = parseInt(dataField, 16);
                    break;
                case this.EXT_LINEAR_ADDR:
                    if (dataLength != 2 || lowAddress != 0)
                        throw new Error("Invalid extended linear address record on line " +
                            lineNum + ".");
                    highAddress = parseInt(dataField, 16) << 16;
                    break;
                case this.START_LINEAR_ADDR:
                    if (dataLength != 4 || lowAddress != 0)
                        throw new Error("Invalid start linear address record on line " +
                            lineNum + ".");
                    startLinearAddress = parseInt(dataField, 16);
                    break;
                default:
                    throw new Error("Invalid record type (" + recordType +
                        ") on line " + lineNum);
                    break;
            }
            //Advance to the next line
            if (dataString.charAt(pos) == "\r")
                pos++;
            if (dataString.charAt(pos) == "\n")
                pos++;
        }
        throw new Error("Unexpected end of input: missing or invalid EOF record.");
    };
}