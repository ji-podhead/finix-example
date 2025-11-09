import { Router } from 'express';
import { createPaymentInstrument, createTransfer } from '../controllers/paymentController.js';

const router = Router();

router.post('/create-payment-instrument', createPaymentInstrument);
router.post('/create-transfer', createTransfer);

export default router;
