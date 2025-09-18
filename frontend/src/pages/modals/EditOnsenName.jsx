import React from 'react'

function EditOnsenName({ onsenName, id, ModalClose }) {
  const [newName, setNewName] = React.useState(onsenName);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`http://localhost:3000/api/onsen/${id}/nameedit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          id,
          newName
        }),
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
      setLoading(false);
      setTimeout(() => {
        ModalClose();
      },2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex justify-center items-center z-50">
      <div className="relative p-8 bg-white w-96 max-w-lg mx-auto rounded-lg shadow-lg">
        {/* ×で閉じるボタン */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700" onClick={ModalClose}>
          <span className="text-2xl">&times;</span>
        </button>

        <h2 className="text-2xl font-bold mb-4">温泉名の編集</h2>
        <h3 className="text-lg mb-2">現在の温泉名: {onsenName}</h3>
        <form onSubmit={handleSubmit}>
          <input type='text' value={newName} onChange={e => setNewName(e.target.value)} className="w-full p-2 border border-gray-300 rounded mb-4" />
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            {loading ? '更新中...' : '温泉名を更新'}
          </button>
          {error && <div className="mt-4 text-red-600">エラー: {error.message}</div>}
          {success && <div className="mt-4 text-green-600">温泉名を更新しました！</div>}
        </form>
      </div>
    </div>
  );
}

export default EditOnsenName;