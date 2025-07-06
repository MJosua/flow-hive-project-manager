
const express = require('express');
const router = express.Router();
const { decodeTokenHT } = require('../../config/encrypts');
const approvalController = require('../controllers/approval_controller');

// Approval management
router.get('/pending', decodeTokenHT, approvalController.getPendingApprovals);
router.post('/:id/process', decodeTokenHT, approvalController.processApproval);
router.get('/history', decodeTokenHT, approvalController.getApprovalHistory);
router.get('/stats', decodeTokenHT, approvalController.getApprovalStats);

module.exports = router;
