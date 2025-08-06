const express = require('express');
const router = express.Router();
const onsenController = require('../controllers/onsenController');
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/auth'); // JWT認証ミドルウェアを読み込む

// 認証・認可
router.post('/register', authController.register);
router.post('/login', authController.login);
 
// すべての温泉情報を取得するAPIエンドポイント
// GET /api/onsen
router.get('/', onsenController.getAllOnsen);

// 特定の温泉情報を取得するAPIエンドポイント
// GET /api/onsen/:id
router.get('/:id', onsenController.getOnsenById);

// 特定の温泉に対する評価とコメントを取得するエンドポイント
router.get('/:id/rating', onsenController.getRatingByOnsenId);

// 特定の温泉に対する評価を投稿するAPIエンドポイント
// POST /api/onsen/:id/rating
router.post('/:id/rating', authenticateJWT,onsenController.postRating);

module.exports = router;