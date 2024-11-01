document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3002/config');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const config = await response.json();
        const { CLIENT_ID, REDIRECT_URI } = config;
        const loginButton = document.getElementById('login-button');

        loginButton.addEventListener('click', () => {
            const spotifyAuthUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=user-read-private&show_dialog=true`;
            window.location.href = spotifyAuthUrl;
        });
    } catch (error) {
        console.error('Erro ao carregar a configuração:', error);
    }
});
