import {Sequelize} from "sequelize";
import db from "../config/Database.js";
import Users from "./User.js";

const {DataTypes} = Sequelize;

const Categories = db.define('categories', {
    tier: {
        type: DataTypes.INTEGER,
        validate:{
            notEmpty: false
        }
    },
    name: {
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
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
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

Users.hasMany(Categories, {foreignKey: 'created_by'});
Users.hasMany(Categories, {foreignKey: 'updated_by'});
Categories.belongsTo(Users, {as: 'user_created', foreignKey: 'created_by'});
Categories.belongsTo(Users, {as: 'user_updated', foreignKey: 'updated_by'});

export default Categories;
// Categories.sync({alter:true});