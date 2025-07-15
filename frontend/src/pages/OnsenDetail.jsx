import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ROUTES } from '../const'

function OnsenDetail() {
  const { id } = useParams();
  const [onsen, setOnsen] = useState(null); // 特定の温泉データを保持する
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  },[id]);

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
        <p><strong className="font-semibold text-gray-700">評価:</strong> {onsen.rating ? onsen.rating.toFixed(2) : 'N/A'} / 5</p>
        <p><strong className="font-semibold text-gray-700">説明:</strong> {onsen.description}</p>
        <p><strong className="font-semibold text-gray-700">設備:</strong> {onsen.facilities}</p>
        <p className="text-sm text-gray-500 mt-4">最終更新日: {new Date(onsen.updated_at).toLocaleDateString()}</p>
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
