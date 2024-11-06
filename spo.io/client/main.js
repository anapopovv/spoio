document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fazer a requisição para obter a configuração do Spotify
        const response = await fetch('http://localhost:3002/config');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        const { CLIENT_ID, REDIRECT_URI } = config;

        const loginButton = document.getElementById('login-button');

        // Evento de clique do botão de login
        loginButton.addEventListener('click', () => {
            const scopes = 'user-read-private user-read-email user-top-read user-read-recently-played';
            const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${CLIENT_ID}&scope=${encodeURIComponent(scopes)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&show_dialog=true`;
            window.location.href = authUrl;
        });

        // Verificar se há um código de autorização no URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');

        if (code) {
            // Trocar o código por um token de acesso
            const tokenResponse = await fetch('http://localhost:3002/feature/auth-logic/callback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, redirect_uri: REDIRECT_URI }),
            });

            const tokenData = await tokenResponse.json();
            const accessToken = tokenData.access_token;

            // Salvar o token de acesso no sessionStorage
            sessionStorage.setItem('access_token', accessToken);
            console.log('Access Token:', accessToken);

            // Redirecionar para a página principal após login
            window.location.href = '/home.html';
        }

        // Se o usuário já tiver um token de acesso, buscar os dados do Spotify
        const accessToken = sessionStorage.getItem('access_token');
        if (accessToken) {
            // Requisição para obter os top artistas do usuário
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

            // Armazenando os top artistas no sessionStorage
            sessionStorage.setItem('topArtists', JSON.stringify(topArtistsData.items));

            // Você pode agora acessar os dados no sessionStorage para exibir no seu modal ou página
            const topArtists = JSON.parse(sessionStorage.getItem('topArtists')) || [];
            console.log('Top Artists armazenados no sessionStorage:', topArtists);
        }
    } catch (error) {
        console.error('Erro ao obter configuração:', error);
    }
});
