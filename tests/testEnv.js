require('dotenv').config();

if (process.env.NODE_ENV !== 'production') {
    console.log('Variáveis de ambiente carregadas corretamente.');
}