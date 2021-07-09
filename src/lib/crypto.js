import * as WWPass from 'wwpass-frontend';
import { serverLog } from './utils';
import forge from 'node-forge';

let WebCryptoPrivateKey = null;
let ForgePrivateKey = null;
let publicKeyPem = null;

const ab2str = buf => String.fromCharCode.apply(null, new Uint16Array(buf));
const uint82str = buf => String.fromCharCode.apply(null, new Uint8Array(buf));

const str2uint8 = (str) => {
  const bytes = new Uint8Array(str.length);
  for (let i = 0, strLen = str.length; i < strLen; i += 1) {
    bytes[i] = str.charCodeAt(i);
  }
  return bytes.buffer;
};


const b64ToAb = (base64) => {
  const s = atob(base64);
  const bytes = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i += 1) {
    bytes[i] = s.charCodeAt(i);
  }
  return bytes.buffer;
};

const getSubtle = () => {
  const crypto = window.crypto || window.msCrypto;
  return crypto ? (crypto.webkitSubtle || crypto.subtle) : null;
};

const isIOS10 = () => navigator.userAgent.match('Version/10') && navigator.userAgent.match(/iPhone|iPod|iPad/i);

const pem2CryptoKey = (pem) => {
  const eol = pem.indexOf('\n');
  const pem1 = pem.slice(eol + 1, -2);
  const eof = pem1.lastIndexOf('\n');
  const pem2 = pem1.slice(0, eof);
  const pemBinary = atob(pem2);
  const pemAb = str2uint8(pemBinary);
  return getSubtle().importKey(
    'pkcs8',
    pemAb,
    {
      name: 'RSA-OAEP',
      hash: { name: 'SHA-1' },
    },
    false,
    ['decrypt'],
  )
    .then((key) => {
      // console.log('exiting pem2cryptokey');
      WebCryptoPrivateKey = key;
      return key;
    });
};


function getPrivateKey(data) {
  publicKeyPem = data.publicKeyPem;
  return WWPass.cryptoPromise
    .getWWPassCrypto(data.ticket, "AES-CBC")
    .then((thePromise) => {
      // console.log('after getWWPassCrypto');
      const iv = new Uint8Array([176, 178, 97, 142, 156, 31, 45, 30, 81, 210, 85, 14, 202, 203, 86, 240]);
      return getSubtle().decrypt(
        {
          name: 'AES-CBC',
          iv,
        },
        thePromise.clientKey,
        b64ToAb(data.ePrivateKey)
      ).then( (ab) => {
        const pem = ab2str(ab);
        // console.log(pem)
        return pem2CryptoKey(pem);

      });
    });

}


