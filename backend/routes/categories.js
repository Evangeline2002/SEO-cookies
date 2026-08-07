import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from '../middleware/auth.js';
import { getAll, getById, create, update, remove } from '../controllers/categoryController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname.replace(/\\s+/g, '-')}`);
    }
});

const upload = multer({ storage });

const router = Router();

// Temporarily removing auth from GET for frontend display
router.get('/', getAll);
router.get('/:id', getById);

// Admin authenticated routes
router.post('/', auth, upload.single('category_image'), create);
router.put('/:id', auth, upload.single('category_image'), update);
router.delete('/:id', auth, remove);

export default router;
