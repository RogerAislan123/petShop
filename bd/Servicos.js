const Sequelize = require('sequelize');
const conexao = require('./conexao');

const Servicos = conexao.define('servicos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descricao: Sequelize.STRING,
    preco: Sequelize.FLOAT,
    data: Sequelize.DataTypes.DATEONLY
});

Servicos.sync({force: false});

module.exports = Servicos;



