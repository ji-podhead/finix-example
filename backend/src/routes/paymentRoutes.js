import { Router } from 'express';
import { createPaymentInstrument, createTransfer, createBankAccountPaymentInstrument, createTokenPaymentInstrument } from '../controllers/paymentController.js';

const router = Router();

router.post('/payment_instruments', createPaymentInstrument);
router.post('/bank_account_payment_instruments', createBankAccountPaymentInstrument);
router.post('/token_payment_instruments', createTokenPaymentInstrument);
router.post('/transfers', createTransfer);

export default router;
