import React from 'react'
import { ROUTES } from '../const'
import { useEffect } from 'react'
import { useState } from 'react'
/**
 * ユーザーごとのマイページ
 */

function Mypage() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getMypage = async () => {
      try {
        const result = await fetch('http://localhost:3000/api/onsen/mypage', {
          credentials: 'include',
        });

        if (!result.ok) {
          setError(true);
          console.error('サーバーが起動しているか確認してください。');
          return;
        }

        const data = await result.json();
        setUserInfo(data);
      } catch (e) {
        setError(true);
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    getMypage();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl text-gray-600">読み込み中...</p>
      </div>
    );
  }

  if (error || !userInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 text-lg">ユーザー情報を取得できませんでした</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6 border-b-2 pb-4">
        マイページ
      </h1>
      <div className="space-y-4">
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">ユーザー名:</span>
          <span className="text-gray-800 font-semibold">{userInfo.username}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">メールアドレス:</span>
          <span className="text-gray-800">{userInfo.email}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">ロール:</span>
          <span className="text-gray-800">{userInfo.role}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">貢献スコア:</span>
          <span className="text-gray-800">{userInfo.contribution_score}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">温泉追加数:</span>
          <span className="text-gray-800">{userInfo.onsen_add_count}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">写真投稿数:</span>
          <span className="text-gray-800">{userInfo.picture_count}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">説明編集数:</span>
          <span className="text-gray-800">{userInfo.description_edit_count}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
          <span className="text-gray-600 font-medium">レビュー数:</span>
          <span className="text-gray-800">{userInfo.review_count}</span>
        </div>
      </div>
    </div>
  );
}

export default Mypage