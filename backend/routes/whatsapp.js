import { Router } from 'express';
import auth from '../middleware/auth.js';
import {
    getWhatsAppLogs,
    sendWhatsApp,
    resendWhatsApp,
    verifyWebhook,
    handleWebhook
} from '../controllers/whatsappController.js';

const router = Router();

router.get('/logs', auth, getWhatsAppLogs);
router.post('/send/:orderId', auth, sendWhatsApp);
router.post('/resend/:id', auth, resendWhatsApp);

router.get('/webhook', verifyWebhook);
router.post('/webhook', handleWebhook);

export default router;
