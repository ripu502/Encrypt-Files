const encrypt = require('./encrypt');
const decrypt = require('./decrypt');

const [ mode, file, password ] = process.argv.slice(2);
const shouldEncrypt = mode === 'encrypt';
const shouldDecrypt =  mode === 'decrypt';

if (shouldEncrypt) {
  encrypt({ file, password });
}

if (shouldDecrypt) {
  decrypt({ file, password });
}