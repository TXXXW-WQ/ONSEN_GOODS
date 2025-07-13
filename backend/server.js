const express = require('express');
const cors = require('cors'); //CORSミドルウェアを読み込む
const onsenRoutes = require('./routes/onsen'); //APIルートファイルを読み込む
const path = require('path') //Node.jsのパスユーティリティを読み込む(念のため)

const app = express();
const port = 3000;

// ミドルウェアの設定
app.use(cors()); // 全てのオリジンからのリクエストを許可(開発用)
app.use(express.json());

//データベース接続の初期化
require('./db/database'); // database.js内のSQLiteデータベース接続、テーブル作成、初期データ挿入が実行される。

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
