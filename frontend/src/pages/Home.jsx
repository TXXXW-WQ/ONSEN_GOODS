import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ROUTES } from '../const';

function Home() {
  const [onsenList, setOnsenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // コンポーネントがマウントされたとき、APIからデータ取得
    const fetchOnsenList = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/onsen');
        if (!response.ok) {
          throw new Error (`HTTP error! status: ${response.status}`);
        } 
        const data = await response.json();
        setOnsenList(data); // 取得した値をstateにセット
      } catch (e) {
        setError(e); // エラーstateにセット
        console.error("温泉リストの取得中にエラーが発生しました。:", e);
      } finally {
        setLoading(false); //ロード完了
      }
    };
    fetchOnsenList();
  }, []); //からの依存配列は、コンポーネントがマウントされたときに一度だけ実行されることを意味する。

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>エラー: 温泉情報を取得できませんでした。</div>
  }

  return (
    <div>
      <h1>温泉一覧ページ</h1>
      {onsenList.length === 0 ? (
        <p>登録されている温泉はまだありません。</p>
      ):(
        <ul>
          {onsenList.map((onsen) => (
            <li key={onsen.id}>
              <Link to={ROUTES.ONSEN_DETAIL.replace(':id', onsen.id)}>
                <h2>{onsen.name}</h2>
                <p>{onsen.location}</p>
                <p>{onsen.rating}</p>
                <img src={onsen.image_url} alt={onsen.name} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home
