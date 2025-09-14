const db = require('../db/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// ユーザー登録
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'すべて必須項目です。' });
  }
  try {
    const hash = bcrypt.hashSync(password, 10);
    await db.query(`
      INSERT INTO users (username, email, password)
      VALUES ($1, $2, $3)
      `, [username, email, hash]
    );
    res.status(201).json({ message: 'ユーザー登録完了'});
  } catch (error) {
    console.error('登録エラー:', error);
  }
};

// ログイン
exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'メールアドレスとパスワードは必須です。' });
  }
  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1',[email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが違います。'});
    }
    const user = result.rows[0];
    const match = bcrypt.compareSync(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'メールアドレスまたはパスワードが違います。'});
    }

    // JWTトークンの生成
    const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, {expiresIn: '2h'});

    // Cookieにtokenをセット
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 2 * 60 * 60 * 1000 // ==2h
    });

    res.json({ message: 'ログイン成功'})
  } catch (error) {
    res.status(500).json({ error: 'ログインエラー'});
    console.error('ログインエラー:', error);
  }
};

// ログイン状態をチェック
exports.checkLogin = (req, res) => {
  res.json({ user: req.user });
}

// ログアウト
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'ログアウトしました。' });
}