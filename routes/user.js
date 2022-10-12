import express from "express";
import {index, store, detail, update, destroy} from "../controllers/UserController.js";
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, index);
router.post('/users', verifyUser, adminOnly, store);
router.get('/users/:id', verifyUser, detail);
router.patch('/users/:id', verifyUser, update);
router.delete('/users/:id', verifyUser, adminOnly, destroy);

export default router;