import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from '../middleware/auth.js';
import { getAll, getById, getByCategory, create, update, remove } from '../controllers/productController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import fs from 'fs';
import { getImage } from '../controllers/productController.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = Router();

// Temporarily removing auth from GET for frontend store display
router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/image', getImage);
router.get('/category/:categoryId', getByCategory);

// Admin authenticated routes
router.post('/', auth, upload.single('product_image'), create);
router.put('/:id', auth, upload.single('product_image'), update);
router.delete('/:id', auth, remove);

export default router;
