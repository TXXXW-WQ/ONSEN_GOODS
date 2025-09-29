const db = require('../db/database'); 

exports.editLocation = async(req, res) => {
  const { id } = req.params;
  const userId = req.user.id
  const { newLocate } = req.body
  if (!newLocate || newLocate.trim() == ""){
    return res.status(405).json({ message: "新しい所在地は必須です。"})
  }

  const client = await db.connect()
  try {
    const onsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1', [id]);
    if (onsenResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: '指定された温泉が見つかりませんでした。' });
    }
    
    await client.query('BEGIN')

    await client.query(`
      UPDATE hot_springs
      SET location = $1, location_changer_user_id = $2 WHERE id = $3
    `,[newLocate, userId, id])

    await client.query('COMMIT')
    res.status(200).json({ message: "所在地が更新されました"})
  } catch (e) {
    console.error(e)
    await client.query('ROLLBACK')
    res.status(400).json({ message: "所在地の更新に失敗しました。"})
  } finally {
    client.release()
  }

 }