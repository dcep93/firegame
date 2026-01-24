// clientData: {0: 2, 1: 7, 2: 5, 3: 108, 4: 111, 5: 98, 6: 98, 7: 121, 8: 130, 9: 166, 10: 97, 11: 99, 12: 116, 13: 105, 14: 111, 15: 110, 16: 1, 17: 167, 18: 112, 19: 97, 20: 121, 21: 108, 22: 111, 23: 97, 24: 100, 25: 128}
// parsed: { channel: "lobby", _header: [2, 7], action: 1, payload: {} }
export function parseClientData(clientData: Record<string, number>) {
  console.log("parseClientData", clientData);
  console.log({ clientData: JSON.stringify(clientData) });
  const byteKeys = Object.keys(clientData)
    .map((key) => Number(key))
    .filter((key) => Number.isFinite(key))
    .sort((a, b) => a - b);
  const totalLength = byteKeys.length ? byteKeys[byteKeys.length - 1] + 1 : 0;
  const bytes = new Uint8Array(totalLength);
  for (const key of byteKeys) {
    bytes[key] = clientData[String(key)] ?? 0;
  }

  let offset = 0;
  const header = [bytes[offset++], bytes[offset++]];
  const channelLength = bytes[offset++] ?? 0;
  const channelBytes = bytes.slice(offset, offset + channelLength);
  offset += channelLength;

  const decodeText = (() => {
    if (typeof TextDecoder !== "undefined") {
      const decoder = new TextDecoder("utf-8");
      return (data: Uint8Array) => decoder.decode(data);
    }
    return (data: Uint8Array) => String.fromCharCode(...Array.from(data));
  })();

  const channel = decodeText(channelBytes);

  const decodeValue = (): any => {
    const byte = bytes[offset++];
    if (byte === undefined) return undefined;

    if (byte <= 0x7f) return byte;
    if (byte >= 0xe0) return byte - 0x100;

    if (byte >= 0xa0 && byte <= 0xbf) {
      const length = byte & 0x1f;
      const value = decodeText(bytes.slice(offset, offset + length));
      offset += length;
      return value;
    }

    if (byte >= 0x90 && byte <= 0x9f) {
      const length = byte & 0x0f;
      const arr = new Array(length);
      for (let i = 0; i < length; i += 1) {
        arr[i] = decodeValue();
      }
      return arr;
    }

    if (byte >= 0x80 && byte <= 0x8f) {
      const length = byte & 0x0f;
      const obj: Record<string, any> = {};
      for (let i = 0; i < length; i += 1) {
        const key = decodeValue();
        obj[String(key)] = decodeValue();
      }
      return obj;
    }

    switch (byte) {
      case 0xc0:
        return null;
      case 0xc2:
        return false;
      case 0xc3:
        return true;
      case 0xcc: {
        const value = bytes[offset];
        offset += 1;
        return value;
      }
      case 0xcd: {
        const value = (bytes[offset] << 8) | bytes[offset + 1];
        offset += 2;
        return value;
      }
      case 0xce: {
        const value =
          bytes[offset] * 2 ** 24 +
          (bytes[offset + 1] << 16) +
          (bytes[offset + 2] << 8) +
          bytes[offset + 3];
        offset += 4;
        return value;
      }
      case 0xd0: {
        const value = (bytes[offset] << 24) >> 24;
        offset += 1;
        return value;
      }
      case 0xd1: {
        const value = (bytes[offset] << 8) | bytes[offset + 1];
        offset += 2;
        return (value << 16) >> 16;
      }
      case 0xd2: {
        const value =
          (bytes[offset] << 24) |
          (bytes[offset + 1] << 16) |
          (bytes[offset + 2] << 8) |
          bytes[offset + 3];
        offset += 4;
        return value;
      }
      case 0xd9: {
        const length = bytes[offset];
        offset += 1;
        const value = decodeText(bytes.slice(offset, offset + length));
        offset += length;
        return value;
      }
      case 0xda: {
        const length = (bytes[offset] << 8) | bytes[offset + 1];
        offset += 2;
        const value = decodeText(bytes.slice(offset, offset + length));
        offset += length;
        return value;
      }
      case 0xdb: {
        const length =
          bytes[offset] * 2 ** 24 +
          (bytes[offset + 1] << 16) +
          (bytes[offset + 2] << 8) +
          bytes[offset + 3];
        offset += 4;
        const value = decodeText(bytes.slice(offset, offset + length));
        offset += length;
        return value;
      }
      case 0xdc: {
        const length = (bytes[offset] << 8) | bytes[offset + 1];
        offset += 2;
        const arr = new Array(length);
        for (let i = 0; i < length; i += 1) {
          arr[i] = decodeValue();
        }
        return arr;
      }
      case 0xdd: {
        const length =
          bytes[offset] * 2 ** 24 +
          (bytes[offset + 1] << 16) +
          (bytes[offset + 2] << 8) +
          bytes[offset + 3];
        offset += 4;
        const arr = new Array(length);
        for (let i = 0; i < length; i += 1) {
          arr[i] = decodeValue();
        }
        return arr;
      }
      case 0xde: {
        const length = (bytes[offset] << 8) | bytes[offset + 1];
        offset += 2;
        const obj: Record<string, any> = {};
        for (let i = 0; i < length; i += 1) {
          const key = decodeValue();
          obj[String(key)] = decodeValue();
        }
        return obj;
      }
      case 0xdf: {
        const length =
          bytes[offset] * 2 ** 24 +
          (bytes[offset + 1] << 16) +
          (bytes[offset + 2] << 8) +
          bytes[offset + 3];
        offset += 4;
        const obj: Record<string, any> = {};
        for (let i = 0; i < length; i += 1) {
          const key = decodeValue();
          obj[String(key)] = decodeValue();
        }
        return obj;
      }
      default:
        return undefined;
    }
  };

  const payload = decodeValue();
  if (payload && typeof payload === "object" && !Array.isArray(payload)) {
    return { channel, _header: header, ...payload };
  }

  return { channel, _header: header, payload };
}

