const db = require('../db/database'); // db/database.jsからデータベース接続を読み込む

// 1. 全ての温泉情報を取得 (GET /api/onsen)
exports.getAllOnsen = (req, res) =>{
  const sql = 'SELECT * FROM hot_springs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      //サーバーエラー (500 Ineternal Server Error)
      console.error('温泉リスト取得エラー:', err.message); //デバック用
      res.status(500).json({ error: '温泉リストの取得中にエラーが発生しました。'});
      return;
    }
    //成功 (200 OK)
    res.status(200).json(rows);
  });
};

//2. 特定の温泉の詳細情報を取得 (GET /api/onsen/:id)
exports.getOnsenById = (req, res) => {
  const { id } = req.params; // URLパスから温泉IDを取得
  const sql = 'SELECT * FROM hot_springs WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      //サーバーエラー (500 Internal Server Error)
      console.error('温泉詳細取得エラー:', err.message); // デバッグ用
      res.status(500).json({ error: '温泉詳細の取得中にエラーが発生しました。'});
      return;
    }
    if (!row) {
      //指定されたIDの温泉が見つからない場合、404 Not Found
      res.status(404).json({ message: '指定された温泉が見つかりませんでした。'});
      return;
    }
    // 成功した場合、200 OKとともに取得した一行のデータをJSONで返す
    res.status(200).json(row);
  });
};

// 2-1 特定の温泉に対する評価とコメントを取得するAPI
exports.getRatingByOnsenId = (req, res) => {
  const { id } = req.params; // URLパスから温泉IDを取得
  const sql = 'SELECT * FROM ratings WHERE onsen_id = ?';
  db.all(sql, [id], (err, rows) => {
    if (err) {
      // サーバーエラー (500 Internal Server Error)
      console.error('温泉評価取得エラー:', err.message); // デバッグ用
      res.status(500).json({ error: '温泉評価の取得中にエラーが発生しました。'});
      return;
    }
    if (rows.length === 0) {
      // 評価が見つからない場合、404 Not Found
      res.status(404).json({ message: '指定された温泉の評価が見つかりませんでした。'});
      return;
    }
    // 成功した場合、200 OKとともに取得した評価のリストをJSONで返す
    res.status(200).json(rows); 
  });
}

//3. 特定の温泉に対する評価を投稿するAPI(POST /api/onsen/:id/rating)
// ユーザーから評価とコメントを受け取り、ratingsテーブルの保存、hot_springsテーブルの平均評価を更新。
exports.postRating = (req, res) =>{
  const onsenId = req.params.id;
  const { rating, comment } = req.body //リクエストbodyから評価値とコメントを取得

  console.log(`[POST Rating] Received request for onsenId: ${onsenId}, Rating: ${rating}, Comment: ${comment}`); // デバック用

  // 評価値が数値で、かつ1.0から5.0の範囲内かチェック
  if (typeof rating !== 'number' || rating < 1.0 || rating > 5.0) {
    //無効な入力の場合、 400 Bad Reqest
    console.log(`[POST Rating] Invalid rating value or type: ${rating} (Type: ${typeof rating})`); // デバック用
    res.status(400).json({
      error: '評価の値が無効です。',
      details: '評価は1.0から5.0の範囲で指定してください。'
    });
    return;
  }

  // 評価対象の温泉IDがhot_springsに存在するかチェック
  db.get('SELECT id FROM hot_springs WHERE id = ?', [onsenId], (err, row) => {
    if (err) {
      console.error('温泉存在チェックエラー:', err.message);
      res.status(500).json({ error: '評価対象の温泉確認中にエラーが発生しました。'});
      return;
    }
    if (!row) {
      // 評価対象の温泉が見つからない場合、 404 Not Found
      console.log(`[POST Rating] Onsen with ID ${onsenId} not found.`); // デバック用
      res.status(404).json({ message: '評価対象の温泉が見つかりませんでした。'});
      return;
    }

    // データベーストランザクションの開始
    // 複数のデータベース操作(評価の挿入と平均評価の更新)を原始的に実行するためにトランザクションを使用
    db.serialize(() => {
      db.run('BEGIN TRANSACTION;'); //トランザクション開始
      //1. ratingsテーブルに新しい評価を挿入
      const insertRatingSql = 'INSERT INTO ratings (onsen_id, rating_value, comment) VALUES (?, ?, ?)';

      db.run(insertRatingSql, [onsenId, rating, comment], function(err) {
        if (err) {
          db.run('ROLLBACK;');// エラー時はトランザクションを巻き戻し、変更を取り消す
          console.error('評価挿入エラー:', err.message);
          res.status(500).json({ error: '評価の投稿中にエラーが発生しました。'});
          return;
        }
        console.log(`[POST Rating] Rating inserted for onsenId: ${onsenId}. New rating ID: ${this.lastID}`); // デバック用
        //2. hot_springsテーブルの平均評価を再計算して更新
        // 新しく挿入された評価を含めて、大正温泉のすべての評価の平均を計算し、hot_springsテーブルのratingカラムを更新
        const updateOnsenRatingSql = `
          UPDATE hot_springs
          SET rating = (SELECT AVG(rating_value) FROM ratings WHERE onsen_id = ?),
            updated_at = CURRENT_TIMESTAMP
          WHERE id = ?;
        `;
        db.run(updateOnsenRatingSql, [onsenId, onsenId], function(err) {
          if (err) {
            db.run(`ROLLBACK;`);
            console.error('平均評価の更新エラー:', err.message);
            res.status(500).json({ error: '平均評価更新中にエラーが発生しました'});
            return;
          }
          console.log(`[POST Rating] Hot_springs rating updated for onsenId: ${onsenId}. Changes: ${this.changes}`); // デバック用
          
          //3. 更新された温泉オブジェクト全体を取得してクライアントに返す。
          // クライアントの最新の平均評価は含まれた温泉情報を返すため
          const getUpdatedOnsenSql = 'SELECT * FROM hot_springs WHERE id = ?';
          db.get(getUpdatedOnsenSql, [onsenId], (err, row) => {
            if (err) {
              db.run(`ROLLBACK;`);
              console.error('更新された温泉所法の取得エラー', err.message);
              res.status(500).json({ error: '更新された温泉情報の取得中にエラーが発生しました。'});
              return;
            }
            if (!row) {
              // 念のためにここまで書いておく(更新後に情報は見つからない場合)
              db.run(`ROLLBACK;`);
              res.status(404).json({ message: '評価後の温泉所法が見つかりませんでした。'});
              return;
            }

            db.run('COMMIT;'); //すべての操作が成功、 コミットする。
            res.status(200).json(row); // 更新された温泉オブジェクトをJSONで返す
          });
        });
      });
    });
  });
};
