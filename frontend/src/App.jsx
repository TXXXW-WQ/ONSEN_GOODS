import { useState } from 'react'
import './App.css'
import { Link, Route, Router, Routes } from 'react-router-dom'
import Home from './pages/Home'
import OnsenDetail from './pages/OnsenDetail'
import Review from './pages/Review'
import { ROUTES } from './const'
ROUTES
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
 

  return (
    <div>
      <nav>
        <ul>
          <li><Link to={ROUTES.HOME}>温泉一覧</Link></li>
        </ul>
      </nav>

      {/* ルートを定義 */}
      <Routes>
        <Route path={ROUTES.HOME} element={<Home />} />
        <Route path={ROUTES.ONSEN_DETAIL} element={<OnsenDetail />} />
        <Route path={ROUTES.REVIEW} element={<Review />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </div>
  );
}

export default App
