import { Router } from 'express';
import { createItem, getItemsByMerchant } from '../controllers/itemController.js';

const router = Router();

router.post('/merchants/:merchantId/items', createItem);
router.get('/merchants/:merchantId/items', getItemsByMerchant);

export default router;
