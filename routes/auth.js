import express from "express";
import {login, my_profile, logout} from "../controllers/AuthController.js";

const router = express.Router();

router.get('/my_profile', my_profile);
router.post('/login', login);
router.delete('/logout', logout);

export default router;