import express from "express";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import SequelizeStore from "connect-session-sequelize";
import fileUpload from "express-fileupload";
import db from './config/Database.js';
import UserRoute from './routes/user.js';
import AuthRoute from './routes/auth.js';
import CategoryRoute from './routes/category.js';
import TransactionRoute from './routes/transaction.js';
import StudyRoute from './routes/study.js';
import DocumentationRouter from './routes/documentation.js';
import InventarisRouter from './routes/inventaris.js';
import ContentRouter from './routes/content.js';

dotenv.config();
const app = express();

const sessionStore = SequelizeStore(session.Store);
const store = new sessionStore({
    db
});

// Kode dibawah diaktifkan ketika ada table baru
(async () => {
    await db.sync();
})();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: "auto"
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://sitakmir.kurpro.my.id/' //Ganti jika di deploy ke production http://localhost:3000
}));

app.use(express.json());
app.use(fileUpload())
app.use(express.static("public"))
app.use(UserRoute);
app.use(AuthRoute);
app.use(CategoryRoute);
app.use(TransactionRoute);
app.use(StudyRoute);
app.use(DocumentationRouter);
app.use(InventarisRouter);
app.use(ContentRouter);

// const task = cron.schedule('* * * * *', () => {
//     (console.log('running on every minutes');
// });

app.listen(process.env.APP_PORT, () => {
    console.log('Server up and running...');
});
// task.start();
