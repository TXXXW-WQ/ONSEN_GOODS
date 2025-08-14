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
        <p><strong className="font-semibold text-gray-700">評価:</strong> {onsen.rating ? onsen.rating.toFixed(2) : 'N/A'} / 5.0</p>
        <p><strong className="font-semibold text-gray-700">説明:</strong> {onsen.description}</p>
        <div className="flex flex-row flex-wrap gap-2">
          {onsen.cold_bath && (
            <p className="text-blue-700 font-semibold border border-blue-400 rounded px-2 py-1 bg-blue-50">水風呂</p>
          )}
          {onsen.sauna && (
            <p className="text-yellow-700 font-semibold border border-yellow-400 rounded px-2 py-1 bg-yellow-50">サウナ</p>
          )}
          {onsen.rotenburo && (
            <p className="text-green-700 font-semibold border border-green-400 rounded px-2 py-1 bg-green-50">露天風呂</p>
          )}
          {onsen.outdoor && (
            <p className="text-lime-700 font-semibold border border-lime-400 rounded px-2 py-1 bg-lime-50">屋外風呂</p>
          )}
          {onsen.bubble_bath && (
            <p className="text-cyan-700 font-semibold border border-cyan-400 rounded px-2 py-1 bg-cyan-50">泡風呂</p>
          )}
          {onsen.jet_bath && (
            <p className="text-indigo-700 font-semibold border border-indigo-400 rounded px-2 py-1 bg-indigo-50">ジェットバス</p>
          )}
          {onsen.shampoo && (
            <p className="text-pink-700 font-semibold border border-pink-400 rounded px-2 py-1 bg-pink-50">シャンプーあり</p>
          )}
        </div>
        <Link to={ROUTES.EDIT.replace(':id', id)} className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">設備を編集</Link>
        <p className="text-sm text-gray-500 mt-4">最終更新日: {onsen.updated_at ? new Date(onsen.updated_at).toLocaleDateString() : '不明'}</p>
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
              <li key={r.id || i} className="border rounded-lg p-4 shadow-sm bg-gray-50">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-yellow-600">★ {Number(r.rating_value).toFixed(1)} / 5.0</span>
                  <span className="text-xs text-gray-400 ml-2">{r.username || '匿名'}・{new Date(r.created_at).toLocaleDateString()}</span>
                </div>
                <div className="text-gray-800">{r.comment}</div>
              </li>
            ))}
          </ul>
        )}
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
    </div>
  )
}

export default OnsenDetail
