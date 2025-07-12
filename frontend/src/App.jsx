import { useState } from 'react'
import './App.css'
import { Link, Route, Router } from 'react-router-dom'
import Home from './pages/Home'
import OnsenDetail from './pages/OnsenDetail'
import review from './pages/review'

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

  </div>
  );
}

export default App