export function packServerData(serverData: any) {
  console.log("packServerData:", serverData);
  if (serverData.id !== "136")
    console.log({ serverData: JSON.stringify(serverData) });
  if (
    serverData &&
    typeof serverData === "object" &&
    (serverData.type === "Connected" ||
      serverData.type === "SessionEstablished")
  ) {
    return JSON.stringify(serverData);
  }

  const encodeText = (() => {
    if (typeof TextEncoder !== "undefined") {
      const encoder = new TextEncoder();
      return (value: string) => encoder.encode(value);
    }
    return (value: string) => {
      const bytes: number[] = [];
      for (let i = 0; i < value.length; i += 1) {
        let code = value.charCodeAt(i);
        if (code >= 0xd800 && code <= 0xdbff && i + 1 < value.length) {
          const next = value.charCodeAt(i + 1);
          if ((next & 0xfc00) === 0xdc00) {
            code = ((code - 0xd800) << 10) + (next - 0xdc00) + 0x10000;
            i += 1;
          }
        }
        if (code <= 0x7f) {
          bytes.push(code);
        } else if (code <= 0x7ff) {
          bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
        } else if (code <= 0xffff) {
          bytes.push(
            0xe0 | (code >> 12),
            0x80 | ((code >> 6) & 0x3f),
            0x80 | (code & 0x3f),
          );
        } else {
          bytes.push(
            0xf0 | (code >> 18),
            0x80 | ((code >> 12) & 0x3f),
            0x80 | ((code >> 6) & 0x3f),
            0x80 | (code & 0x3f),
          );
        }
      }
      return new Uint8Array(bytes);
    };
  })();

  const encodeValue = (value: any): Uint8Array => {
    if (value === undefined) {
      value = null;
    }

    const bytes: number[] = [];
    const push = (...vals: number[]) => {
      for (const val of vals) {
        bytes.push(val & 0xff);
      }
    };

    const pushUint16 = (val: number) => {
      push((val >> 8) & 0xff, val & 0xff);
    };
    const pushUint32 = (val: number) => {
      push(
        (val >>> 24) & 0xff,
        (val >>> 16) & 0xff,
        (val >>> 8) & 0xff,
        val & 0xff,
      );
    };
    const pushUint64 = (val: number) => {
      const hi = Math.floor(val / 2 ** 32);
      const lo = val >>> 0;
      pushUint32(hi);
      pushUint32(lo);
    };
    const pushInt64 = (val: number) => {
      const hi = Math.floor(val / 2 ** 32);
      const lo = val - hi * 2 ** 32;
      pushUint32(hi >>> 0);
      pushUint32(lo >>> 0);
    };
    const pushFloat64 = (val: number) => {
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);
      view.setFloat64(0, val);
      const data = new Uint8Array(buffer);
      for (let i = 0; i < data.length; i += 1) {
        push(data[i]);
      }
    };

    const encodeInner = (val: any) => {
      if (val === null) {
        push(0xc0);
        return;
      }
      if (val === false) {
        push(0xc2);
        return;
      }
      if (val === true) {
        push(0xc3);
        return;
      }

      if (typeof val === "number") {
        if (!Number.isFinite(val)) {
          throw new Error(`Unsupported number: ${val}`);
        }
        if (!Number.isInteger(val)) {
          push(0xcb);
          pushFloat64(val);
          return;
        }
        if (Number.isInteger(val)) {
          if (val >= 0 && val <= 0x7f) {
            push(val);
            return;
          }
          if (val >= -32 && val < 0) {
            push(0xe0 | (val + 32));
            return;
          }
          if (val >= 0 && val <= 0xff) {
            push(0xcc, val);
            return;
          }
          if (val >= 0 && val <= 0xffff) {
            push(0xcd);
            pushUint16(val);
            return;
          }
          if (val >= 0 && val <= 0xffffffff) {
            push(0xce);
            pushUint32(val);
            return;
          }
          if (val > 0xffffffff && val <= Number.MAX_SAFE_INTEGER) {
            push(0xcf);
            pushUint64(val);
            return;
          }
          if (val >= -0x80 && val <= 0x7f) {
            push(0xd0, val & 0xff);
            return;
          }
          if (val >= -0x8000 && val <= 0x7fff) {
            push(0xd1);
            pushUint16(val & 0xffff);
            return;
          }
          if (val >= -0x80000000 && val <= 0x7fffffff) {
            push(0xd2);
            pushUint32(val >>> 0);
            return;
          }
          if (val < -0x80000000 && val >= Number.MIN_SAFE_INTEGER) {
            push(0xd3);
            pushInt64(val);
            return;
          }
        }
        throw new Error(`Unsupported number type: ${val}`);
      }

      if (typeof val === "string") {
        const textBytes = encodeText(val);
        const length = textBytes.length;
        if (length <= 0x1f) {
          push(0xa0 | length);
        } else if (length <= 0xff) {
          push(0xd9, length);
        } else if (length <= 0xffff) {
          push(0xda);
          pushUint16(length);
        } else {
          push(0xdb);
          pushUint32(length);
        }
        for (let i = 0; i < textBytes.length; i += 1) {
          push(textBytes[i]);
        }
        return;
      }

      if (Array.isArray(val)) {
        const length = val.length;
        if (length <= 0x0f) {
          push(0x90 | length);
        } else if (length <= 0xffff) {
          push(0xdc);
          pushUint16(length);
        } else {
          push(0xdd);
          pushUint32(length);
        }
        for (const item of val) {
          encodeInner(item);
        }
        return;
      }

      if (typeof val === "object") {
        const keys = Object.keys(val);
        const length = keys.length;
        if (length <= 0x0f) {
          push(0x80 | length);
        } else if (length <= 0xffff) {
          push(0xde);
          pushUint16(length);
        } else {
          push(0xdf);
          pushUint32(length);
        }
        for (const key of keys) {
          encodeInner(key);
          encodeInner(val[key]);
        }
        return;
      }

      throw new Error(`Unsupported value type: ${typeof val}`);
    };

    encodeInner(value);
    return new Uint8Array(bytes);
  };

  if (
    serverData &&
    typeof serverData === "object" &&
    Array.isArray(serverData._header) &&
    serverData._header.length >= 2 &&
    typeof serverData.channel === "string"
  ) {
    const payload: Record<string, any> = { ...serverData };
    delete payload._header;
    delete payload.channel;
    const header = serverData._header;
    const channelBytes = encodeText(serverData.channel);
    const payloadBytes = encodeValue(payload);
    const out = new Uint8Array(3 + channelBytes.length + payloadBytes.length);
    out[0] = header[0] ?? 0;
    out[1] = header[1] ?? 0;
    out[2] = channelBytes.length;
    out.set(channelBytes, 3);
    out.set(payloadBytes, 3 + channelBytes.length);
    return out.buffer;
  }

  return encodeValue(serverData).buffer;
}
