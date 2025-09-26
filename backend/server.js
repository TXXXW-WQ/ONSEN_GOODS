const cors = require('cors') // CORSミドルウェアを読み込む

const express = require('express');
const onsenRoutes = require('./routes/onsen'); //APIルートファイルを読み込む
const path = require('path') //Node.jsのパスユーティリティを読み込む(念のため)
const cookieParser = require('cookie-parser'); //Cookieパーサーミドルウェアを読み込む



const app = express();
const port = 3000;

// CORSの設定
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};

// Cookieパーサーミドルウェアを使用
app.use(cookieParser());

// ミドルウェアの設定
app.use(cors(corsOptions));
app.use(express.json());

//データベースへの接続と初期化
require('./db/database');
require('./db/setup-db')

// APIルートの定義
// '/api/onsen' から始まるすべてのリクエストは、onsenRoutes.jsで定義されたルーティングに渡される。
app.use('/api/onsen', onsenRoutes);

// ルートエンドポイント (サーバーが正しく起動しているかどうかを確認)
app.get('/', (req, res) => {
  res.send('ONSEN_GOODS Backend API is running!');
});

// サーバーの起動
app.listen(port, () => {
  console.log(`ONSEN_GOODS Backend API listening at http://localhost:${port}`);
});

