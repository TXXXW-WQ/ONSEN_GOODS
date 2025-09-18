const db = require('../../db/database');

/**
 * ユーザーの権限が
 * @route POST /api/onser/userrolechecklow
 * @param {object} req.user - 認証済みユーザー情報 (JWTから取得)
 * @param {int} contriburion - 必要な貢献度
 */

exports.lowRole = async (req, res) => {
  const  userId  = req.user.id;

  const contribution = 20;
  
  try {
    const userResult = await db.query(`
      SELECT contribution_score FROM users WHERE id = $1
    `, [userId]);
    const userContribution = userResult.rows[0].contribution_score;
    
    if ( contribution <=  userContribution) {
      return res.status(200).json({ message: '権限があります。' });
    } else {
      return res.status(400).json({ message: '必要な権限を持っていません。'});
    }

  } catch (e) {
    return res.statrs(500).json({ message: 'ユーザー権限の検証中にエラーが発生しました。'});
  }
}