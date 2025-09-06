import { useEffect, useState } from 'react'
import { Link, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OnsenDetail from './pages/OnsenDetail'
import Review from './pages/Review'
import { ROUTES } from './const'


// ページが見つからないとき
function NotFoundPage() {
  return (
    <div>
      <h1>404 ページが見つかりません。</h1>
      <p>お探しのページは存在しないようです。</p>
      <Link to="/">ホームに戻る。</Link>
    </div>
  );
}

function App() {

  const [menuOpen, setMenuOpen] = useState(false);
  const [login, setLogin] = useState(false);

  
  useEffect(() => {
    const checkLogin = async () => {
      try {
      const result = fetch('http://localhost:3000/api/onsen/me', {
        credentials: 'include'
      })
        if (result.ok) {
          const data = await result.json();
          setLogin(!!data.user);
        } else {
          setLogin(false);
        }
    } catch {
      setLogin(false);
    }
    }
    checkLogin();
  }, []);

  const handleLogout = () => {

    setLogin(false); // ログイン状態を更新
    window.location.reload(); // ページをリロードしてログアウト状態を反映
  }

  return (
    <div className='p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-8'>
      <nav className='bg-blue-800 p-4 shadow-lg relative'>
        <ul className='justify-center items-center list-none p-0 m-0 flex'>
          <li>
            <Link to={ROUTES.HOME} className='text-white text-4xl font-extrabold tracking-wide hover:text-blue-200 transition-colors duration-300'>
              ONSEN GOODS
            </Link>
          </li>
          <li className="ml-auto relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="ml-4 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-600 focus:outline-none"
            >
              メニュー ▼
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg z-10">
                <Link
                  to={ROUTES.HOME}
                  className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                  onClick={() => setMenuOpen(false)}
                >
                  ホーム
                </Link>
                {!login && (
                  <>
                    <Link
                      to={ROUTES.LOGIN}
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      ログイン
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      className="block px-4 py-2 text-gray-800 hover:bg-blue-100"
                      onClick={() => setMenuOpen(false)}
                    >
                      アカウント登録
                    </Link>
                  </>
                )}
                {login && (
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-100"
                  >
                    ログアウト
                  </button>
                )}
              </div>
            )}
          </li>
        </ul>
      </nav>

      {/* ルートを定義 */}
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ONSEN_DETAIL} element={<OnsenDetail />} />
        <Route path={ROUTES.LOGIN} element={<Login login={login} setLogin={setLogin}/>} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.REVIEW} element={<Review login={login} setLogin={setLogin}/>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App
