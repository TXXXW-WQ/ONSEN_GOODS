const db = require('../db/database');

/**
 * 温泉の説明を編集
 * @route PUT /api/onsen/:id/editdescription
 */

exports.editdescription = async (req, res) => {
  const id = req.params.id;
  const newdescription = req.body.newdescription
  const userId = req.user.id;

  const userResult = await db.query(`SELECT role FROM users WHERE id = $1`, [userId]);
  if (userResult.rows[0].role == '探湯者') {
    return res.status(401).json({ message: '権限が確認できませんでした' })
  }

  if (!newdescription || newdescription.trim() == "") {
    return res.status(401).json({ message: '説明がありません。' })
  }

  const client = await db.connect();

  try {
    // 1. 温泉が存在するか確認
    const onsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1', [id]);
    if (onsenResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: '指定された温泉が見つかりませんでした。' });
    }

    await client.query('BEGIN')

    await client.query(`
      UPDATE hot_springs
      SET description = $1, description_changer_user_id = $2
      WHERE id = $3
    `, [newdescription, userId, id])
    await client.query('COMMIT');
    res.status(200).json({ message: '説明が正常に更新されました。'})
  } catch(e) {
    console.error(e)
    await client.query('ROLLBACK');
    res.status(403).json({ message: '説明の編集に失敗しました。'})
  } finally {
    client.release()
  }
}