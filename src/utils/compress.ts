import { deflate, inflate } from 'pako';

const encoder: BufferEncoding = 'base64';

export function compress(str: string) {
  return Buffer.from(deflate(str)).toString(encoder);
}

export function decompress(str: string) {
  return inflate(new Uint8Array(Buffer.from(str, encoder)), { to: 'string' });
}
