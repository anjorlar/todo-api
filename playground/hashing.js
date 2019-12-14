const { SHA256 } = require('crypto-js');

let message = 'abc123';
let hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

let data = {
    id: 4
};
let token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
};

let resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();

if (resultHash === token.hash) {
    console.log('data was not changed')
} else {
    console.log('data was changed. do nit trust!')
}