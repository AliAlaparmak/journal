const fs = require('fs');
const path = require('path');

export function entryPath(time) {
  const date = time instanceof Date ? time : time.value;
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();
  const filename = `${month}-${day}-${year}.txt`; 
  return path.join(__dirname, "entries", filename);
}

export function entryExists(time) {
  return fs.existsSync(entryPath(time));
}

export let PASSPHRASE = 'change-me-to-a-strong-passphrase';
const enc = new TextEncoder();
const dec = new TextDecoder();                        
const toB64 = (u8) => Buffer.from(u8).toString('base64');
const fromB64 = (b64) => new Uint8Array(Buffer.from(b64, 'base64')); 

async function deriveKey(passphrase, saltU8) {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(passphrase),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: saltU8, iterations: 200_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export async function cipherText(plaintext, time) {
  const date = time instanceof Date ? time : time.value;

  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();

  const filename = `${month}-${day}-${year}.txt`;
  const dir = path.join(__dirname, 'entries');
  const filepath = path.join(dir, filename);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  // --- salt + iv, derive key, encrypt ---
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv   = crypto.getRandomValues(new Uint8Array(12));
  const key  = await deriveKey(PASSPHRASE, salt);

  const ctBuf = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    enc.encode(plaintext)
  );
  const cipherBytes = new Uint8Array(ctBuf);

  const payload = {
    iv: toB64(iv),
    salt: toB64(salt),
    ciphertext: toB64(cipherBytes) // tag is appended inside by Web Crypto
  };

  fs.writeFileSync(filepath, JSON.stringify(payload, null, 2), 'utf8');
  console.log(`Saved (encrypted) entry to ${filepath}`);
}

export async function decryptText(time){
  const date = time instanceof Date ? time : time.value;
  const month = date.getMonth() + 1;
  const day   = date.getDate();
  const year  = date.getFullYear();
  const filename = `${month}-${day}-${year}.txt`;
  const dir = path.join(__dirname, 'entries');
  const filepath = path.join(dir, filename);

  if (!fs.existsSync(filepath)) {
    throw new Error(`No entry file for ${month}/${day}/${year}`);
  }

  const payload = JSON.parse(fs.readFileSync(filepath, 'utf8'));
  const iv   = fromB64(payload.iv);  
  const salt = fromB64(payload.salt);
  const ct   = fromB64(payload.ciphertext);

  const key = await deriveKey(PASSPHRASE, salt);

  try {
    const ptBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      ct
    );
    return dec.decode(ptBuf); 
  } catch (e) {
    throw new Error('Decryption failed (wrong passphrase or tampered data).');
  }
}
