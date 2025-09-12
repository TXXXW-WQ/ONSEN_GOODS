const bcrypt = require('bcrypt');
const saltRounds = 10; // セキュリティを確保するためのソルト回数

/**
 * パスワードをハッシュ化する非同期関数
 * @param {string} password - ハッシュ化するプレーンなパスワード
 * @returns {Promise<string>} - ハッシュ化されたパスワード
 */
exports.hashPassword = async (password) => {
  try {
    // bcrypt.hash()は非同期でハッシュ化を行い、Promiseを返します
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (err) {
    console.error('パスワードのハッシュ化に失敗しました:', err);
    throw new Error('パスワードのハッシュ化中にエラーが発生しました。');
  }
};