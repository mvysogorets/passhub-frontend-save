import * as WWPass from 'wwpass-frontend';
import { serverLog } from './utils';
import forge from 'node-forge';

let WebCryptoPrivateKey = null;
let ForgePrivateKey = null;

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
  
  function decodeItemGCM(item, aesKey) {
    const decipher = forge.cipher.createDecipher('AES-GCM', aesKey);
    decipher.start({ iv: atob(item.iv), tag: atob(item.tag) });
    decipher.update(forge.util.createBuffer(atob(item.data)));
    const pass = decipher.finish();
    return decipher.output.toString('utf8').split('\0');
  }
  
  function decodeItem(item, aesKey) {
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
    if ( (item.version === 3) || (item.version === 4)) {
      return decodeItemGCM(item, aesKey);
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
  

  
export {
  getPrivateKey,
  decryptAesKey,
  decodeItem,
  decodeFolder,
};
