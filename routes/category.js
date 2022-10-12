import express from 'express';
import {index, list_by_tier, store, detail, update, destroy} from '../controllers/CategoryController.js';
import {verifyUser, adminOnly} from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/category', verifyUser, index);
router.get('/category/:tier', verifyUser, list_by_tier);
router.post('/category', verifyUser, store);
router.get('/category/:id/detail', detail);
router.patch('/category/:id', verifyUser, update);
router.delete('/category/:id', verifyUser, destroy);

export default router;
