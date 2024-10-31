require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

module.exports = {
    CLIENT_ID: process.env.CLIENT_ID,
    REDIRECT_URI: process.env.REDIRECT_URI
};