function getPrivateKeyOld(ePrivateKey, ticket) {

  return WWPass.cryptoPromise.getWWPassCrypto(ticket, 'AES-CBC')
  .then((thePromise) => {
    // console.log('after getWWPassCrypto');
    const iv = new Uint8Array([176, 178, 97, 142, 156, 31, 45, 30, 81, 210, 85, 14, 202, 203, 86, 240]);
    return getSubtle().decrypt(
      {
        name: 'AES-CBC',
        iv,
      },
      thePromise.clientKey,
      b64ToAb(ePrivateKey)
    ).then(ab2str)
      .then((pem) => {
        if (isIOS10() /* || navigator.userAgent.match(/edge/i) */) {
          ForgePrivateKey = forge.pki.privateKeyFromPem(pem);
          return ForgePrivateKey;
        }
        // return pem2CryptoKey(pem);
        return pem2CryptoKey(pem).catch(() => { // try old keys, generated in forge
          serverLog('forge privateKey');
          ForgePrivateKey = forge.pki.privateKeyFromPem(pem);
          return ForgePrivateKey;
        });
      })
      .catch((error) => {
        // TODO: pop it up
        console.log('error88:')
        console.log(error);
      });
  });
}

  const forgeDecryptAesKey = async (eKeyH) => {
    const eKey = forge.util.hexToBytes(eKeyH);
    return ForgePrivateKey.decrypt(eKey, 'RSA-OAEP');
  };
  
  const decryptAesKey = (eKey) => {
    if (ForgePrivateKey) {
      return forgeDecryptAesKey(eKey);
    }
    const u8Key = str2uint8(forge.util.hexToBytes(eKey));
    return getSubtle().decrypt(
      {
        name: 'RSA-OAEP',
        hash: { name: 'SHA-1' }, // Edge!
      },
      WebCryptoPrivateKey,
      u8Key
    ).then(abKey => uint82str(new Uint8Array(abKey))).catch((err) => console.log(err));
  };

  const encryptAesKey = (publicKey_Pem, pAesKey) => {
    const publicKey = forge.pki.publicKeyFromPem(publicKey_Pem);
    const encryptedAesKey = publicKey.encrypt(pAesKey, 'RSA-OAEP');
    const hexEncryptedAesKey = forge.util.bytesToHex(encryptedAesKey);
    return hexEncryptedAesKey;
 }

  function createSafe(name) {
    const aesKey = forge.random.getBytesSync(32);
    /*
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encryptedAesKey = publicKey.encrypt(aesKey, 'RSA-OAEP');
    const hexEncryptedAesKey = forge.util.bytesToHex(encryptedAesKey);
    */
    const hexEncryptedAesKey = encryptAesKey(publicKeyPem, aesKey);
    return { name, aes_key: hexEncryptedAesKey };
  };

  
  function decodeItemGCM(item, aesKey) {
    const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
    decipher.start({ iv: atob(item.iv), tag: atob(item.tag) });
    decipher.update(forge.util.createBuffer(atob(item.data)));
    const pass = decipher.finish();
    return decipher.output.toString('utf8').split('\0');
  }
  
  function decodeItem(item, aesKey) {
    if ( (item.version === 3) || (item.version === 4)) {
      return decodeItemGCM(item, aesKey);
    }

    const decipher = forge.cipher.createDecipher('AES-ECB', aesKey);
    decipher.start({ iv: forge.random.getBytesSync(16) });
  
    if (item.version === 1) {
      const encryptedData = forge.util.hexToBytes(item.creds);
      decipher.update(forge.util.createBuffer(encryptedData));
      const result = decipher.finish(); // check 'result' for true/false
      const creds = decipher.output.toString('utf8').split('\0');
      return [item.title, creds[0], creds[1], item.url, item.notes];
    }
    if (item.version === 2) {
      const encryptedData = forge.util.hexToBytes(item.data);
      decipher.update(forge.util.createBuffer(encryptedData));
      const result = decipher.finish(); // check 'result' for true/false
      return decipher.output.toString('utf8').split('\0');
    }
    alert(`Error 450: cannot decode data version ${item.version}`); //  ??
    return null;
  }

  function decodeFolder(item, aesKey) {
    const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
    decipher.start({ iv: atob(item.iv), tag: atob(item.tag) });
    decipher.update(forge.util.createBuffer(atob(item.data)));
    const pass = decipher.finish();
    return decipher.output.toString('utf8').split('\0');
  }
  
  function encryptFolderName(cleartextName, aesKey) {
  
    const iv = forge.random.getBytesSync(16);
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(cleartextName, 'utf8')); // already joined by encode_item (
    const result = cipher.finish(); // check 'result' for true/false
    return JSON.stringify({
      iv: btoa(iv),
      data: btoa(cipher.output.data),
      tag: btoa(cipher.mode.tag.data),
      version: 3,
    });
  }

  function encryptItemGCM(cleartextItem, aesKey, options) {
    const cleartextData = cleartextItem.join('\0');
    const cipher = forge.cipher.createCipher('AES-GCM', aesKey);
    const iv = forge.random.getBytesSync(16);
    cipher.start({ iv });
    cipher.update(forge.util.createBuffer(cleartextData, 'utf8')); // already joined by encode_item (
    const result = cipher.finish(); // check 'result' for true/false
  
    const obj = {
      iv: btoa(iv),
      data: btoa(cipher.output.data),
      tag: btoa(cipher.mode.tag.data),
      version: 3,
    };
    if (cleartextItem.length === 6) {
      obj.version = 4;
    }
    if (typeof options !== 'undefined') {
      // Object.assign "polifill"
      for (let prop1 in options) {
        obj[prop1] = options[prop1];
      }
    }
    return JSON.stringify(obj);
  }
  

  function encryptItem(item, aesKey, options) {
    return encryptItemGCM(item, aesKey, options);
  }

  function encryptFile(pFileContent, aesKey) {
    const fileArray = new Uint8Array(pFileContent);
    const fileAesKey = forge.random.getBytesSync(32);
    const fileCipher = forge.cipher.createCipher("AES-GCM", fileAesKey);
    const fileIV = forge.random.getBytesSync(12);
    fileCipher.start({ iv: fileIV });
    fileCipher.update(forge.util.createBuffer(fileArray));
    fileCipher.finish();
    const keyCipher = forge.cipher.createCipher(
      "AES-ECB",
      aesKey
    );
    const keyIV = forge.random.getBytesSync(16);
    keyCipher.start({ iv: keyIV });
    keyCipher.update(forge.util.createBuffer(fileAesKey));
    keyCipher.finish();
    return {
      fileInfo: JSON.stringify({
        version: 3,
        key: btoa(keyCipher.output.data),
        iv: btoa(fileIV),
        // data: btoa(fileCipher.output.data),
        tag: btoa(fileCipher.mode.tag.data),
      }),
      cFileContent: fileCipher.output.data
    }
  }

  const decryptFile = (fileObj, aesKey) => {
    const filename = decodeItemGCM(fileObj.filename, aesKey)[0];
    const keyDecipher = forge.cipher.createDecipher('AES-ECB', aesKey);
    keyDecipher.start({ iv: atob(fileObj.file.iv) });
    keyDecipher.update(forge.util.createBuffer(atob(fileObj.file.key)));
    keyDecipher.finish();
    const fileAesKey = keyDecipher.output.data;
    const decipher = forge.cipher.createDecipher('AES-GCM', fileAesKey);
    decipher.start({ iv: atob(fileObj.file.iv), tag: atob(fileObj.file.tag) });
    decipher.update(forge.util.createBuffer(atob(fileObj.file.data)));
    const success = decipher.finish(); // got false actully, still decrypted ok????
    const { length } = decipher.output.data;
    const buf = new ArrayBuffer(length);
    const arr = new Uint8Array(buf);
    let i = -1;
    while (++i < length) {
      arr[i] = decipher.output.data.charCodeAt(i);
    }
    return { filename, buf };
  };
  
  
  
export {
  getPrivateKey,
  decryptAesKey,
  encryptAesKey,
  decodeItem,
  decodeFolder,
  createSafe,
  encryptFolderName,
  encryptItem,
  encryptFile,
  decryptFile,
  str2uint8
};
