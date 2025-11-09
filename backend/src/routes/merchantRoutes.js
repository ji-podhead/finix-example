import { Router } from 'express';
import { createIdentity, createMerchant, getMerchants } from '../controllers/merchantController.js';

const router = Router();

router.post('/identities', createIdentity);
router.post('/identities/:identityId/merchants', createMerchant);
router.get('/merchants', getMerchants);

export default router;
