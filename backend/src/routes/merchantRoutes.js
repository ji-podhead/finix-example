import { Router } from 'express';
import { createMerchant, getMerchants, createMerchantIdentity } from '../controllers/merchantController.js';

const router = Router();

router.post('/create_merchant', createMerchant);
router.get('/merchants', getMerchants);
router.post('/create-merchant-identity', createMerchantIdentity);

export default router;
