const pool = require('./database'); // database.jsからプールをインポート

async function setup() {
  try {
    // hot_springsテーブルの作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hot_springs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL,
        description TEXT,
        image_url VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ratingsテーブルの作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ratings (
        id SERIAL PRIMARY KEY,
        hot_spring_id INTEGER NOT NULL REFERENCES hot_springs(id),
        user_id INTEGER NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // 初期データ挿入
    await pool.query(`
      INSERT INTO hot_springs (name, location, description, image_url)
      VALUES
        ('Onsen A', 'Location A', 'Description A', 'https://example.com/imageA.jpg'),
        ('Onsen B', 'Location B', 'Description B', 'https://example.com/imageB.jpg')
      ON CONFLICT DO NOTHING; -- 重複を避けるため
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