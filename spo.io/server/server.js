require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const authRouter = require('./routes/auth');
const app = express();
const axios = require('axios');

app.get('/artists', (req, res) => {
  res.sendFile(path.join(__dirname, 'artists.json'));
});

app.get('/podcasts', (req, res) => {
    res.sendFile(path.join(__dirname, 'podcasts.json'));
});

app.use(cors({ origin: 'http://127.0.0.1:5500' }));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const PORT = process.env.PORT || 3002;

if (!CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI) {
    throw new Error('As variáveis de ambiente CLIENT_ID, CLIENT_SECRET e REDIRECT_URI devem estar configuradas.');
}

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'client/css')));
app.use(express.static(path.join(__dirname, 'client/js')));
app.use(express.static(path.join(__dirname, '../client')));

app.get('/config', (req, res) => {
    res.json({
        CLIENT_ID: process.env.CLIENT_ID,
        REDIRECT_URI: process.env.REDIRECT_URI
    });
});

app.use('/feature/auth-logic', authRouter);

app.get('/home', async (req, res) => {
    const accessToken = req.query.access_token;
    const userName = req.query.user_name || '';
    const userImage = req.query.user_image || '';

    if (!accessToken) {
        return res.status(400).send('Token de acesso não fornecido');
    }

    try {
        // Obter os dados do perfil do usuário
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        const userCountry = userResponse.data.country || 'Desconhecido';

        // Obter os top artistas
        const artistsResponse = await axios.get('https://api.spotify.com/v1/me/top/artists', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 10 }
        });
        const topArtists = artistsResponse.data.items.map(artist => ({
            name: artist.name,
            imageUrl: artist.images && artist.images.length > 0 ? artist.images[0].url : ''  // Verifica a existência de imagens
        }));

        // Obter as músicas mais ouvidas
        const tracksResponse = await axios.get('https://api.spotify.com/v1/me/top/tracks', {
            headers: { Authorization: `Bearer ${accessToken}` },
            params: { limit: 10 }
        });
        const topTracks = tracksResponse.data.items.map(track => ({
            name: track.name,
            artistName: track.artists && track.artists.length > 0 ? track.artists[0].name : 'Artista desconhecido',  // Verifica a existência de artistas
            imageUrl: track.album.images && track.album.images.length > 0 ? track.album.images[0].url : ''  // Verifica a existência de imagens do álbum
        }));

        // Renderiza a página home passando os dados do usuário, artistas e músicas com imagens
        res.render('home', {
            userName,
            userImage,
            userCountry,
            topArtists,
            topTracks
        });
    } catch (error) {
        console.error('Erro ao obter dados do usuário ou top artistas/músicas:', error);
        res.status(500).send('Erro ao obter dados do usuário');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});