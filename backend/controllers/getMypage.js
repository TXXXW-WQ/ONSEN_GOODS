const db = require('../db/database'); 
 
/**
 * 認証済みユーザーのマイページ
 * @param {object} req.user - 認証済みユーザー情報 (JWTから取得)
 */

exports.getMypage = async(req, res) => {
  const userId = req.user.id
  try {
    const result = await db.query(`
      SELECT * FROM users WHERE $1
      `,[userId])
    if (result.rows.length == 0){
      return res.status(404).json({ message: 'ユーザーが見つかりませんでした。'})
    }
    const userInfo = result.rows[0]
    return res.status(200).json(userInfo)
  } catch(e) {
    console.error(e)
    return res.status(400).json({ message: "ユーザー情報取得中にエラーが発生しました。"})
  }
}