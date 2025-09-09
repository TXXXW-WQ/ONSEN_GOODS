const express = require('express');
const router = express.Router();
const onsenController = require('../controllers/onsenController');
const authController = require('../controllers/authController');
const authenticateJWT = require('../middleware/auth'); // JWT認証ミドルウェアを読み込む

// 認証・認可
router.post('/register', authController.register);
router.post('/login', authController.login);

// ログイン中のユーザー情報を取得するエンドポイント
router.get('/me', authenticateJWT, authController.checkLogin);

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

// 特定の温泉の設備情報を更新するAPIエンドポイント
// PUT /api/onsen/:id/facilities
// router.put('/:id/facilities', authenticateJWT, onsenController.editOnsenFacilities);

// 温泉の各情報(現在は施設情報のみ)に対するgood/badの数を更新する
router.post('/:id/facilities', onsenController.postGoodAndBad)




module.exports = router;