import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../const'

function Review({ login, setLogin }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [onsenName, setOnsenName] = useState('');
  const [rating, setRating] = useState(5.0);
  const [comment, setComment] = useState('');
  const [feelHot, setFeelHot] = useState(false);
  const [feelCold, setFeelCold] = useState(false);
  const [veryBusy, setVeryBusy] = useState(false);
  const [normal, setNormal] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [loadingOnsen, setLoadingOnsen] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [errorOnsen, setErrorOnsen] = useState(null);
  const [errorSubmit, setErrorSubmit] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (!login) {
      navigate(ROUTES.LOGIN, { state: { fromReview: true } });
      // console.log("ログイン確認できず");
    }
  }, [login, navigate]);

  useEffect(() => {
    const fetchOnsenName = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/onsen/${id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        setOnsenName(data.name);
      } catch (e) {
        setErrorOnsen(e);
        console.error(`温泉ID ${id} の名前取得中にエラーが発生しました:`, e);
      } finally {
        setLoadingOnsen(false);
      }
    };
    if (id) {
      fetchOnsenName();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setErrorSubmit(null);
    setSubmitSuccess(false);

    
    try {
      const response = await fetch(`http://localhost:3000/api/onsen/${id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          rating,
          comment,
          feel_hot: feelHot,
          feel_cold: feelCold,
          very_busy: veryBusy,
          normal,
          empty
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        navigate(ROUTES.ONSEN_DETAIL.replace(':id', id));
      }, 2000);

    } catch (e) {
      setErrorSubmit(e);
      console.error("評価の投稿中にエラーが発生しました:", e);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loadingOnsen) {
    return (
      <div>温泉名を取得中</div>
    )
  }
  if (errorOnsen) {
    return (
      <div>
        <h2>エラー: 温泉名を取得できませんでした。</h2>
        <Link to={ROUTES.HOME}></Link>
      </div>
    )
  }
  return (
    <div className="p-6 max-w-xl mx-auto bg-white shadow-xl rounded-xl mt-8 mb-8">
      <h1 className="text-3xl font-extrabold text-blue-700 mb-6 text-center">「{onsenName}」への評価</h1>

      {submitSuccess && (
        <p className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-center">
          投稿完了!! 詳細ページへ移動します...
        </p>
      )}
      {errorSubmit && (
        <p className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-center">
          エラー: {errorSubmit.message || '投稿に失敗しました。'}
        </p>
      )}

  <form onSubmit={handleSubmit} className="space-y-6">
      
        <div>
          <label htmlFor='rating' className="block text-gray-700 text-sm font-bold mb-2">評価 (1.0 - 5.0):</label>
          <input
            type="number"
            id="rating"
            min="1.0"
            max="5.0"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>

        
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">体感:</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center bg-red-100 border border-red-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-red-200 transition">
              <input type="checkbox" checked={feelHot} onChange={e => setFeelHot(e.target.checked)} className="accent-red-500" />
              <span className="ml-2 text-red-700 font-semibold">熱め</span>
            </label>
            <label className="flex items-center bg-blue-100 border border-blue-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-200 transition">
              <input type="checkbox" checked={feelCold} onChange={e => setFeelCold(e.target.checked)} className="accent-blue-500" />
              <span className="ml-2 text-blue-700 font-semibold">ぬるめ</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">混雑状況:</label>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center bg-yellow-100 border border-yellow-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-yellow-200 transition">
              <input type="checkbox" checked={veryBusy} onChange={e => setVeryBusy(e.target.checked)} className="accent-yellow-500" />
              <span className="ml-2 text-yellow-700 font-semibold">とても混雑</span>
            </label>
            <label className="flex items-center bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-gray-200 transition">
              <input type="checkbox" checked={normal} onChange={e => setNormal(e.target.checked)} className="accent-gray-500" />
              <span className="ml-2 text-gray-700 font-semibold">普通</span>
            </label>
            <label className="flex items-center bg-green-100 border border-green-300 rounded-lg px-4 py-2 cursor-pointer hover:bg-green-200 transition">
              <input type="checkbox" checked={empty} onChange={e => setEmpty(e.target.checked)} className="accent-green-500" />
              <span className="ml-2 text-green-700 font-semibold">空いている</span>
            </label>
          </div>
        </div>


        <div>
          <label htmlFor='comment' className="block text-gray-700 text-sm font-bold mb-2">コメント:</label>
          <textarea
            placeholder='コメントを入力してください'
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-y"
          ></textarea>
        </div>

        <button
          type='submit'
          disabled={loadingSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loadingSubmit ? '送信中...' : '評価を投稿する'}
        </button>
      </form>

      <div className="mt-8 flex flex-col sm:flex-row justify-between gap-4">
        <Link
          to={ROUTES.ONSEN_DETAIL.replace(':id', id)}
          className="inline-block px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300 text-center flex-grow sm:flex-none"
        >
          ←温泉詳細ページに戻る
        </Link>
        <Link
          to={ROUTES.HOME}
          className="inline-block px-6 py-3 bg-gray-600 text-white font-semibold rounded-lg shadow-md hover:bg-gray-700 transition-colors duration-300 text-center flex-grow sm:flex-none"
        >
          ←温泉一覧に戻る
        </Link>
      </div>
    </div>
  )
}

export default Review