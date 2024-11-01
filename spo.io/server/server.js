require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRouter = require('./routes/auth');
const app = express();

app.use(cors({ origin: 'http://127.0.0.1:5500' }));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT || 3002;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('As variáveis de ambiente CLIENT_ID, CLIENT_SECRET e REDIRECT_URI devem estar configuradas.');
}

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '../client')));

app.get('/config', (req, res) => {
    res.json({
        CLIENT_ID: process.env.CLIENT_ID,
        REDIRECT_URI: process.env.REDIRECT_URI
    });
});

app.use('/feature/auth-logic', authRouter);

app.get('/home', (req, res) => {
    const accessToken = req.query.access_token;
    const userName = req.query.user_name || '';
    const userImage = req.query.user_image || '';

    res.render('home', { accessToken, userName, userImage });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});