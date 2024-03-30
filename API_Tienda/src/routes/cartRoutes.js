import { Router } from 'express';
import { addToCart, removeFromCart, getCartProducts, clearCart } from '../controllers/cartController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/add/:productId', authMiddleware, addToCart);
router.delete('/remove/:productId', authMiddleware, removeFromCart);
router.get('/products', authMiddleware, getCartProducts);
router.delete('/clear', authMiddleware, clearCart);

export default router;