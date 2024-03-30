import { Router } from 'express';
import { createPaypalOrder, capturePaypalOrder } from '../controllers/checkoutController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js'; 

const router = Router();

router.post('/create-order', authMiddleware, createPaypalOrder); 
router.get('/capture-order', authMiddleware, capturePaypalOrder); 

export default router;