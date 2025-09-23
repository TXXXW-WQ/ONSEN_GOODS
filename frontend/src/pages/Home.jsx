import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '../const';

function Home({ login }) {
  const [onsenList, setOnsenList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  const navigate = useNavigate();
  /**
   * @param addAuthError - 認証時のエラーメッセージ
   */
  const [addAuthError, setAddAuthError] = useState(null)

  useEffect(() => {
    // コンポーネントがマウントされたとき、APIからデータ取得
    const fetchOnsenList = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/onsen');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
  }, []); //空の依存配列は、コンポーネントがマウントされたときに一度だけ実行されることを意味する。

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    return <div>エラー: 温泉情報を取得できませんでした。</div>
  }

  const handleAddOnsen = async () => {
    try {
      if (!login) {
        setAddAuthError('ログインが必要です。');
        return
      }
      /**
       * @param role - 必要な権限レベル
       */
      const role = 'high'
      const rolecheck = await fetch(`http://localhost:3000/api/onsen/rolecheck/${role}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      })
      if (!rolecheck.ok) {
        setAddAuthError('必要な権限がありません');
        return;
      }
      navigate(ROUTES.AddOnsen)
    } catch {
      setAddAuthError('エラーが発生しま した。')
    }
  }

  const filteredOnsenList = onsenList.filter(onsen =>
    onsen.name.toLowerCase().includes(search.toLowerCase()) ||
    (onsen.location && onsen.location.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className='p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-8'>
      <h1 className='text-4xl font-extrabold text-blue-700 mb-8 text-center'>温泉一覧ページ</h1>
      <div className="mb-4">
        <input
          type="text"
          placeholder="温泉名で検索"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleAddOnsen}
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
        >
          温泉を追加する
        </button>
      </div>
      {addAuthError && <p className="text-red-500 text-center mb-4">{addAuthError}</p>}
      {filteredOnsenList.length === 0 ? (
        <p className="text-center text-gray-600 text-lg py-10">登録されている温泉はまだありません。</p>
      ) : (
        <ul className="space-y-4">
          {filteredOnsenList.map((onsen) => (
            <li key={onsen.id} className='border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white'>
              <Link to={ROUTES.ONSEN_DETAIL.replace(':id', onsen.id)} className="block p-5 text-decoration-none text-gray-800" >
                <h2 className="text-2xl font-semibold text-blue-800 mb-2">{onsen.name}</h2>
                <p className="text-gray-600 text-base mb-1">場所: {onsen.location}</p>
                <p className="text-gray-700 text-base font-medium">評価: {onsen.rating ? onsen.rating.toFixed(2) : '0.00'} / 5.00</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Home
