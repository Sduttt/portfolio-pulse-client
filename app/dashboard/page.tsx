"use client"
import { useEffect, useState } from 'react'
import { tradeApi } from '@/lib/api/trade'
import TradesTable from './components/TradesTable'
import Loader from '../components/Loader'
import TradeFormModal from '@/app/trade/components/TradeFormModal'
import { TradeFormData } from '@/app/trade/components/TradeForm'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Dashboard = () => {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addModal, setAddModal] = useState(false);

  const fetchTrades = async () => {
    try {
      const res = await tradeApi.getAll();
      setTrades(res.data.data ?? []);
    } catch (err) {
      console.error("Error fetching trades:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrade = async (data: TradeFormData) => {
    await tradeApi.create(data);
    setAddModal(false);
    void fetchTrades();
  };

  useEffect(() => {
    void fetchTrades();
    // Re-fetch when user navigates back to this tab/page
    const onFocus = () => void fetchTrades();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <div className='py-12 px-4 md:px-10 min-h-[80vh]'>
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader size="lg" color="border-[#4d8eff]" />
        </div>
      ) : trades.length > 0 ? (
        <TradesTable trades={trades} onTradeAdded={fetchTrades} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[40vh]">
          <p className='text-center text-gray-500'>No trades found. Start by creating a new trade!</p>
          <button
            onClick={() => setAddModal(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4d8eff] text-[#001a42] font-bold text-sm shadow-lg shadow-[#4d8eff]/20 hover:scale-105 active:scale-100 transition-all cursor-pointer"
          >
            <FontAwesomeIcon icon={faPlus} className="text-xs" />
            Add Trade
          </button>
        </div>
      )}

      {addModal && (
        <TradeFormModal
          mode="add"
          onSubmit={handleAddTrade}
          onClose={() => setAddModal(false)}
        />
      )}
    </div>
  )
}

export default Dashboard