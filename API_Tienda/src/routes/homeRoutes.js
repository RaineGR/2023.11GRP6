import { Router } from 'express';
import { getProducts, getCategories } from '../controllers/homeController.js';

const router = Router();

router.get('/products', getProducts);
router.get('/categories', getCategories);

export default router;