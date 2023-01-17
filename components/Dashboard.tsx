import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState, useEffect } from "react"
import { useBalances } from "../hooks/useBalances";
import { useHistory } from "../hooks/useHistory";

import AddBalanceModal from "./AddBalanceModal";

const Dashboard = ({ elusiv } : { elusiv: Elusiv}) => {

  const wallet = useWallet();
  const { connection } = useConnection();

  const balances = useBalances(elusiv);
  const history = useHistory(elusiv);
  console.log(history);

  return (
    <div className="p-12 rounded-lg w-1/2 bg-[#374D3D]">
      <h1>Dashboard</h1>
      <div className="divider"></div>

      {/* Body */}
      <div className="flex">

        <div className="flex flex-col">
          <label htmlFor="add-balance" className="btn glass mb-4">Add Balance</label>
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
          
      </div>
      <AddBalanceModal elusiv={elusiv} />
    </div>
  )
}

export default Dashboard;
