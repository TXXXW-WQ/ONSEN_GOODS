const sqlite3 = require('sqlite3').verbose();
const path = require('path');

//データベースファイルのファイルパスを定義
const dbPath = path.resolve(__dirname, 'onsen.db');

//データベースに接続
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('データベース接続エラー:', err.message);
  } else {
    console.log('データベースに接続しました:', dbPath);
    //データベースの初期化とテーブル作成
    db.serialize(() => {
      //hot_springsテーブル作成
      db.run(`
        CREATE TABLE IF NOT EXISTS hot_springs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          location TEXT NOT NULL,
          rating REAL NOT NULL DEFAULT 0.0,
          description TEXT,
          image_url TEXT,
          facilities TEXT, -- 設備情報("サウナ,露天風呂,水風呂")
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
        )
      `, (err) => {
        if (err) {
          console.error('hot_springsテーブル作成エラー:', err.message);
        } else {
          console.log('hot_springsテーブルが準備できました。');
          //書記データの挿入 (IF IGNORE は既にあれば挿入しない)
          //画像URLはダミーのプレースホルダーサービスを使用
          db.run(`INSERT OR IGNORE INTO hot_springs (id, name, location, rating, description, image_url, facilities) VALUES
            (1, 'せせらぎの湯 花水木', '鹿児島県日置市伊集院町大田2768', 4.5, 'だいぶ山奥にあって行きづらいが、露天風呂が最高。', 'https://via.placeholder.com/300x200/FF5733/FFFFFF?text=Kusatsu', '露天風呂,サウナ,水ぶろ,外気浴' ),
            (2, '硫黄谷温泉 霧島ホテル' '鹿児島県霧島市牧園町高千穂3948', 4.9, '鹿児島で最大の温泉、規格外。' 'https://via.placeholder.com/300x200/33FF57/FFFFFF?text=Hakone', '露天風呂,サウナ,水風呂,外気浴'),
            (3, '芦刈温泉', '鹿児島県鹿児島市若葉町45-1', 4.7,'鹿児島市内から気軽に行ける温泉、入っていて楽しい。', 'https://via.placeholder.com/300x200/3357FF/FFFFFF?text=Noboribetsu', '露天風呂,サウナ,水風呂')
          `);
        }
      });

      //ratings テーブルの作成
      db.run(`
        CREATE TABLE IF NOT EXISTS ratings(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          onsen_id INTEGER NOT NULL,
          rating_value REAL NOT NULL,
          comment TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
          FOREIGN KEY (onsen_id) REFERENCES hot_springs(id) ON DELETE CASCADE
        )
      `,(err) => {
        if (err) {
          console.error('ratingsテーブル作成エラー:', err.message);
        } else {
          console.log('ratingsテーブルが準備できました。');
          // rating初期データ
          db.run(`INSERT OR IGNORE INTO ratings (id, onsen_id, rating_value, comment) VALUES
            (1, 1, 5.0, '最高のお湯でした。'),
            (2, 2, 4.5, '中央にある噴水は圧巻でした。'),
            (3, 3, 4.0, 'サウナと水風呂が最高でした。')
          `);
        }
      });
      
    });
  }
});

module.exports = db;