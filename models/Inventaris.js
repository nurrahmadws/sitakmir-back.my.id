import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./User.js";
import Categories from "./Category.js";

const {DataTypes} = Sequelize;

const Invetaris = db.define("inventaris", {
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
    procurement_time: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        validate: {
            notEmpty: false
        }
    },
    unit: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    condition: {
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
    estimated_total_price: {
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

Users.hasMany(Invetaris, {foreignKey: 'created_by'});
Users.hasMany(Invetaris, {foreignKey: 'updated_by'});
Categories.hasMany(Invetaris, {foreignKey: 'category_id'});
Invetaris.belongsTo(Users, {as: 'user_created', foreignKey: 'created_by'});
Invetaris.belongsTo(Users, {as: 'user_updated', foreignKey: 'updated_by'});
Invetaris.belongsTo(Categories, {foreignKey: 'category_id'});

export default Invetaris;