const pool = require('./database.js');
const { hashPassword } = require('./testUser.js');

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
        role VARCHAR(20) DEFAULT '探湯者',
        review_count INTEGER DEFAULT 0,
        picture_count INTEGER DEFAULT 0,
        description_edit_count INTEGER DEFAULT 0,
        onsen_add_count INTEGER DEFAULT 0,
        contribution_score INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );`);

    // hot_springsテーブルの作成
    await pool.query(`
      CREATE TABLE IF NOT EXISTS hot_springs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        name_changer_user_id INTEGER REFERENCES users(id),
        name_complaints INTEGER DEFAULT 0,
        location VARCHAR(255) NOT NULL,
        location_changer_user_id INTEGER REFERENCES users(id),
        location_complaints INTEGER DEFAULT 0,
        description TEXT DEFAULT '現在この温泉に対する説明はありません',
        description_changer_user_id INTEGER REFERENCES users(id),
        description_complaints INTEGER DEFAULT 0,
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
        cold_bath BOOLEAN,
        sauna BOOLEAN,
        rotenburo BOOLEAN,
        outdoor BOOLEAN,
        bubble_bath BOOLEAN,
        jet_bath BOOLEAN,
        shampoo BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 初期データ挿入
    await pool.query(`
      INSERT INTO hot_springs (
        name, location, description, image_url, rating, cold_bath, sauna, rotenburo, outdoor, bubble_bath, jet_bath, shampoo, created_at
      )
      VALUES
        -- 1. 霧島温泉郷（主要な温泉地として）
        (
          '霧島温泉郷', '霧島市', '坂本龍馬が新婚旅行で訪れたとされる歴史ある温泉地。多様な泉質が楽しめます。', 'https://example.com/kirishima.jpg', 4.5,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 2. 指宿温泉
        (
          '指宿温泉', '指宿市', '天然の砂むし温泉が有名な温泉地。特に**砂楽**が知られています。', 'https://example.com/ibusuki.jpg', 4.7,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 3. 妙見温泉
        (
          '妙見温泉', '霧島市', '素朴で落ち着いた雰囲気を持つ、川沿いの温泉。自噴する湯が特徴です。', 'https://example.com/myoken.jpg', 4.3,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 4. 日当山温泉
        (
          '日当山温泉', '霧島市', '西郷隆盛も利用したとされる古い歴史を持つ温泉地。家族湯が多いです。', 'https://example.com/hiyama.jpg', 4.0,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 5. 吹上温泉
        (
          '吹上温泉', '日置市', '田園風景の中に湧く静かな温泉地。透明な湯が特徴です。', 'https://example.com/fukiage.jpg', 3.9,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 6. 湯之平展望所（桜島）近くの温泉
        (
          '桜島マグマ温泉', '鹿児島市（桜島）', '桜島フェリーターミナル近くにある温泉。泉質はナトリウム塩化物泉です。', 'https://example.com/sakurajima.jpg', 4.1,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 7. 鰻温泉
        (
          '鰻温泉', '指宿市', '鰻池のほとりにある硫黄泉の温泉。独特な雰囲気が魅力です。', 'https://example.com/unagi.jpg', 4.4,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 8. 湯川内温泉
        (
          '湯川内温泉', '薩摩川内市', '山あいにひっそりと佇む一軒宿の温泉。歴史が古いです。', 'https://example.com/yukouji.jpg', 4.2,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 9. 栗野岳温泉
        (
          '栗野岳温泉', '湧水町', '栗野岳の中腹にある、療養泉として知られる温泉。', 'https://example.com/kurinodake.jpg', 3.8,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 10. 湯之元温泉
        (
          '湯之元温泉', '日置市', '島津家も利用したとされる由緒ある温泉地。', 'https://example.com/yunomoto.jpg', 4.0,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 11. 高屋温泉
        (
          '高屋温泉', '霧島市', '田園風景の中にある、静かで落ち着いた温泉。', 'https://example.com/takaya.jpg', 3.7,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 12. 鶴田温泉
        (
          '鶴田温泉', 'さつま町', '川内川沿いに位置する、地域に愛される温泉。', 'https://example.com/tsuruda.jpg', 3.5,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 13. 川内高城温泉
        (
          '川内高城温泉', '薩摩川内市', '湯治場として栄えた歴史を持つ、素朴な温泉地。', 'https://example.com/sendaitake.jpg', 4.1,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 14. 垂水温泉
        (
          '垂水温泉', '垂水市', '錦江湾を望むことができる温泉。海に近いのが特徴。', 'https://example.com/tarumizu.jpg', 4.3,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 15. 尾之間温泉（屋久島）
        (
          '尾之間温泉', '熊毛郡屋久島町', '屋久島にある温泉。地元の人が利用する共同浴場。', 'https://example.com/onoma.jpg', 4.6,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 16. 平内海中温泉（屋久島）
        (
          '平内海中温泉', '熊毛郡屋久島町', '潮の干満によって入浴できる時間が限られる、珍しい海中温泉。', 'https://example.com/hira_uchi.jpg', 4.8,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 17. 星野温泉
        (
          '星野温泉', '鹿屋市', '大隅半島にある温泉。静かな環境でリラックスできます。', 'https://example.com/hoshino.jpg', 3.6,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 18. 市比野温泉
        (
          '市比野温泉', '薩摩川内市', '昔ながらの雰囲気を残す温泉地。', 'https://example.com/ichihino.jpg', 3.9,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 19. 湯之島温泉
        (
          '湯之島温泉', '出水市', '出水平野にある、静かな温泉。', 'https://example.com/yunoshima.jpg', 3.4,
          false, false, false, false, false, false, false, NOW()
        ),
        -- 20. 湯之尾温泉
        (
          '湯之尾温泉', '伊佐市', '川沿いにあり、のどかな風景が広がる温泉。', 'https://example.com/yunoo.jpg', 3.7,
          false, false, false, false, false, false, false, NOW()
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

    const hashedPassword = await hashPassword('test');

    // ハッシュ化されたパスワードをデータベースに挿入
    await pool.query(
      `
      INSERT INTO users (username, email, password, role, contribution_score)
      VALUES ($1, $2, $3, $4, $5)
      `,
      ['テストユーザー', 'test@gmail.com', hashedPassword, '温泉マイスター', 150]
    );

    console.log('PostgreSQLテーブル作成完了');
  } catch (error) {
    console.error('PostgreSQLテーブル作成エラー:', error);
  } finally {
    // pool.end(); // プールを閉じる
  }
}

setup();