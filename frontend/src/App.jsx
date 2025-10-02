import { useEffect, useState } from 'react'
import { Link, Route, Router, Routes, useNavigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import OnsenDetail from './pages/OnsenDetail'
import Review from './pages/Review'
import { ROUTES } from './const'
import Edit from './pages/Edit'
import AddOnsen from './pages/AddOnsen'
import Mypage from './pages/Mypage'
import FAQ from './pages/FAQ'

import icon1 from './assets/kkrn_icon_user_1.svg'
import icon2 from './assets/kkrn_icon_user_2.svg'
import icon3 from './assets/kkrn_icon_user_3.svg'
import icon4 from './assets/kkrn_icon_user_4.svg'

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
  const [myPageOpen, setMyPageOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [login, setLogin] = useState(false);

  const navigate = useNavigate()

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const result = await fetch('https://onsen-goods.onrender.com/api/onsen/me', {
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

  const handleMypage = () => {
    if (!login) return;
    navigate(ROUTES.MYPAGE)
  }
  const handleLogout = async () => {
    const result = await fetch('https://onsen-goods.onrender.com/api/onsen/logout', {
      method: 'POST',
      credentials: 'include'
    })
    if (result.ok) {
      setLogin(false);
    }
  }

  return (
    <div className='p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-8'>
      <nav className='bg-blue-700 p-4 shadow-xl relative rounded-t-lg'>
        <div className='flex justify-between items-center'>
          {/* サイトタイトル */}
          <Link 
            to={ROUTES.HOME} 
            className='text-white text-3xl md:text-4xl font-extrabold tracking-wider hover:text-blue-200 transition-colors duration-300'
          >
            ONSEN GOODS
          </Link>

          {/* 右側の要素: FAQ, ユーザーアイコン, メニュー */}
          <div className="flex items-center space-x-4">
            {/* FAQボタン */}
            <Link 
              to={ROUTES.FAQ} 
              className='text-white text-xl font-bold p-2 hover:bg-blue-600 rounded-full transition-colors duration-200'
              aria-label="よくある質問"
            >
              <span className='sr-only'>FAQ</span>?
            </Link>

            {/* ログイン中のマイページアイコン */}
            {login && (
              <div className="relative">
                <button
                  onClick={handleMypage}
                  className='w-10 h-10 rounded-full overflow-hidden border-2 border-white hover:border-blue-300 transition duration-150 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-blue-700'
                  aria-label="マイページへ"
                >
                  {/* imgタグの代わりに、font-awesomeなどのアイコンフォントを使うか、
                      実際のアイコン画像を設定してください */}
                  <img src={icon1} alt="ユーザーアイコン" className="w-full h-full object-cover" />
                </button>
              </div>
            )}

            {/* ドロップダウンメニューボタン */}
            <div className="relative"> 
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                aria-expanded={menuOpen}
                aria-controls="main-menu"
              >
                メニュー <span className="ml-1">▼</span>
              </button>

              {/* ドロップダウンメニュー本体 */}
              {menuOpen && (
                <div 
                  id="main-menu"
                  className="absolute right-0 mt-3 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-20 origin-top-right transform scale-100 transition duration-100 ease-out"
                  role="menu" 
                  aria-orientation="vertical"
                >
                  {/* ホーム */}
                  <Link
                    to={ROUTES.HOME}
                    className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition duration-150 rounded-t-lg"
                    onClick={() => setMenuOpen(false)}
                    role="menuitem"
                  >
                    ホーム
                  </Link>

                  {/* 未ログイン時のオプション */}
                  {!login && (
                    <>
                      {/* ログイン */}
                      <Link 
                        to={ROUTES.LOGIN} 
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition duration-150" 
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                      >
                        ログイン
                      </Link>
                      {/* アカウント登録 */}
                      <Link 
                        to={ROUTES.REGISTER} 
                        className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition duration-150" 
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                      >
                        アカウント登録
                      </Link>
                    </>
                  )}

                  {/* ログイン時のオプション */}
                  {login && (
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-700 transition duration-150 rounded-b-lg"
                      role="menuitem"
                    >
                      ログアウト
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* ルートを定義 */}
      <Routes>
        <Route path={ROUTES.HOME} element={<Home login={login} />} />
        <Route path={ROUTES.ONSEN_DETAIL} element={<OnsenDetail login={login} />} />
        <Route path={ROUTES.LOGIN} element={<Login login={login} setLogin={setLogin} />} />
        <Route path={ROUTES.REGISTER} element={<Register />} />
        <Route path={ROUTES.MYPAGE} element={<Mypage />} />
        <Route path={ROUTES.AddOnsen} element={<AddOnsen login={login} />} />
        <Route path={ROUTES.REVIEW} element={<Review login={login} />} />
        <Route path={ROUTES.EDIT} element={<Edit login={login} />} />
        <Route path={ROUTES.FAQ} element={<FAQ />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App
