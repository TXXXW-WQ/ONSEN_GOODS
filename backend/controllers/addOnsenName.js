const db = require('../db/database');

/**
 * 温泉を追加する
 * @param {string} userId - 追加したユーザーのid
 * @param {string} onsenName - 追加された温泉名
 * @param {string} location - 温泉の場所
 * @param {string} description - 温泉の説明
 * @param {string} image_url - 温泉の画像
 */
exports.addOnsenName = async (req, res) => {

  const userId = req.user.id;
  const onsenName = req.body.onsenName;
  const location = req.body.location || null;
  const description = req.body.description || '';
  const imageUrl = req.body.imageUrl || null;

  const userResult = await db.query(`SELECT role FROM users WHERE id = $1`, [userId]);

  // ユーザーが存在しない場合、またはロールが「探湯者」か「温泉家」の場合
  if (userResult.rows.length === 0 || userResult.rows[0].role === '探湯者' || userResult.rows[0].role === '温泉家' || userResult.rows[0].role == '名湯案内人') {
    const userRole = userResult.rows.length > 0 ? userResult.rows[0].role : '未登録ユーザー';
    console.log('温泉追加権限なし:', userRole);
    return res.status(403).json({ error: '温泉追加の権限がありません。' });
  }

  // 入力された温泉名の確認
  if (!onsenName || typeof onsenName !== 'string' || onsenName.trim() === '') {
    return res.status(400).json({ error: '有効な温泉名を提供してください。' });
  }

  try {

    // 温泉の追加実行
    const result = await db.query(`
      INSERT INTO hot_springs (
      name, location, description, image_url, created_at
      ) VALUES ($1, $2, $3, $4, NOW())
      RETURNING *;
    `, [onsenName.trim(), location, description, imageUrl]);

    res.status(201).json({ message: '温泉が正常に追加されました。', onsen: result.rows[0] });
  } catch (err) {
    console.error('温泉追加エラー:', err.message);
    res.status(402).json({ message: '温泉の追加に失敗' })
  }
}