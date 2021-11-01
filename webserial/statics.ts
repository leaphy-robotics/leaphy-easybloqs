export class Statics {
  static Cmnd_STK_GET_SYNC: number = 0x30;
  static Cmnd_STK_SET_DEVICE: number = 0x42;
  static Cmnd_STK_ENTER_PROGMODE: number = 0x50;
  static Cmnd_STK_LOAD_ADDRESS: number = 0x55;
  static Cmnd_STK_PROG_PAGE: number = 0x64;
  static Cmnd_STK_LEAVE_PROGMODE: number = 0x51;
  static Cmnd_STK_READ_SIGN: number = 0x75;
  static Sync_CRC_EOP: number = 0x20;
  static Resp_STK_OK: number = 0x10;
  static Resp_STK_INSYNC: number = 0x14;
  static Resp_STK_NOSYNC: number = 0x15;
  static Cmnd_STK_READ_PAGE: number = 0x74;
  static OK_RESPONSE: Buffer = Buffer.from([this.Resp_STK_INSYNC, this.Resp_STK_OK])
}