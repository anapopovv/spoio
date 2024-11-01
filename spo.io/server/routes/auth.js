require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const router = express.Router();
const axios = require('axios');

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('As variáveis de ambiente CLIENT_ID, CLIENT_SECRET e REDIRECT_URI devem estar configuradas.');
}

router.get('/config', (req, res) => {
    res.json({
        CLIENT_ID: process.env.CLIENT_ID,
        REDIRECT_URI: process.env.REDIRECT_URI,
    });
});

router.get('/login', (req, res) => {
    const scopes = 'user-read-private user-read-email';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&show_dialog=true`;
    res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;
    console.log('Código recebido:', code);

    if (!code) {
        console.error('Código de autorização não fornecido');
        return res.status(400).send('Código de autorização não fornecido');
    }

    const authOptions = {
        method: 'POST',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'),
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
    };

    try {
        const response = await axios(authOptions);
        const accessToken = response.data.access_token;
        console.log('Token de acesso recebido:', accessToken);

        const userOptions = {
            method: 'GET',
            url: 'https://api.spotify.com/v1/me',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        const userResponse = await axios(userOptions);
        console.log('Dados do usuário:', JSON.stringify(userResponse.data, null, 2));

        const userName = userResponse.data.display_name || 'Usuário';
        const userImage = userResponse.data.images?.[0]?.url || '';
        console.log('Nome do usuário:', userName);
        console.log('Imagem do usuário:', userImage);

        res.redirect(`/home?access_token=${encodeURIComponent(accessToken)}&user_name=${encodeURIComponent(userName)}&user_image=${encodeURIComponent(userImage)}`);
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error('Token inválido ou expirado. Necessário autenticar novamente.');
        } else {
            console.error('Erro ao obter dados do usuário:', error.response ? error.response.data : error.message);
        }
        res.status(500).send('Erro ao obter os dados do usuário');
    }
});

module.exports = router;