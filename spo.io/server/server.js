require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const express = require('express');
const authRouter = require('./routes/auth');
const app = express();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT || 3002;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('As variáveis de ambiente CLIENT_ID, CLIENT_SECRET e REDIRECT_URI devem estar configuradas.');
}

app.set('view engine', 'ejs');

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
