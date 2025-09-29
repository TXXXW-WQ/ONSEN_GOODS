import React, { useState } from 'react'

function Editdescription({ id, currentdescription, ModalClose }) {
  const [newdescription, setDescription] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    try {
      const response = await fetch(`https://onsen-goods.onrender.com/api/onsen/${id}/editdescription`, {
        method: 'PUT',
        headers: {
          'Content-Type':
            'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          id,
          newdescription
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
      }

      setSuccess(true);

    } catch (e) {
      setError(e);
      console.error("温泉名の更新中にエラーが発生しました:", e);
    } finally {
      setLoading(false)
      setTimeout(() => {
        ModalClose();
      }, 2000)
    }
  }
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-lg mx-auto rounded-lg shadow-lg">
        {/* ×で閉じるボタン */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={ModalClose}>
          <span className="text-2xl">&times;</span>
        </button>
        <h2 className="text-2xl font-bold mb-4">温泉の説明を編集</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">新しい説明</label>
            <textarea
              id="description"
              defaultValue={newdescription}
              onChange={e => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="5"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
          >
            {loading ? '更新中...' : '説明を更新'}
          </button>
          {error && <div className="mt-4 text-red-600 text-sm">エラー: {error.message}</div>}
          {success && <div className="mt-4 text-green-600 text-sm">温泉の説明を更新しました！</div>}
        </form>
      </div>
    </div>
  )
}

export default Editdescription