import pool from './database.js' // database.jsからpoolをインポート



async function setup() {
  try {
    // 既存テーブルを削除（依存関係のあるratings→hot_springsの順）
    await pool.query('DROP TABLE IF EXISTS ratings;');
    await pool.query('DROP TABLE IF EXISTS hot_springs;');
    await pool.query('DROP TABLE IF EXISTS users;');

    // usersテーブルの作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY, 
        username VARCHAR(50) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );`);

    // hot_springsテーブルの作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hot_springs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        rating REAL CHECK (rating >= 0.0 AND rating <= 5.0) DEFAULT 0.0,
        cold_bath BOOLEAN DEFAULT FALSE,
        sauna BOOLEAN DEFAULT FALSE,
        rotenburo BOOLEAN DEFAULT FALSE,
        bubble_bath BOOLEAN DEFAULT FALSE,
        jet_bath BOOLEAN DEFAULT FALSE,

        facilities TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ratingsテーブルの作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        hot_spring_id INTEGER NOT NULL REFERENCES hot_springs(id),
        user_id INTEGER NOT NULL,
        rating REAL CHECK (rating >= 1.0 AND rating <= 5.0),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // 初期データ挿入
    await pool.query(`
      INSERT INTO hot_springs (name, location, description, image_url, cold_bath, sauna, rotenburo, bubble_bath, jet_bath, facilities)
      VALUES
        ('Onsen A', 'Location A', 'Description A', 'https://example.com/imageA.jpg', true, true, false, false, false, 'シャンプー・リンスあり'),
        ('Onsen B', 'Location B', 'Description B', 'https://example.com/imageB.jpg', false, true, true, false, true, 'タオル貸出あり')
      ON CONFLICT (name) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO ratings (hot_spring_id, user_id, rating, comment) 
      VALUES
        (1, 1, 5.0, 'Great experience!'),
        (1, 2, 4.5, 'Loved it!'),
        (2, 1, 4.0, 'Very nice.'),
        (2, 3, 3.5, 'It was okay.'),
        (1, 1, 4.8, 'Amazing!'),
        (2, 2, 4.1, 'Very relaxing.'),
        (1, 3, 3.3, 'It was okay.')`)


    console.log('PostgreSQLテーブル作成完了');
  } catch (error) {
    console.error('PostgreSQLテーブル作成エラー:', error);
  } finally {
    pool.end(); // プールを閉じる
  }
}

setup();