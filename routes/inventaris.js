import express from "express";
import {index, ordinaryIndex, store, detail, update, destroy} from "../controllers/InvetarisController.js";
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/inventaris', index);
router.get('/inventaris/ordinaryIndex', verifyUser, ordinaryIndex);
router.post('/inventaris', verifyUser, store);
router.get('/inventaris/:id', detail);
router.patch('/inventaris/:id', verifyUser, update);
router.delete('/inventaris/:id', verifyUser, destroy);

export default router;