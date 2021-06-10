import SerialPort, { parsers } from "serialport";
import events from "events";

const { Readline } = parsers;

class BluetoothSerialPort extends events {
  public serialPort: SerialPort;

  constructor(path: string) {
    super();
    this.serialPort = new SerialPort(path, {
      baudRate: 57600,
      dataBits: 8,
      parity: 'none',
      stopBits: 1,
    });

    const parser = new Readline({ delimiter: '\r\n' });
    this.serialPort.pipe(parser)
    parser.on("data", (buffer: string) => {
      this.emit("data", buffer);
    });

    this.serialPort.on("error", (err) => {
      console.log("error", err);
    });
    this.serialPort.on("close", () => {
      this.emit("close");
    });
    this.serialPort.on("open", () => {
      this.emit("open");
    });
  }

  open() {
    return new Promise<void>((res, rej) => {
      this.serialPort.open((err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  close() {
    return new Promise<void>((res, rej) => {
      this.serialPort.close((err) => {
        if (err) rej(err);
        else res();
      });
    });
  }

  isOpen() {
    return this.serialPort.isOpen;
  }

  write(buffer: string) {
    return new Promise<number>((res, rej) => {
      this.serialPort.write(buffer, (err, bytesWritten) => {
        if (err) rej(err);
        else res(bytesWritten);
      });
    });
  }
}

export default BluetoothSerialPort;
