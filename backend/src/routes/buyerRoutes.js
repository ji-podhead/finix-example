import { Router } from 'express';
import { createBuyer, getIdentities } from '../controllers/buyerController.js';

const router = Router();

router.post('/buyers', createBuyer);
router.get('/identities', getIdentities);

export default router;
