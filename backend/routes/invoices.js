import { Router } from 'express';
import auth from '../middleware/auth.js';
import { getAllInvoices, getInvoiceById, updateInvoice, downloadInvoicePDF, deleteInvoice, resendInvoice } from '../controllers/invoiceController.js';

const router = Router();

router.get('/', auth, getAllInvoices);
router.get('/:id', auth, getInvoiceById);
router.put('/:id', auth, updateInvoice);
router.get('/:id/download', auth, downloadInvoicePDF);
router.post('/:id/resend', auth, resendInvoice);
router.delete('/:id', auth, deleteInvoice);

export default router;
