import { Router } from 'express';
import { getPurchases, getPurchaseStatus } from '../controllers/purchaseController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', authMiddleware, getPurchases);
router.get('/:orderId/status', authMiddleware, getPurchaseStatus);

export default router;