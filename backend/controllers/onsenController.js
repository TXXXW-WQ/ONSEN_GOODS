const db = require('../db/database'); // db/database.jsからデータベース接続を読み込む

// 1. 全てのおんっせん情報を取得 (GET /api/onsen)
exports.getALLOnsen = (req, res) =>{
  const sql = 'SELECT * FROM hot_springs';
  db.all(sql, [], (err, rows) => {
    if (err) {
      //サーバーエラー (500 Ineternal Server Error)
      res.status(500).json({ error: '温泉リストの取得中にエラーが発生しました。'});
      return;
    }
    //成功 (200 OK)
    res.status(200).json(rows)
  });
};

//2. 特定の温泉の詳細情報を取得 (GET /api/onsen/:id)
exports.getOnsenById = (req, res) => {
  const { id } = req.params; // URLパスから温泉IDを取得
  const sql = 'SELECT * FORM hot_springs WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      //サーバーエラー (500 Internal Server Error)
      res.status(500).json({ error: '温泉詳細の取得中にエラーが発生しました。'});
    }
  })
}
