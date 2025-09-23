import React from 'react'
import { ROUTES } from '../const'
import { useEffect } from 'react'
/**
 * ユーザーごとのマイページ
 */
function Mypage() {

  useEffect(() => {
    const getMypage = async () => {
      const result = await fetch('')
    }
  })
  return (
    <div>Mypage</div>
  )
}

export default Mypage