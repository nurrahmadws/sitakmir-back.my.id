import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Categories from "./Category.js";
import Users from "./User.js";

const {DataTypes} = Sequelize;

const Content = db.define('contents', {
    category_id: {
        type: DataTypes.INTEGER,
        validate:{
            notEmpty: false
        }
    },
    title: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    slug: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    description: {
        type: DataTypes.TEXT,
        validate: {
            notEmpty: false
        }
    },
    status: {
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
    saldo_awal: {
        type: DataTypes.DECIMAL(30, 2),
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

Users.hasMany(Content, {foreignKey: 'created_by'});
Users.hasMany(Content, {foreignKey: 'updated_by'});
Categories.hasMany(Content, {foreignKey: 'category_id'});
Content.belongsTo(Users, {as: 'user_created', foreignKey: 'created_by'});
Content.belongsTo(Users, {as: 'user_updated', foreignKey: 'updated_by'});
Content.belongsTo(Categories, {foreignKey: 'category_id'});

export default Content;
// Content.sync({alter:true});