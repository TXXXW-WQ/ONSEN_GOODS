const db = require('../db/database'); 

exports.editLocation = async(req, res) => {
  const { id } = res.params;
  const userId = req.user.id
  const newLocation = res.newLocation

  if (!newLocation || newLocation.trim() == ""){
    return res.status(405).json({ message: "新しい所在地は必須です。"})
  }
  try {
    const onsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1', [id]);
    if (onsenResult.rows.length === 0) {
      client.release();
      return res.status(404).json({ message: '指定された温泉が見つかりませんでした。' });
    }
    
    const client = await db.connect()
    await client.query('BEGIN')

    await client.query(`
      UPDATA hot_springs
      SET location = $1, location_changer_user_id = $2 WHERE id = $3
    `,[newLocation, userId, id])

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