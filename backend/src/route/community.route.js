import express from 'express';
import { getCommunity, getCommunities, createCommunity, leaveCommunity, joinCommunity, updateCommunityStatus } from '../controller/community.control.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getCommunities);
router.get('/:id', getCommunity);
router.post('/', createCommunity);
router.patch('/:id/status', updateCommunityStatus);
router.delete('/:id', leaveCommunity);
router.post('/:id/join', joinCommunity);


export default router;