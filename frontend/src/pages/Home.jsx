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
    <div className='p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-8'>
      <h1 className='text-4xl font-extrabold text-blue-700 mb-8 text-center'>温泉一覧ページ</h1>
      {onsenList.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">登録されている温泉はまだありません。</p>
      ):(
        <ul className="list-none max-w-2x1 max-auto gap-8">
          {onsenList.map((onsen) => (
            <li key={onsen.id} className='border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white'>
              <Link to={ROUTES.ONSEN_DETAIL.replace(':id', onsen.id)} className="block p-5 text-decoration-none text-gray-800" >
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">{onsen.name}</h2>
                <p className="text-gray-600 text-base mb-1">場所: {onsen.location}</p>
                <p className="text-gray-600 text-base mb-1">設備: {onsen.facilities}</p> {/* 設備を追加 */}
                <p className="text-gray-700 text-base font-medium">評価: {onsen.rating ? onsen.rating.toFixed(1) : 'N/A'} / 5</p> {/* 評価の表示を修正 */}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home
