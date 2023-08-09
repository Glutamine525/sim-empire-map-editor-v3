import { AES, enc, mode, pad } from 'crypto-js';

const KEY = enc.Utf8.parse(process.env['AES_KEY']!);
const IV = enc.Utf8.parse(process.env['AES_IV']!);

export function decrypt(cipher: string) {
  const encryptedHexStr = enc.Hex.parse(cipher);
  const source = enc.Base64.stringify(encryptedHexStr);
  const decrypt = AES.decrypt(source, KEY, {
    iv: IV,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
  const decryptedStr = decrypt.toString(enc.Utf8);
  return decryptedStr.toString();
}

export function encrypt(plain: string) {
  const source = enc.Utf8.parse(plain);
  const encrypted = AES.encrypt(source, KEY, {
    iv: IV,
    mode: mode.CBC,
    padding: pad.Pkcs7,
  });
  return encrypted.ciphertext.toString().toUpperCase();
}
