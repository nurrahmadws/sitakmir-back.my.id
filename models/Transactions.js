import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./User.js";
import Categories from "./Category.js";

const {DataTypes} = Sequelize;

const Transactions = db.define('transactions', {
    category_id: {
        type: DataTypes.INTEGER,
        validate:{
            notEmpty: false
        }
    },
    title: {
        type: DataTypes.STRING,
        validate:{
            notEmpty: false
        }
    },
    nominal: {
        type: DataTypes.DECIMAL(30, 2),
        validate:{
            notEmpty: false
        }
    },
    date: {
        type: DataTypes.DATEONLY,
        validate:{
            notEmpty: false
        }
    },
    note: {
        type: DataTypes.TEXT,
        validate:{
            notEmpty: false
        }
    },
    evidence: {
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

Users.hasMany(Transactions, {foreignKey: 'created_by'});
Users.hasMany(Transactions, {foreignKey: 'updated_by'});
Categories.hasMany(Transactions, {foreignKey: 'category_id'});
Transactions.belongsTo(Users, {as: 'user_created', foreignKey: 'created_by'});
Transactions.belongsTo(Users, {as: 'user_updated', foreignKey: 'updated_by'});
Transactions.belongsTo(Categories, {foreignKey: 'category_id'});

export default Transactions;
// Transactions.sync({alter:true});