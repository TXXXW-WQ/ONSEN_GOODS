import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '../const'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  const fromReview = location.state && location.state.fromReview
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const res = await fetch('http://localhost:3000/api/onsen/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.message || 'ログインに失敗しました。')
      }

      //jwtトークンをローカルストレージに保存
      localStorage.setItem('token', data.token)
      navigate(ROUTES.HOME) // ログイン成功後、ホームページへリダイレクト
    } catch (err) {
      setError(err.message || 'ログイン中にエラーが発生しました。')
    }
  }
  return (
    <div className="max-w-md mx-auto mt-12 p-8 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>
      {fromReview && (
        <div className="mb-4 text-blue-700 font-semibold text-center">
          評価の投稿にはログインが必要です
        </div>
      )}
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          ログイン
        </button>
      </form>
      <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline">アカウントを作成</Link>
    </div>
  )
}

export default Login