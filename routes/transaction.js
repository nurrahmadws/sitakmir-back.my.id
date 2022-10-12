import expres from 'express';
import {index, ordinaryIndex, store, detail, update, destroy, sumIncome, monthlyReport} from '../controllers/TransactionController.js';
import {verifyUser, adminOnly} from '../middleware/AuthUser.js';

const router = expres.Router();

router.get('/transaction', index);
router.get('/transaction/ordinaryIndex', verifyUser, ordinaryIndex);
router.get('/transaction/report', sumIncome);
router.get('/transaction/:date/monthly_report', monthlyReport);
router.post('/transaction', verifyUser, store);
router.get('/transaction/:id', verifyUser, detail);
router.patch('/transaction/:id', verifyUser, update);
router.delete('/transaction/:id', verifyUser, destroy);

export default router;