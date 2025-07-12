const express = require('express');
const router = express.Router();
const onsenController = require('../controllers/onsenController');
 
// すべての温泉情報を取得するAPIエンドポイント
// GET /api/onsen
router.get('/', onsenController.getAllOnsen);

// 特定の温泉情報を取得するAPIエンドポイント
// GET /api/onsen/:id
router.get('/:id', onsenController.getOnsenById);

// 特定の温泉に対する評価を投稿するAPIエンドポイント
// POST /api/onsen/:id/rating
router.post('/:id/rating', onsenController.postRating);

module.exports = router;