import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../const';

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [onsen, setOnsen] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  /**
   * 現在の設備情報
   */
  const [currentColdBath, setCurrentColdBath] = useState();
  const [currentSauna, setCurrentSauna] = useState();
  const [currentRotenburo, setCurrentRotenburo] = useState();
  const [currentOutdoor, setCurrentOutdoor] = useState();
  const [currentBubbleBath, setCurrentBubbleBath] = useState();
  const [currentJetBath, setCurrentJetBath] = useState();
  const [currentShampoo, setCurrentShampoo] = useState();


  /**
   * 送信される設備情報
   */
  const [coldBath, setColdBath] = useState();
  const [sauna, setSauna] = useState(false);
  const [rotenburo, setRotenburo] = useState(false);
  const [outdoor, setOutdoor] = useState(false);
  const [bubbleBath, setBubbleBath] = useState(false);
  const [jetBath, setJetBath] = useState(false);
  const [shampoo, setShampoo] = useState(false);

  // useEffect(() => {
  //   console.log(id)
  // }, [id])
  useEffect(() => {
    const fetchOnsenDetail = async () => {
      try {
        const response = await fetch(`https://onsen-goods.onrender.com//api/onsen/${id}`)
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }
        const data = await response.json();
        setOnsen(data);
        setCurrentColdBath(data.cold_bath);
        setCurrentSauna(data.sauna);
        setCurrentRotenburo(data.rotenburo);
        setCurrentOutdoor(data.outdoor);
        setCurrentBubbleBath(data.bubble_bath);
        setCurrentJetBath(data.jet_bath);
        setCurrentShampoo(data.shampoo);
      } catch (e) {
        setError(e);
        console.error(`温泉ID ${id} の詳細取得中にエラーが発生しました:`, e);
      } finally {
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      }
    };
    fetchOnsenDetail();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`https://onsen-goods.onrender.com//api/onsen/${id}/facilities`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
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
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-200 ${currentColdBath
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
                }`}
            >
              水風呂
            </div>
            <input type="radio" name="coldBathStatus" value="あり" onChange={(e) => setColdBath(e.target.value === 'あり')} />あり
            <input type="radio" name="coldBathStatus" value="なし" onChange={(e) => setColdBath(e.target.value === 'あり')} />なし
          </div>
          <div>
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-200 ${currentSauna
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
                }`}
            >
              サウナ
            </div>
            <input type="radio" name="saunaStatus" value="あり" onChange={(e) => setSauna(e.target.value === 'あり')} />あり
            <input type="radio" name="saunaStatus" value="なし" onChange={(e) => setSauna(e.target.value === 'あり')} />なし
          </div>
          <div>
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-200 ${currentRotenburo
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
                }`}
            >
              露天風呂
            </div>
            <input type="radio" name="rotenStatus" value="あり" onChange={(e) => setRotenburo(e.target.value === 'あり')} />あり
            <input type="radio" name="rotenStatus" value="なし" onChange={(e) => setRotenburo(e.target.value === 'あり')} />なし
          </div>
          <div>
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-200 ${currentOutdoor
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
                }`}
            >
              外気浴
            </div>
            <input type="radio" name="outdoorStatus" value="あり" onChange={(e) => setOutdoor(e.target.value === 'あり')} />あり
            <input type="radio" name="outdoorStatus" value="なし" onChange={(e) => setOutdoor(e.target.value === 'あり')} />なし
          </div>
          <div>
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-200 ${currentBubbleBath
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
                }`}
            >
              泡風呂
            </div>
            <input type="radio" name="bubbleStatus" value="あり" onChange={(e) => setBubbleBath(e.target.value === 'あり')} />あり
            <input type="radio" name="bubbleStatus" value="なし" onChange={(e) => setBubbleBath(e.target.value === 'あり')} />なし
          </div>
          <div>
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-200 ${currentJetBath
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
                }`}
            >
              ジェットバス
            </div>
            <input type="radio" name="jetStatus" value="あり" onChange={(e) => setJetBath(e.target.value === 'あり')} />あり
            <input type="radio" name="jetStatus" value="なし" onChange={(e) => setJetBath(e.target.value === 'あり')} />なし
          </div>
          <div>
            <div
              className={`px-4 py-2 rounded-full font-bold text-sm transition-colors duration-200 ${currentShampoo
                ? 'bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-700'
                }`}
            >
              シャンプー/ボディーソープ
            </div>
            <input type="radio" name="shampooStatus" value="あり" onChange={(e) => setShampoo(e.target.value === 'あり')} />あり
            <input type="radio" name="shampooStatus" value="なし" onChange={(e) => setShampoo(e.target.value === 'あり')} />なし
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