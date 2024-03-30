import { Router } from 'express';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/productController.js';
import { authMiddleware, adminMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', getProducts);
router.post('/', authMiddleware, adminMiddleware, createProduct);
router.put('/:productId', authMiddleware, adminMiddleware, updateProduct);
router.delete('/:productId', authMiddleware, adminMiddleware, deleteProduct);

export default router;