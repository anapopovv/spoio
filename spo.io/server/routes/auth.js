require('dotenv').config({ path: require('path').resolve(__dirname, '../../../.env') });
const express = require('express');
const router = express.Router();
const axios = require('axios');

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('Erro: CLIENT_ID, CLIENT_SECRET e REDIRECT_URI devem estar definidos no .env');
}

function isAuthenticated(req, res, next) {
    if (!req.session.spotify_token) {
        return res.redirect('/login');
    }
    next();
}

router.get('/config', (req, res) => {
    res.json({ CLIENT_ID, REDIRECT_URI });
});

router.get('/login', (req, res) => {
    const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played';
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&show_dialog=true`;
    res.redirect(authUrl);
});

router.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (!code) {
        console.error('Código de autorização não fornecido.');
        return res.status(400).send('Código de autorização não fornecido.');
    }

    try {

        const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', new URLSearchParams({
            grant_type: 'authorization_code',
            code,
            redirect_uri: REDIRECT_URI
        }), {
            headers: {
                Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        const accessToken = tokenResponse.data.access_token;
        req.session.spotify_token = accessToken; 

        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const userName = userResponse.data.display_name || 'Usuário';
        const userImage = userResponse.data.images?.[0]?.url || '';
        const followers = userResponse.data.followers?.total || 0;

        res.redirect(`/home?access_token=${encodeURIComponent(accessToken)}&user_name=${encodeURIComponent(userName)}&user_image=${encodeURIComponent(userImage)}&followers=${followers}`);
    
    } catch (error) {
        console.error('Erro no callback:', error.response?.data || error.message);
        res.status(500).send('Erro ao processar autenticação.');
    }
});

router.get('/home', isAuthenticated, (req, res) => {
    res.render('home');
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Erro ao tentar fazer logout.');
        }
        res.clearCookie('spotify_token'); 
        res.redirect('/login');
    });
});

module.exports = router;