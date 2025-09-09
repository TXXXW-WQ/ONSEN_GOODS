const { default: Review } = require("../../../frontend/src/pages/review");

const CONTRIBUTION_WEIGHTS = {
  review_count: 2,
  picture_count: 5,
  description_edit_count: 8,
  onsen_add_count: 10
};

/**
 * ユーザーの貢献度を更新する関数
 * @param {object} client - データベース接続クライアント
 * @param {number} userId - ユーザーID
 * @param {string} type - 更新する貢献タイプ ('review_count', 'picuture_count'など)
 */

async function updateUserContribution(client, userId, type) {
  if (!CONTRIBUTION_WEIGHTS.hasOwnProperty(type)) {
    throw new Error('無効な貢献タイプです。');
  }
  const weight = CONTRIBUTION_WEIGHTS[type];
  const culumnToUpdate = type; // 'review_count'など
  try {
    await client.query(`
    UPDATE users SET ${culumnToUpdate} = ${culumnToUpdate} + 1,
    contribution_score = contribution_score + $1
    WHERE id = $2
    `, [weight, userId]);
  } catch (e) {
    console.error('ユーザー貢献度更新エラー:', e);
    throw e;
  }
}