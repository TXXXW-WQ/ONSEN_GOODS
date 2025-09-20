const db = require('../db/database');

/**
 * 温泉の説明を編集
 * @route PUT /api/onsen/:id/editdiscription
 */

exports.editDiscription = async (req, res) => {
  const id = req.params;
  const newDiscription = req.body.discription
  const userId = req.user.id;

  const userResult = await db.query(`SELECT role FROM users WHERE id = $1`, [userId]);
  if (userResult.rows[0].role == '探湯者') {
    return res.status(401).json({ message: '権限が確認できませんでした' })
  }

  if (!newDiscription || newDiscription.trim() == "") {
    return res.status(401).json({ message: '説明がありません。' })
  }

  const client = await db.connect();

  try {
    // 1. 温泉が存在するか確認
    const onsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1', [id]);
    if (onsenResult.rows.length === 0) {
      return res.status(404).json({ message: '指定された温泉が見つかりませんでした。' });
    }

    await client.query('BIGIN')

    await client.query(`
      UPDATE hot_springs
      SET description = $1, description_changer_user_id = $2
      WHERE id = $3
    `, [newDiscription, userId, id])
    await client.query('COMMIT');
    return res.status(500).json(({ message: '説明が正常に更新されました。'}))
  } catch {
    await client.query('ROLLBACK');
  } finally {
    client.release()
  }
}