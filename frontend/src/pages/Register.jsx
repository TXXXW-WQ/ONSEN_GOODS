import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('http://localhost:3000/api/onsen/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'アカウント登録に失敗しました。')
      }

      // 登録成功後、ログインページへリダイレクト
      navigate('/login')
    } catch (err) {
      setError(err.message || '登録中にエラーが発生しました。')
    }
  }
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">アカウント登録</h2>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">登録が完了しました！ログインページへ移動します。</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-semibold">ユーザー名</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold">パスワード</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          登録
        </button>
      </form>
      <div className="mt-4 text-center">
        <span>すでにアカウントをお持ちですか？ </span>
        <a href="/login" className="text-blue-600 hover:underline">ログイン</a>
      </div>
    </div>
  )
}

export default Register