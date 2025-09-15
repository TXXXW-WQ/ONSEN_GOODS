const db = require('../db/database'); // db/database.jsからデータベース接続を読み込む
const { updateUserContribution } = require('./util/upContribution'); // 貢献度更新関数をインポート

/**
 * 温泉の名前を編集するコントローラー
 * @route PUT /api/onsen/:id/nameedit
 * @param {number} req.params.id - 温泉ID
 * @param {string} req.body.newName - 新しい温泉の名前
 * @param {object} req.user - 認証済みユーザー情報 (JWTから取得)
 */

exports.editOnsenName = async (req, res) => {
  const { id } = req.params; // URLパスから温泉IDを取得
  const { newName } = req.body;
  const userId = req.user.id; 
  const userRole = req.user.role;

  if (!newName || newName.trim() === ""){
    return res.status(400).json({ message: '新しい名前は必須です。' });
  }

  const client = await db.connect(); // トランザクション用にクライアントを取得
  try {
    // 1. 温泉が存在するか確認
    const onsenResult = await client.query('SELECT * FROM hot_springs WHERE id = $1', [id]);
    if (onsenResult.rows.length === 0) {
      return res.status(404).json({ message: '指定された温泉が見つかりませんでした。' });
    }
    
    await client.query('BEGIN'); // トランザクション開始

    // 2. 名前の重複チェック
    const nameCheck = await client.query('SELECT * FROM hot_springs WHERE name = $1', [newName]);
    if (nameCheck.rows.length > 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ message: 'その名前は既に使用されています。' });
    }

    // 3. ユーザーの権限確認
    if (!(userRole === '温泉マイスター' || userRole === '名湯案内人')) {
      await client.query('ROLLBACK');
      return res.status(403).json({ message: '名前を変更する権限がありません。' });
    }

    // 4. 名前の更新
    await client.query(`
      UPDATE hot_springs
      SET name = $1, name_changer_user_id = $2, name_complaints = 0
      WHERE id = $3
    `, [newName, userId, id]);
    
    await client.query('COMMIT'); // トランザクションをコミット
    return res.status(200).json({ message: '名前が正常に更新されました。' });
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('温泉名前編集エラー:', e);
    return res.status(500).json({ message: '名前の更新中にエラーが発生しました。' });

  } finally {
    client.release(); // クライアントを解放
  }
}