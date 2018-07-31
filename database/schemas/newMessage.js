module.exports.define = function(sequelize, DataTypes) {
    return sequelize.define('NewMessage', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        nameConversation: {
            type: DataTypes.STRING,
            allowNull: false
        },
        idUser: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    });

};
