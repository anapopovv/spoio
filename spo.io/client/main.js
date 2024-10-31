import config from '../config/config.js';

document.addEventListener('DOMContentLoaded', () => {
    const { CLIENT_ID, REDIRECT_URI } = config;
    const loginButton = document.getElementById('login-button');

    loginButton.addEventListener('click', () => {
        window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=user-read-private`;
    });
});
