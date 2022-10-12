import { Sequelize } from "sequelize";

const db = new Sequelize('kurpromy_takmir_masjid', 'kurpromy_first_takmir', 'KeVTtjfSbV2nQt5', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;