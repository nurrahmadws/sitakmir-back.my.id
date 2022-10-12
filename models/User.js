import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const {DataTypes} = Sequelize;

const Users = db.define('users', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: false
        }
    },
    username: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    email: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false,
            isEmail: true
        }
    },
    no_hp: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    address: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    photo: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    url: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    role: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        validate: {
            notEmpty: false
        }
    },
},{
    freezeTableName: true
});

export default Users;

// Untuk menambahkan column ke table yang sudah ada
// Users.sync({alter:true});