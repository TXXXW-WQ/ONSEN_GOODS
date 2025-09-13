import React from 'react'

function AddOnsen() {
  /**
   * postする温泉の基本情報
   * @param {string} onsenName 温泉名
   * @param {string} imageUrl 画像URL
   * @param {string} location 住所
   * @param {string} description 説明
   */
  const [onsenName, setOnsenName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  
  /**
   * postの状態管理
   * @param {boolean} loading ローディング中か否か
   * @param {string|null} error エラーメッセージ
   * @param {boolean} success 成功したか否か
   */
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const response = await fetch('http://localhost:3000/api/onsen', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
      },
        credentials: 'include', 
        body: JSON.stringify({
          name: onsenName,
          imageUrl, 
          location,
          description
        }),
      });
    } catch (e) {
      setError(e);
      console.error('温泉追加中にエラーが発生しました:', e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>AddOnsen</div>
  )
}

export default AddOnsen