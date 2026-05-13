"use client"
import { useEffect, useState } from 'react'
import { tradeApi } from '@/lib/api/trade'
import TradesTable from './components/TradesTable'
import Loader from '../components/Loader'

type Props = {}

const Dashboard = (props: Props) => {
  const [trades, setTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const res = await tradeApi.getAll();
        console.log("Trades response:", res.data);
        if(res.data.data.length > 0) {
          setTrades(res.data.data);
        }
      } catch (err) {
        console.error("Error fetching trades:", err);
      } finally {
        setLoading(false);
      }
    };

    void fetchTrades();
  }, []);

  return (
    <div className='py-12 px-4 md:px-10 min-h-[80vh]'>
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader size="lg" color="border-[#4d8eff]" />
        </div>
      ) : trades.length > 0 ? (
        <TradesTable trades={trades} />
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 min-h-[40vh]">
          <p className='text-center text-gray-500'>No trades found. Start by creating a new trade!</p>
          <button
            onClick={() => window.location.href = "/trade/new"}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4d8eff] text-[#001a42] font-bold text-sm shadow-lg shadow-[#4d8eff]/20 hover:scale-105 active:scale-100 transition-all"
          >
            Add Trade
          </button>
        </div>
      )}
    </div>
  )
}

export default Dashboard