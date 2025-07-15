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
    <div className='p-6 max-w-4xl mx-auto bg-white shadow-xl rounded-xl mt-8'>
      <nav className='bg-blue-800 p-4 shadow-lg'>
        <ul className='justify-center items-center list-none p-0 m-0'>
          <li ><Link to={ROUTES.HOME} className='text-white text-4x1 font-extrabold tracking-wide hover:text-blue-200 transition-colors duration-300'>ONSEN GOODS</Link></li>
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
