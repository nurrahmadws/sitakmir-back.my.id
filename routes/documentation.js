import express from 'express';
import {index, store, detail, update, destroy} from '../controllers/DocumentationController.js';
import {verifyUser, adminOnly} from '../middleware/AuthUser.js';

const router = express.Router();

router.get('/documentation', index);
router.post('/documentation', verifyUser, store);
router.get('/documentation/:id', detail);
router.patch('/documentation/:id', verifyUser, update);
router.delete('/documentation/:id', verifyUser, destroy);

export default router;