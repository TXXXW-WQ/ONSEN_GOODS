const db = require('../db/database'); // db/database.jsからデータベース接続を読み込む
const { updateUserContribution } = require('./util/contribution'); // 貢献度更新関数をインポート
// 1. 全ての温泉情報を取得 (GET /api/onsen)
exports.getAllOnsen = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM hot_springs');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('温泉リスト取得エラー:', err.message);
    res.status(500).json({ error: '温泉リストの取得中にエラーが発生しました。' });
  }
}

//2. 特定の温泉の詳細情報を取得 (GET /api/onsen/:id)
exports.getOnsenById = async (req, res) => {
  const { id } = req.params; // URLパスから温泉IDを取得
  try {
    const result = await db.query('SELECT * FROM hot_springs WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      // 温泉が見つからない場合、404 Not Found
      return res.status(404).json({ message: '指定された温泉が見つかりませんでした。' });
    }
    // 最新の平均評価を計算して反映
    await db.query(`
      UPDATE hot_springs
      SET rating = (
        SELECT AVG(rating) FROM ratings WHERE hot_spring_id = $1
      )
      WHERE id = $1
    `, [id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('温泉詳細取得エラー:', err.message); // デバッグ用
    return res.status(500).json({ error: '温泉詳細の取得中にエラーが発生しました。' });
  }
};

// 2-1 特定の温泉に対する評価とコメントを取得するAPI
exports.getRatingByOnsenId = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM ratings WHERE hot_spring_id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: '指定された温泉の評価が見つかりませんでした。' });
    }
    res.status(200).json(result.rows); // 評価とコメントのリストを返す
  } catch (err) {
    console.error('温泉評価取得エラー:', err.message);
    res.status(500).json({ error: '温泉評価の取得中にエラーが発生しました。' });
  }
};

//3. 特定の温泉に対する評価を投稿するAPI(POST /api/onsen/:id/rating)
// ユーザーから評価とコメントを受け取り、ratingsテーブルの保存、hot_springsテーブルの平均評価を更新。
exports.postRating = async (req, res) => {
  const onsenId = req.params.id; // URLパラメータから温泉IDを取得
  const { userId = 1, rating, comment } = req.body; // リクエストボディから評価とコメントを取得

  
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({
      error: '評価の値が無効です。',
      details: '評価は0.0から5.0の範囲で指定してください。'
    });
  }

  const client = await db.connect(); // データベース接続を取得
  try {

    // 温泉の存在をチェック
    const onsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1', [onsenId]);
    if (onsenResult.rows.length === 0) {
      res.status(404).json({ error: '評価対象の温泉が見つかりません。' });
      return;
    }

    await client.query('BEGIN'); // トランザクション開始
    // 評価を挿入
    await client.query(
      'INSERT INTO ratings (hot_spring_id, user_id, rating, comment) VALUES ($1, $2, $3, $4)',
      [onsenId, userId, rating, comment]
    );

    // ユーザーのレビュー数と貢献度を増やす
    await updateUserContribution(client, userId, 'review_count');

    // 平均の評価を再計算して更新
    await client.query(`
      UPDATE hot_springs
      SET rating = (
        SELECT AVG(rating) FROM ratings WHERE hot_spring_id = $1
      )
      WHERE id = $1
    `, [onsenId]);

    // 更新後の温泉情報を取得
    const updatedOnsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1', [onsenId]);
    await client.query('COMMIT'); // トランザクションをコミット
    res.status(200).json(updatedOnsenResult.rows[0]); // 更新された温泉情報を返す
  } catch (err) {
    await client.query('ROLLBACK'); // エラー時はロールバック
    console.error('評価投稿エラー', err.message);
    res.status(500).json({ error: '評価の投稿中にエラーが発生しました。' });
  } finally {
    client.release();
  }
};

// 設備情報を取得してから更新するAPI (PUT /api/onsen/:id/facilities)
exports.editOnsenFacilities = async (req, res) => {
  const onsenId = req.params.id;
  const {
    cold_bath,
    sauna,
    rotenburo,
    outdoor,
    bubble_bath,
    jet_bath,
    shampoo
  } = req.body;

  try {
    // まず現在の設備情報を取得
    const currentResult = await db.query(
      `SELECT cold_bath, sauna, rotenburo, outdoor, bubble_bath, jet_bath, shampoo
       FROM hot_springs WHERE id = $1`,
      [onsenId]
    );
    if (currentResult.rows.length === 0) {
      return res.status(404).json({ error: '温泉が見つかりません。' });
    }

    // 設備情報を更新
    const result = await db.query(
      `UPDATE hot_springs
       SET
         cold_bath = $1,
         sauna = $2,
         rotenburo = $3,
         outdoor = $4,
         bubble_bath = $5,
         jet_bath = $6,
         shampoo = $7
       WHERE id = $8
       RETURNING *`,
      [
        cold_bath,
        sauna,
        rotenburo,
        outdoor,
        bubble_bath,
        jet_bath,
        shampoo,
        onsenId
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('設備編集エラー:', err.message);
    res.status(500).json({ error: '設備情報の更新中にエラーが発生しました。' });
  }
};

// 各情報の評価(good/bad)をpostするapi
// dbはpg.Poolインスタンスとして定義されていると仮定
exports.postGoodAndBad = async (req, res) => {
  const onsenId = req.params.id;
  const updates = req.body;

  let client;
  try {
    //  クライアントを接続し、トランザクションを開始
    client = await db.connect();
    await client.query('BEGIN');

    // FOR UPDATE を使用して行をロック
    const onsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1 FOR UPDATE', [onsenId]);
    if (onsenResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: '評価対象の温泉が見つかりません。' });
    }
    const currentOnsen = onsenResult.rows[0];

    const updateFields = [];
    const updateValues = [];

    // good/bad値を計算
    for (const facility in updates) {
      if (updates.hasOwnProperty(facility)) {
        const ratingType = updates[facility];
        if (ratingType === 'good' || ratingType === 'bad') {
          const goodColumnName = `${facility}_good`;
          const badColumnName = `${facility}_bad`;

          if (ratingType === 'good') {
            currentOnsen[goodColumnName]++;
          } else {
            currentOnsen[badColumnName]++;
          }

          const newFacilityValue = currentOnsen[goodColumnName] > currentOnsen[badColumnName];

          updateFields.push(`${goodColumnName} = $${updateValues.length + 1}`);
          updateValues.push(currentOnsen[goodColumnName]);
          updateFields.push(`${badColumnName} = $${updateValues.length + 1}`);
          updateValues.push(currentOnsen[badColumnName]);
          updateFields.push(`${facility} = $${updateValues.length + 1}`);
          updateValues.push(newFacilityValue);
        }
      }
    }

    if (updateFields.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: '有効な評価データがありません。' });
    }

    // 値を更新
    const query = `
      UPDATE hot_springs
      SET ${updateFields.join(', ')}
      WHERE id = $${updateValues.length + 1}
      RETURNING *;
    `;
    updateValues.push(onsenId);

    const result = await client.query(query, updateValues);
    
    // 5. トランザクションをコミット
    await client.query('COMMIT');
    
    res.status(200).json({
      message: '施設評価が更新されました',
      onsen: result.rows[0],
    });

  } catch (err) {
    // エラー時はトランザクションをロールバック
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Good/Bad評価エラー:', err.message);
    res.status(500).json({ error: 'Good/Bad評価の更新中にエラーが発生しました。' });
  } finally {
    if (client) {
      client.release();
    }
  }
};