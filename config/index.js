// automatically load the right config based on NODE_ENV environment variable
module.exports = require('./' + (process.env.NODE_ENV || 'development'));
