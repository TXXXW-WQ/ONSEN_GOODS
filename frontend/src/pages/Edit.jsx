import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [onsen, setOnsen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [coldBath, setColdBath] = useState(false);
  const [sauna, setSauna] = useState(false);
  const [rotenburo, setRotenburo] = useState(false);
  const [outdoor, setOutdoor] = useState(false);
  const [bubbleBath, setBubbleBath] = useState(false);
  const [jetBath, setJetBath] = useState(false);
  const [shampoo, setShampoo] = useState(false);

  useEffect(() => {
    const fetchOnsenDetail = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/onsen/${id}`);
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        setOnsen(data);
        setColdBath(data.cold_bath);
        setSauna(data.sauna);
        setRotenburo(data.rotenburo);
        setOutdoor(data.outdoor);
        setBubbleBath(data.bubble_bath);
        setJetBath(data.jet_bath);
        setShampoo(data.shampoo);
      } catch (e) {
        setError(e);
        console.error(`温泉ID ${id} の詳細取得中にエラーが発生しました:`, e);
      } finally {
        setLoading(false);
      }
    };
    fetchOnsenDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/onsen/${id}/facilities`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cold_bath: coldBath,
          sauna: sauna,
          rotenburo: rotenburo,
          outdoor: outdoor,
          bubble_bath: bubbleBath,
          jet_bath: jetBath,
          shampoo: shampoo,
        }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
      }
      const data = await response.json();
      setOnsen(data);
      navigate(`/onsen/${id}`);
    } catch (e) {
      setError(e);
      console.error(`温泉ID ${id} の更新中にエラーが発生しました:`, e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="max-w-lg mx-auto mt-12 p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">{onsen?.name} 設備編集</h2>
        {success && <div className="mb-4 text-green-600">設備情報を更新しました！</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 font-semibold">設備</label>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center bg-blue-50 border border-blue-300 rounded px-3 py-2">
                <input type="checkbox" checked={coldBath} onChange={e => setColdBath(e.target.checked)} />
                <span className="ml-2 text-blue-700">水風呂</span>
              </label>
              <label className="flex items-center bg-yellow-50 border border-yellow-300 rounded px-3 py-2">
                <input type="checkbox" checked={sauna} onChange={e => setSauna(e.target.checked)} />
                <span className="ml-2 text-yellow-700">サウナ</span>
              </label>
              <label className="flex items-center bg-green-50 border border-green-300 rounded px-3 py-2">
                <input type="checkbox" checked={rotenburo} onChange={e => setRotenburo(e.target.checked)} />
                <span className="ml-2 text-green-700">露天風呂</span>
              </label>
              <label className="flex items-center bg-lime-50 border border-lime-300 rounded px-3 py-2">
                <input type="checkbox" checked={outdoor} onChange={e => setOutdoor(e.target.checked)} />
                <span className="ml-2 text-lime-700">屋外風呂</span>
              </label>
              <label className="flex items-center bg-cyan-50 border border-cyan-300 rounded px-3 py-2">
                <input type="checkbox" checked={bubbleBath} onChange={e => setBubbleBath(e.target.checked)} />
                <span className="ml-2 text-cyan-700">泡風呂</span>
              </label>
              <label className="flex items-center bg-indigo-50 border border-indigo-300 rounded px-3 py-2">
                <input type="checkbox" checked={jetBath} onChange={e => setJetBath(e.target.checked)} />
                <span className="ml-2 text-indigo-700">ジェットバス</span>
              </label>
              <label className="flex items-center bg-pink-50 border border-pink-300 rounded px-3 py-2">
                <input type="checkbox" checked={shampoo} onChange={e => setShampoo(e.target.checked)} />
                <span className="ml-2 text-pink-700">シャンプーあり</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            設備情報を更新
          </button>
        </form>
      </div>
    </div>
  )
}

export default Edit