const Sequelize = require('sequelize');
const conexao = require('./conexao');

const Racas = conexao.define('racas', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nome: Sequelize.STRING
});

Racas.sync({force: false});

module.exports = Racas;



