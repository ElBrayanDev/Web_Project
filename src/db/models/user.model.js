const { Model, DataTypes } = require('sequelize');

const USER_TABLE = 'user';

class User extends Model {
    static config(sequelize) {
        return {
            sequelize,
            tableName: USER_TABLE,
            modelName: 'User',
            timestamps: false,
        }
    }
}

const UserSchema = {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,

    },
    username: {
        allowNull: false,
        type: DataTypes.STRING,
        unique: true,
        field: 'username',
    },
    email: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'email',
    },
    password: {
        allowNull: false,
        type: DataTypes.STRING,
        field: 'password',
    },
}

module.exports = { User, UserSchema };