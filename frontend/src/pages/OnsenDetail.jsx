import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '../const'

function OnsenDetail() {
  const { id } = useParams();
  const [onsen, setOnsen] = useState(null); // 特定の温泉データを保持する
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 評価一覧のstate
  const [ratings, setRatings] = useState([]);
  const [ratingsLoading, setRatingsLoading] = useState(true);

  useEffect(() => {
    const fetchOnsenDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/onsen/${id}`)
        if (!response.ok) {
          const errorText = await response.text(); // エラーレスポンスのテキストも取得
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        setOnsen(data);
      } catch (e) {
        setError(e); // エラーが発生した場合、エラーstateにセット
        console.error(`温泉ID ${id} の詳細取得中にエラーが発生しました:`, e);
      } finally {
        setLoading(false); // ロード完了
      }
    };
    fetchOnsenDetail();
  }, [id]);

  // 取得した設備情報をマッピング
  const facilityItems = [
    { key: 'cold_bath', label: '水風呂' },
    { key: 'sauna', label: 'サウナ' },
    { key: 'rotenburo', label: '露天風呂' },
    { key: 'outdoor', label: '外気浴' },
    { key: 'bubble_bath', label: '泡風呂' },
    { key: 'jet_bath', label: 'ジェットバス' },
    { key: 'shampoo', label: 'シャンプー・ボディソープ' },
  ]

  // 評価一覧の取得
  useEffect(() => {
    const fetchRatings = async () => {
      setRatingsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/onsen/${id}/rating`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        setRatings(data);
      } catch (e) {
        setRatingsError(e);
        console.error(`温泉ID ${id} の評価取得中にエラーが発生しました:`, e);
      } finally {
        setRatingsLoading(false);
      }
    };
    fetchRatings();
  }, [id]);

  if (loading) {
    return <div>読み込み中...</div>
  }

  if (error) {
    console.error("バックエンドサーバーが起動しているか、指定されたIDの温泉が存在するか確認してください。")
    return (
      <div>エラー: 温泉詳細情報を取得できませんでした。</div>
    )
  }

  if (!onsen) {
    return (
      <h2>指定された温泉が見つかりませんでした。</h2>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-xl rounded-xl mt-8 mb-8">
      <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">{onsen.name}</h1>

      {onsen.image_url && (
        <div className="mb-6 text-center">
          <img
            src={onsen.image_url}
            alt={onsen.name}
            className="w-full h-64 object-cover rounded-lg shadow-md border border-gray-200 mx-auto"
            style={{ maxWidth: '600px' }} // 画像の最大幅を調整
          />
        </div>
      )}

      <div className="space-y-4 text-gray-800 text-lg">
        <p><strong className="font-semibold text-gray-700">場所:</strong> {onsen.location}</p>
        <p><strong className="font-semibold text-gray-700">評価:</strong> {onsen.rating ? onsen.rating.toFixed(2) : 0.00} / 5.00</p>
        <p><strong className="font-semibold text-gray-700">説明:</strong> {onsen.description}</p>
        <div>
          <h3 className="text-xl font-bold mb-2">設備情報</h3>
          <div className="flex flex-wrap gap-2">
            {facilityItems.map(item => (
              <div
                key={item.key}
                className={`
                  px-3 py-1 rounded-full border 
                  ${onsen[item.key]
                    ? 'bg-green-100 border-green-500 text-green-700'
                    : 'bg-gray-100 border-gray-300 text-gray-500'
                  }
                `}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
        <Link to={ROUTES.EDIT.replace(':id', id)} className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">設備情報を投稿する</Link>
        <p className="text-sm text-gray-500 mt-4">最終更新日: {onsen.updated_at ? new Date(onsen.updated_at).toLocaleDateString() : '不明'}</p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">

        <Link
          to={ROUTES.HOME}
          className="inline-block px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300 text-center flex-grow sm:flex-none"
        >
          ← 温泉一覧に戻る
        </Link>
        <Link
          to={ROUTES.REVIEW.replace(':id', id)}
          className="inline-block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-300 text-center flex-grow sm:flex-none"
        >
          📝 この温泉を評価する →
        </Link>
      </div>

      {/* 評価一覧 */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-blue-800">ユーザーの評価・コメント</h2>
        {ratingsLoading ? (
          <div>評価を読み込み中...</div>
        ) : ratings.length === 0 ? (
          <div className="text-gray-500">まだ評価がありません。</div>
        ) : (
          <ul className="space-y-4">
            {ratings.map((r, i) => (
              r.comment && (
                <li key={r.id || i} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-yellow-600">{r.rating_value ? `★ ${Number(r.rating_value).toFixed(1)} / 5.0` : ''}</span>
                    <span className="text-xs text-gray-400 ml-2">{r.username || '匿名'}・{new Date(r.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="text-gray-800">{r.comment}</div>
                </li>
              )
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default OnsenDetail
