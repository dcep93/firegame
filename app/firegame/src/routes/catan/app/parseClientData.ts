// clientData: {0: 2, 1: 7, 2: 5, 3: 108, 4: 111, 5: 98, 6: 98, 7: 121, 8: 130, 9: 166, 10: 97, 11: 99, 12: 116, 13: 105, 14: 111, 15: 110, 16: 1, 17: 167, 18: 112, 19: 97, 20: 121, 21: 108, 22: 111, 23: 97, 24: 100, 25: 128}
// parsed: { channel: "lobby", _header: [2, 7], action: 1, payload: {} }
export default function parseClientData(clientData: Record<string, number>) {
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
