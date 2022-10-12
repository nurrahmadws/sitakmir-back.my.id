import express from "express";
import {index, store, detail, update, destroy} from "../controllers/StudyController.js";
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/pengajian', index);
router.post('/pengajian', verifyUser, store);
router.get('/pengajian/:id', detail);
router.patch('/pengajian/:id', verifyUser, update);
router.delete('/pengajian/:id', verifyUser, destroy);

export default router;