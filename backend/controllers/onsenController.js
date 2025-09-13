const db = require('../db/database'); // db/database.jsからデータベース接続を読み込む
const { updateUserContribution } = require('./util/upContribution'); // 貢献度更新関数をインポート
const { checkLogin } = require('./authController');


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
      return res.status(404).json({ message: '指定された温泉が見つかりませんでした。' });
    }

    // 各設備の「あり率」を集計
    const facilities = [
      'cold_bath',
      'sauna',
      'rotenburo',
      'outdoor',
      'bubble_bath',
      'jet_bath',
      'shampoo'
    ];
    // 1回のクエリで全設備カラムを一括反映
    await db.query(
      `
      UPDATE hot_springs
      SET
        cold_bath = COALESCE((
          SELECT CASE
            WHEN COUNT(*) FILTER (WHERE r.cold_bath IS TRUE) > COUNT(*) FILTER (WHERE r.cold_bath IS FALSE) THEN TRUE
            WHEN COUNT(*) FILTER (WHERE r.cold_bath IS TRUE) < COUNT(*) FILTER (WHERE r.cold_bath IS FALSE) THEN FALSE
            WHEN COUNT(*) FILTER (WHERE r.cold_bath IS TRUE) = 0 AND COUNT(*) FILTER (WHERE r.cold_bath IS FALSE) = 0 THEN FALSE
            ELSE FALSE
          END
          FROM ratings r WHERE r.hot_spring_id = hot_springs.id
        ), FALSE),
        sauna = COALESCE((
          SELECT CASE
            WHEN COUNT(*) FILTER (WHERE r.sauna IS TRUE) > COUNT(*) FILTER (WHERE r.sauna IS FALSE) THEN TRUE
            WHEN COUNT(*) FILTER (WHERE r.sauna IS TRUE) < COUNT(*) FILTER (WHERE r.sauna IS FALSE) THEN FALSE
            WHEN COUNT(*) FILTER (WHERE r.sauna IS TRUE) = 0 AND COUNT(*) FILTER (WHERE r.sauna IS FALSE) = 0 THEN FALSE
            ELSE FALSE
          END
          FROM ratings r WHERE r.hot_spring_id = hot_springs.id
        ), FALSE),
        rotenburo = COALESCE((
          SELECT CASE
            WHEN COUNT(*) FILTER (WHERE r.rotenburo IS TRUE) > COUNT(*) FILTER (WHERE r.rotenburo IS FALSE) THEN TRUE
            WHEN COUNT(*) FILTER (WHERE r.rotenburo IS TRUE) < COUNT(*) FILTER (WHERE r.rotenburo IS FALSE) THEN FALSE
            WHEN COUNT(*) FILTER (WHERE r.rotenburo IS TRUE) = 0 AND COUNT(*) FILTER (WHERE r.rotenburo IS FALSE) = 0 THEN FALSE
            ELSE FALSE
          END
          FROM ratings r WHERE r.hot_spring_id = hot_springs.id
        ), FALSE),
        outdoor = COALESCE((
          SELECT CASE
            WHEN COUNT(*) FILTER (WHERE r.outdoor IS TRUE) > COUNT(*) FILTER (WHERE r.outdoor IS FALSE) THEN TRUE
            WHEN COUNT(*) FILTER (WHERE r.outdoor IS TRUE) < COUNT(*) FILTER (WHERE r.outdoor IS FALSE) THEN FALSE
            WHEN COUNT(*) FILTER (WHERE r.outdoor IS TRUE) = 0 AND COUNT(*) FILTER (WHERE r.outdoor IS FALSE) = 0 THEN FALSE
            ELSE FALSE
          END
          FROM ratings r WHERE r.hot_spring_id = hot_springs.id
        ), FALSE),
        bubble_bath = COALESCE((
          SELECT CASE
            WHEN COUNT(*) FILTER (WHERE r.bubble_bath IS TRUE) > COUNT(*) FILTER (WHERE r.bubble_bath IS FALSE) THEN TRUE
            WHEN COUNT(*) FILTER (WHERE r.bubble_bath IS TRUE) < COUNT(*) FILTER (WHERE r.bubble_bath IS FALSE) THEN FALSE
            WHEN COUNT(*) FILTER (WHERE r.bubble_bath IS TRUE) = 0 AND COUNT(*) FILTER (WHERE r.bubble_bath IS FALSE) = 0 THEN FALSE
            ELSE FALSE
          END
          FROM ratings r WHERE r.hot_spring_id = hot_springs.id
        ), FALSE),
        jet_bath = COALESCE((
          SELECT CASE
            WHEN COUNT(*) FILTER (WHERE r.jet_bath IS TRUE) > COUNT(*) FILTER (WHERE r.jet_bath IS FALSE) THEN TRUE
            WHEN COUNT(*) FILTER (WHERE r.jet_bath IS TRUE) < COUNT(*) FILTER (WHERE r.jet_bath IS FALSE) THEN FALSE
            WHEN COUNT(*) FILTER (WHERE r.jet_bath IS TRUE) = 0 AND COUNT(*) FILTER (WHERE r.jet_bath IS FALSE) = 0 THEN FALSE
            ELSE FALSE
          END
          FROM ratings r WHERE r.hot_spring_id = hot_springs.id
        ), FALSE),
        shampoo = COALESCE((
          SELECT CASE
            WHEN COUNT(*) FILTER (WHERE r.shampoo IS TRUE) > COUNT(*) FILTER (WHERE r.shampoo IS FALSE) THEN TRUE
            WHEN COUNT(*) FILTER (WHERE r.shampoo IS TRUE) < COUNT(*) FILTER (WHERE r.shampoo IS FALSE) THEN FALSE
            WHEN COUNT(*) FILTER (WHERE r.shampoo IS TRUE) = 0 AND COUNT(*) FILTER (WHERE r.shampoo IS FALSE) = 0 THEN FALSE
            ELSE FALSE
          END
          FROM ratings r WHERE r.hot_spring_id = hot_springs.id
        ), FALSE)
      WHERE id = $1
      `,
      [id]
    );
    const rateQuery = `
      SELECT
        COUNT(*) FILTER (WHERE cold_bath IS TRUE) AS cold_bath_true,
        COUNT(*) FILTER (WHERE cold_bath IS NOT NULL) AS cold_bath_total,
        COUNT(*) FILTER (WHERE sauna IS TRUE) AS sauna_true,
        COUNT(*) FILTER (WHERE sauna IS NOT NULL) AS sauna_total,
        COUNT(*) FILTER (WHERE rotenburo IS TRUE) AS rotenburo_true,
        COUNT(*) FILTER (WHERE rotenburo IS NOT NULL) AS rotenburo_total,
        COUNT(*) FILTER (WHERE outdoor IS TRUE) AS outdoor_true,
        COUNT(*) FILTER (WHERE outdoor IS NOT NULL) AS outdoor_total,
        COUNT(*) FILTER (WHERE bubble_bath IS TRUE) AS bubble_bath_true,
        COUNT(*) FILTER (WHERE bubble_bath IS NOT NULL) AS bubble_bath_total,
        COUNT(*) FILTER (WHERE jet_bath IS TRUE) AS jet_bath_true,
        COUNT(*) FILTER (WHERE jet_bath IS NOT NULL) AS jet_bath_total,
        COUNT(*) FILTER (WHERE shampoo IS TRUE) AS shampoo_true,
        COUNT(*) FILTER (WHERE shampoo IS NOT NULL) AS shampoo_total
      FROM ratings
      WHERE hot_spring_id = $1
    `;
    const rateResult = await db.query(rateQuery, [id]);
    const rateRow = rateResult.rows[0];

    const facilityRates = {};
    facilities.forEach(facility => {
      const trueCount = Number(rateRow[`${facility}_true`]);
      const totalCount = Number(rateRow[`${facility}_total`]);
      facilityRates[facility] = {
        percent: totalCount > 0 ? Math.round((trueCount / totalCount) * 1000) / 10 : null,
        trueCount,
        totalCount
      };
    });

    // 温泉情報にfacilityRatesを追加して返す
    const onsen = result.rows[0];
    onsen.facilityRates = facilityRates;

    // 最新の平均評価を計算して反映
    await db.query(`
      UPDATE hot_springs
      SET rating = (
        SELECT AVG(rating) FROM ratings WHERE hot_spring_id = $1
      )
      WHERE id = $1
    `, [id]);


    res.status(200).json(onsen);
  } catch (err) {
    console.error('温泉詳細取得エラー:', err.message);
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
  const userId = req.user.id;
  const {rating, comment} = req.body // リクエストボディから評価とコメントを取得

  
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
    // 評価＋設備を挿入
    await client.query(
      `INSERT INTO ratings (
        hot_spring_id, user_id, rating, comment
      ) VALUES ($1, $2, $3, $4)`,
      [
        onsenId,
        userId,
        rating,
        comment
      ]
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
}

// 各情報の評価(good/bad)をpostするapi
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
        if (ratingType === true || ratingType === false) {
          const goodColumnName = `${facility}_good`;
          const badColumnName = `${facility}_bad`;

          if (ratingType === true) {
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

// 温泉を追加するAPI
// 温泉名、所在地、説明、画像urlが飛んでくる予定
// Home,もしくはHomeから飛べる専用ページから呼ばれる
exports.addOnsenName = async (req, res) => {
  
  const userId = req.body.userId
  const name = req.body.name;
  const location = req.body.location || null;
  const description = req.body.description || '';
  const imageUrl = req.body.imageUrl || null;

  // ユーザーの権限の確認
  const userRole = await db.query(`SELECT role FROM users WHERE id = $1`, [userId]);
  if (userRole.rows.length === 0 || userRole.rows[0].role === '探湯者' || userRole.rows[0].role === '温泉家') {
    return res.status(403).json({ error: '温泉追加の権限がありません。' });
  }

  // 入力された温泉名の確認
  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: '有効な温泉名を提供してください。' });
  }

  try {
    
    // 温泉の追加実行
    const result = await db.query(`
      INSERT INTO hot_springs (
      name, location, description, created_at
      ) VALUES ($1, $2, $3, NOW())
      RETURNING *;
    `, [name.trim(), location, description, imageUrl]);
    
    res.status(201).json({ message: '温泉が正常に追加されました。', onsen: result.rows[0] });
  } catch (err) {
    console.error('温泉追加エラー:', err.message);  
  }
}