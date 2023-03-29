const Sequelize = require('sequelize');
const conexao = require('./conexao');
const Racas = require('./Racas');

const RegistroPets = conexao.define('registroPets', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    proprietario: Sequelize.STRING,
    nome: Sequelize.STRING,
    nascimento: Sequelize.DataTypes.DATEONLY
});

Racas.hasMany(RegistroPets, {
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE'
});

RegistroPets.belongsTo(Racas);

RegistroPets.sync({force: false});

module.exports = RegistroPets;



