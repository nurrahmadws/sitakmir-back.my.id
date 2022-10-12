import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./User.js";

const {DataTypes} = Sequelize;

const Study = db.define('studies', {
    flag: {
        type: DataTypes.STRING,
        validate: {
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
        validate:{
            notEmpty: false
        }
    },
    presenter: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    imam: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    muadzin: {
        type: DataTypes.STRING,
        validate: {
            notEmpty: false
        }
    },
    day: {
        type: DataTypes.DATE,
        validate: {
            notEmpty: false
        }
    },
    location: {
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
    poster: {
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

Users.hasMany(Study, {foreignKey: 'created_by'});
Users.hasMany(Study, {foreignKey: 'updated_by'});
Study.belongsTo(Users, {as: 'user_created', foreignKey: 'created_by'});
Study.belongsTo(Users, {as: 'user_updated', foreignKey: 'updated_by'});

export default Study;

// Study.sync({alter:true});