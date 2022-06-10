const crypto = require('crypto')

let hash = crypto.createHash('md5').update('1234').digest("hex")
console.log(hash);


