import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState, useEffect } from "react"
import { useBalances } from "../hooks/useBalances";
import { useHistory } from "../hooks/useHistory";

import AddWithdrawBalanceModal from "./AddWithdrawBalanceModal";
import TransactionListItem from "./TransactionListItem";

const Dashboard = ({ elusiv } : { elusiv: Elusiv}) => {

  const wallet = useWallet();
  const { connection } = useConnection();

  const balances = useBalances(elusiv);
  const history = useHistory(elusiv);
  console.log(history);

  return (
    <div className="p-12 rounded-lg bg-[#374D3D]">
      <div className="flex justify-between items-center">
        <h1>Dashboard</h1>
        <div className="space-x-4 justify-center">
          <label htmlFor="add-balance" className="btn glass">Deposit</label>
          <label htmlFor="add-balance" className="btn glass">Withdraw</label>
          <label htmlFor="add-balance" className="btn glass">Send</label>
        </div>
      </div>
      <div className="divider"></div>

      {/* Body */}
      <div className="flex space-x-8">

        <div className="flex flex-col">
          {/* Balances */}
          <div className="stats bg-[#293a2e] stats-vertical text-left text-primary-content">
            <div className="stat">
              <div className="stat-title">SOL balance</div>
              <div className="stat-value">{balances.elusivBalanceSOL / LAMPORTS_PER_SOL}</div>
              <div className="stat-desc">In wallet {balances.walletBalanceSOL.toFixed(2)}</div>
            </div>
            
            <div className="stat">
              <div className="stat-title">USDC balance</div>
              <div className="stat-value">{balances.elusivBalanceUSDC}</div>
              <div className="stat-desc">In wallet {balances.walletBalanceUSDC.toFixed(2)}</div>
            </div>

            <div className="stat">
              <div className="stat-title">USDT balance</div>
              <div className="stat-value">{balances.elusivBalanceUSDT}</div>
              <div className="stat-desc">In wallet {balances.walletBalanceUSDT.toFixed(2)}</div>
            </div>          
          </div>
        </div>
        
        {/* History */}
        <div className="flex flex-col bg-[#fdf3d9] p-4 rounded-md text-gray-700">
          <div>
            <p className="text-left font-bold">Transaction History</p>
            <div className="divider !mt-0"></div>
          </div>
          {!history.loading && !history.error && history.history.length ? (history.history.map(tx => (
            <>
            <TransactionListItem tx={tx} />
            <div className="divider"></div>
            </>
          ))) : (
            <>
            {history.loading && <progress className="progress w-56"></progress>}
            {history.error && <div className="alert alert-danger">{history.error}</div>}
            {(history.history.length === 0 && !history.loading && !history.error) && <div className="alert alert-info">No transactions</div>}
            </>
          )}
        </div>
      </div>
      <AddWithdrawBalanceModal elusiv={elusiv} />
    </div>
  )
}

export default Dashboard;
