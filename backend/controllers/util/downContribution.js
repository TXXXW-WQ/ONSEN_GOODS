const PENARUTY_WEIGHT = {
  light: 20,
  medium: 50,
  heavy
}
/**
 * ユーザーの貢献度を下げる(ペナルティを与える)関数
 *  @param {Object} client - 接続クライアント
 *  @param {number} userId - ユーザーID
 */
async function downUserContribution(client, userId){
  try {
    if (!PENARUTY_WEIGHT.hasOwnProperty(type)) {
      throw new Error('無効なペナルティタイプです。');
    }
    const weight = PENARUTY_WEIGHT[type];
    const culumnToUpdate = type; // 'light'など
    const currrentContribution = await client.query('SELECT contribution_score FROM users WHERE id = $1', [userId]);
    if (currrentContribution.rows.length === 0) {
      throw new Error('ユーザーが見つかりません。');
    }
    if (currrentContribution <= 20 || culumnToUpdate === 'heavy') {
      client.query(`
        UPDATE users SET contribution_score = 0, role = '探湯者' WHERE id = $1`
        , [userId]);
    } else {
      client.query(`
        UPDATE users SET ${culumnToUpdate} = GREATEST(${culumnToUpdate} - 1, 0),
        contribution_score = GREATEST(contribution_score - $1, 0)
        WHERE id = $2
      `, [weight, userId]);
    }
  } catch (e) {
    console.error('ユーザーペナルティ更新エラー:', e);
    throw e;
  }
} 