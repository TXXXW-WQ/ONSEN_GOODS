const express = require('express');
const router = express.Router();
const onsenController = require('../controllers/onsenController');
const authController = require('../controllers/authController');
const editOnsenName = require('../controllers/editOnsenName');
const highRole = require('../controllers/roleCheck/highRole');
const middleRole = require('../controllers/roleCheck/middleRole');
const lowRole = require('../controllers/roleCheck/lowRole');
const addOnsenName = require('../controllers/addOnsenName');
const editdescription = require('../controllers/editDiscription')
const authenticateJWT = require('../middleware/auth'); // JWT認証ミドルウェアを読み込む


// 認証・認可
router.post('/register', authController.register);
router.post('/login', authController.login);

// ログイン中のユーザー情報を取得するエンドポイント
router.get('/me', authenticateJWT, authController.checkLogin);

// ログアウトエンドポイント
router.post('/logout', authenticateJWT, authController.logout);

// roleの検証
router.post('/rolecheck/high', authenticateJWT, highRole.highRole)
router.post('/rolecheck/middle', authenticateJWT, middleRole.middleRole)
router.post('/rolecheck/low', authenticateJWT, lowRole.lowRole)

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

// 新しい温泉を追加するAPIエンドポイント
router.post('/add', authenticateJWT, addOnsenName.addOnsenName);

// 温泉の各情報(現在は施設情報のみ)に対するgood/badの数を更新する
router.put('/:id/facilities', authenticateJWT, onsenController.postGoodAndBad)

// 温泉の名前を編集するAPIエンドポイント
router.put('/:id/nameedit', authenticateJWT, editOnsenName.editOnsenName);

// 温泉の説明を編集する
router.put('/:id/editdescription', authenticateJWT, editdescription.editdescription)

module.exports = router;