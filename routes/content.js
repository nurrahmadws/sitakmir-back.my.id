import express from "express";
import {index_about_us, index_contact_us, index_app_setting, index_management, main_index, index_announcement, store, detail, update, destroy} from "../controllers/ContentController.js";
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/tentang_kami', index_about_us);
router.get('/kontak_kami', index_contact_us);
router.get('/app_setting', index_app_setting);
router.get('/pengurus', index_management);
router.get('/content', main_index);
router.get('/announcement', index_announcement);
router.post('/content', verifyUser, store);
router.get('/content/:slug', detail);
router.patch('/content/:slug', verifyUser, update);
router.delete('/content/:slug', verifyUser, destroy);

export default router;