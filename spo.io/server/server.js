require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const session = require('express-session');

const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3002;

const { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, SESSION_SECRET } = process.env;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !SESSION_SECRET) {
    throw new Error('Erro: Variáveis de ambiente obrigatórias não definidas.');
}

app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 
    }
}));

app.use(cors({
    origin: 'http://127.0.0.1:5501', 
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'client/css')));
app.use(express.static(path.join(__dirname, 'client/js')));
app.use(express.static(path.join(__dirname, '../client')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/config', (req, res) => {
    res.json({
        CLIENT_ID,
        REDIRECT_URI
    });
});

app.use('/feature/auth-logic', authRouter);

app.get('/home', async (req, res) => {
    const accessToken = req.query.access_token;
    const userName = req.query.user_name || '';
    const userImage = req.query.user_image || '';

    if (!accessToken) {
        return res.status(400).send('Erro: Token de acesso não fornecido.');
    }

    try {
        
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const userCountry = userResponse.data.country || 'Desconhecido';

        const artistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 10 }
        });

        const topArtists = artistsResponse.data.items.map(artist => ({
            name: artist.name,
            imageUrl: artist.images?.[0]?.url || ''
        }));

        const tracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 10 }
        });

        const topTracks = tracksResponse.data.items.map(track => ({
            name: track.name,
            artistName: track.artists?.[0]?.name || 'Artista desconhecido',
            imageUrl: track.album.images?.[0]?.url || ''
        }));

        res.render('home', {
            userName,
            userImage,
            userCountry,
            topArtists,
            topTracks
        });
    } catch (error) {
        console.error('Erro ao obter dados do Spotify:', error.message);
        res.status(500).send('Erro ao obter dados do Spotify. Tente novamente mais tarde.');
    }
});

app.get('/artists', (req, res) => {
    const filePath = path.join(__dirname, 'artists.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo artists.json:', err);
            return res.status(500).send('Erro ao obter dados dos artistas.');
        }
        res.json(JSON.parse(data));
    });
});

app.get('/podcasts', (req, res) => {
    const filePath = path.join(__dirname, 'podcasts.json');

    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo podcasts.json:', err);
            return res.status(500).send('Erro ao obter dados dos podcasts.');
        }
        res.json(JSON.parse(data));
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 