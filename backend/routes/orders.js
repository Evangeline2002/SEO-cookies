import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getAll, getById, updateStatus, updateOrder, remove, createOrder } from '../controllers/orderController.js';

const router = Router();

router.post('/', createOrder);
router.get('/', auth, getAll);
router.get('/:id', auth, getById);
router.put('/:id/status', auth, updateStatus);
router.put('/:id', auth, updateOrder);
router.delete('/:id', auth, remove);

export default router;
