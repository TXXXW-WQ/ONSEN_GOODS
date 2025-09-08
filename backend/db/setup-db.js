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
        cold_bath_good INTEGER DEFAULT 0,
        cold_bath_bad INTEGER DEFAULT 0,
        sauna BOOLEAN DEFAULT FALSE,
        sauna_good INTEGER DEFAULT 0,
        sauna_bad INTEGER DEFAULT 0,
        rotenburo BOOLEAN DEFAULT FALSE,
        rotenburo_good INTEGER DEFAULT 0,
        rotenburo_bad INTEGER DEFAULT 0,
        outdoor BOOLEAN DEFAULT FALSE,
        outdoor_good INTEGER DEFAULT 0,
        outdoor_bad INTEGER DEFAULT 0,
        bubble_bath BOOLEAN DEFAULT FALSE,
        bubble_bath_good INTEGER DEFAULT 0,
        bubble_bath_bad INTEGER DEFAULT 0,
        jet_bath BOOLEAN DEFAULT FALSE,
        jet_bath_good INTEGER DEFAULT 0,
        jet_bath_bad INTEGER DEFAULT 0,
        shampoo BOOLEAN DEFAULT FALSE,
        shampoo_good INTEGER DEFAULT 0,
        shampoo_bad INTEGER DEFAULT 0,
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
        feel_hot BOOLEAN DEFAULT FALSE,
        feel_cold BOOLEAN DEFAULT FALSE,
        crowd BOOLEAN DEFAULT FALSE,
        normal BOOLEAN DEFAULT FALSE,
        no_crowd BOOLEAN DEFAULT FALSE,

        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    // 初期データ挿入
    await pool.query(`
      INSERT INTO hot_springs (
        name, location, description, image_url, rating,
        cold_bath, sauna, rotenburo, outdoor, bubble_bath, jet_bath, shampoo, created_at
      )
      VALUES
        (
          'Onsen A', 'Location A', 'Description A', 'https://example.com/imageA.jpg', 4.8,
          true, true, false, true, false, false, true, NOW()
        ),
        (
          'Onsen B', 'Location B', 'Description B', 'https://example.com/imageB.jpg', 4.2,
          false, true, true, false, true, true, false, NOW()
        )
      ON CONFLICT (name) DO NOTHING;
    `);

    await pool.query(`
      INSERT INTO ratings (
        hot_spring_id, user_id, rating, feel_hot, feel_cold, crowd, normal, no_crowd, comment
      ) 
      VALUES
        (1, 1, 5.0, true, false, false, true, false, '最高の温泉体験でした！'),
        (1, 2, 4.5, false, true, true, false, false, 'また来たいです。'),
        (2, 1, 4.0, false, false, true, false, true, '施設がきれいでした。'),
        (2, 3, 3.5, true, false, false, true, false, '混雑していましたが良かったです。'),
        (1, 1, 4.8, false, true, false, false, true, 'お湯の温度がちょうど良かったです。'),
        (2, 2, 4.1, true, false, true, false, false, 'サウナが気持ちよかったです。'),
        (1, 3, 3.3, false, false, false, true, true, '普通でした。')
    `);

    console.log('PostgreSQLテーブル作成完了');
  } catch (error) {
    console.error('PostgreSQLテーブル作成エラー:', error);
  } finally {
    pool.end(); // プールを閉じる
  }
}

setup();