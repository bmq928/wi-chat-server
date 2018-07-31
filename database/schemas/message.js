module.exports.define = function(sequelize, DataTypes) {
    return sequelize.define('Message', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        idConversation: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        idSender: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        type:{
            type: DataTypes.STRING(50),
            allowNull: false
        },
        sendAt: {
            type: DataTypes.DATE
        }
    });

};
