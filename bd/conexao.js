const Sequelize = require('sequelize');

const conexao = new Sequelize('petshopBD', 'postgres', 'postgres', {
    host: 'localhost',
    dialect: 'postgres',
    timezone: '-03:00'
});

module.exports = conexao;