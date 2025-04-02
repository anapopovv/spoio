document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3002/config');
        
        if (!response.ok) {
            throw new Error(`Erro ao buscar configuração: ${response.status}`);
        }

        const config = await response.json();
        const { CLIENT_ID, REDIRECT_URI } = config;

        if (!CLIENT_ID || !REDIRECT_URI) {
            throw new Error("Erro: CLIENT_ID ou REDIRECT_URI não definidos.");
        }

        const loginButton = document.getElementById('login-button');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played';
                const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&show_dialog=true`;
                
                window.location.href = authUrl;
            });
        }

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {

            const tokenResponse = await fetch('http://localhost:3002/feature/auth-logic/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
            });

            if (!tokenResponse.ok) {
                throw new Error("Erro ao obter o token de acesso.");
            }

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            sessionStorage.setItem('access_token', accessToken);
            console.log('Access Token obtido com sucesso.');

            window.location.href = '/home.html';
        }

        const accessToken = sessionStorage.getItem('access_token');
        if (accessToken) {
    
            const topArtistsResponse = await fetch('https://api.spotify.com/v1/me/top/artists', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            });

            if (!topArtistsResponse.ok) {
                throw new Error('Erro ao buscar top artistas');
            }

            const topArtistsData = await topArtistsResponse.json();
            console.log('Top Artists:', topArtistsData);

            sessionStorage.setItem('topArtists', JSON.stringify(topArtistsData.items));
        }
    } catch (error) {
        console.error('Erro:', error.message);
    }
});