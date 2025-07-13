import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ROUTES } from '../const'

function Review() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [onsenName, setOnsenName] = useState('');
  const [rating, setRating] = useState(5.0);
  const [comment, setComment] = useState('');
  const [loadingOnsen, setLoadingOnsen] = useState(true); //温泉名取得のロード状態
  const [loadingSubmit, setLoadingSubmit] = useState(false); // 評価送信時のロード
  const [errorOnsen, setErrorOnsen] = useState(null); // 温泉名取得エラー
  const [errorSubmit, setErrorSubmit] = useState(null); // 評価送信エラー
  const [submitSuccess, setSubmitSuccess] = useState(false); //評価送信成功フラグ

  // 評価対象の温泉名を取得
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

  // フォーム送信ハンドラ
  const handleSubmit = async (e) => {
    e.preventDefault(); // フォームのデフォルト送信を防ぐ
    setLoadingSubmit(true);
    setErrorSubmit(null);
    setSubmitSuccess(false);

    try {
      const response = await fetch(`http://localhost:3000/api/onsen/${id}/rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ rating, comment }), // 評価とコメントをJSON形式で送信
      });

      if (!response.ok) {
        const errorData = await response.json(); // エラーレスポンスもJSONで取得
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      // 成功したら温泉詳細ページへ
      setSubmitSuccess(true);
      setTimeout(() => {  // setTimeoutはjsの標準ライブラリ！
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
    <div>
      <h1>{onsenName}への評価</h1>

      {submitSuccess && (
        <p>投稿完了!!</p>
      )}
      {errorSubmit && (
        <p>投稿に失敗しました。</p>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor='rating'>評価 (1.0 - 5.0)</label>
          <input
            type="number"
            id="rating"
            min="1.0"
            max="5.0"
            step="0.1"
            value={rating}
            onChange={(e) => setRating(parseFloat(e.target.value))}
            required
          />
        </div>

        <div>
          <label htmlFor='comment'>コメント</label>
          <textarea
            placeholder='コメントを入力してください'
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
          ></textarea>
        </div>
        <button type='submit' disabled={loadingSubmit}>
          {loadingSubmit ? '送信中...' : '送信'}
        </button>
      </form>

      <div>
        <Link to={ROUTES.ONSEN_DETAIL.replace(':id', id)}>←温泉詳細ページに戻る</Link>
        <Link to={ROUTES.HOME}>←温泉一覧に戻る</Link>
      </div>
    </div>
  )
}

export default Review

