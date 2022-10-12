import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./User.js";

const {DataTypes} = Sequelize;

const Documentation = db.define('documentations', {
    title: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: false
        }
    },
    slug: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: false
        }
    },
    date: {
        type: DataTypes.DATE,
        validate:{
            notEmpty: false
        }
    },
    location: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: false
        }
    },
    description: {
        type: DataTypes.TEXT,
        validate:{
            notEmpty: false
        }
    },
    photo: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: false
        }
    },
    url: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: false
        }
    },
    created_by: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: false
        }
    },
    updated_by: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: false
        }
    },
},{
    freezeTableName: true
});

Users.hasMany(Documentation, {foreignKey: 'created_by'});
Users.hasMany(Documentation, {foreignKey: 'updated_by'});
Documentation.belongsTo(Users, {as: 'user_created', foreignKey: 'created_by'});
Documentation.belongsTo(Users, {as: 'user_updated', foreignKey: 'updated_by'});

export default Documentation;
// Documentation.sync({alter:true});