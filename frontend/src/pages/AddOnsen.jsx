import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ROUTES } from '../const';

/**
 * 温泉追加ページコンポーネント
 * @returns {JSX.Element} 温泉追加ページ
 */
function AddOnsen({ login }) {

  /**
   * ログイン中のユーザー情報を取得
   */
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await fetch('http://localhost:3000/api/onsen/me', {
          credentials: 'include'
        })
        if (result.ok) {
          const data = await result.json();
          setUserId(data.user.id);
        }
      } catch (e) {
        console.error('ユーザー情報の取得中にエラーが発生しました:', e);
      }
    }
    fetchUser();
  }, [login]);
  /**
   * postする温泉の基本情報
   * @param {string} onsenName 温泉名
   * @param {string} imageUrl 画像URL
   * @param {string} location 住所
   * @param {string} description 説明
   */
  const [onsenName, setOnsenName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  /**
   * postの状態管理
   * @param {boolean} loading ローディング中か否か
   * @param {string|null} error エラーメッセージ
   * @param {boolean} success 成功したか否か
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!login) {
      navigate(ROUTES.LOGIN, { state: { fromAddOnsen: true } });
    }
  }, [login, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const checkRole = await fetch('')
      const response = await fetch('http://localhost:3000/api/onsen/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          onsenName,
          imageUrl,
          location,
          description
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setSuccess(true);
      setOnsenName('');
      setImageUrl('');
      setLocation('');
      setDescription('');

      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 2000);
    } catch (e) {
      setError(e);
      console.error('温泉追加中にエラーが発生しました:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-md mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4 text-center'>温泉追加ページ</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor="onsenName" className='block text-sm font-medium text-gray-700'>温泉名</label>
          <input
            type='text'
            id='onsenName'
            maxLength="30"
            placeholder='温泉名を入力してください'
            value={onsenName}
            onChange={(e) => setOnsenName(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
            required
          />
        </div>
        <div>
          <label htmlFor="imageUrl" className='block text-sm font-medium text-gray-700'>画像URL</label>
          <input
            type='url'
            id='imageUrl'
            maxLength="200"
            placeholder='画像URLを入力してください'
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
          />
        </div>
        <div>
          <label htmlFor="location" className='block text-sm font-medium text-gray-700'>所在地</label>
          <input
            type='text'
            id='location'
            maxLength="100"
            placeholder='温泉の所在地を入力してください'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
            required
          />
        </div>
        <div>
          <label htmlFor="description" className='block text-sm font-medium text-gray-700'>説明</label>
          <textarea
            id='description'
            maxLength="500"
            placeholder='説明を入力してください'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2'
            rows='4'
            required
          ></textarea>
        </div>

        <button
          type='submit'
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-semibold ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}
        >
          {loading ? '追加中...' : '温泉を追加'}
        </button>

        {success && (
          <p className='text-green-600 text-center mt-4'>温泉が正常に追加されました！</p>
        )}
        {error && (
          <p className='text-red-600 text-center mt-4'>エラー: {error.message}</p>
        )}
      </form>
    </div>
  );
}

export default AddOnsen;