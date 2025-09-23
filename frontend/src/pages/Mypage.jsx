import React from 'react'
import { ROUTES } from '../const'
import { useEffect } from 'react'
/**
 * ユーザーごとのマイページ
 */
function Mypage() {

  useEffect(() => {
    const getMypage = async () => {
      try {
        const result = await fetch('http://localhost:3000/api/onsen/mypage', {
          credentials: 'include'
        }
        )
        if (!result.ok) {
          console.error("サーバーが起動しているか確認してください。")
          return (
            <p>ユーザー情報を取得できませんでした</p>
          )
        }
        console.log(result)
        return (
          <p>通信成功</p>
        )
      } catch (e) {
        console.error(e)
      }
    }
    getMypage()
  }, [])
  return (
    <div>Mypage</div>
  )
}

export default Mypage