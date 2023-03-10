import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState, useEffect } from "react"
import { useBalances } from "../hooks/useBalances";
import { useHistory } from "../hooks/useHistory";

import DepositModal from "./DepositModal";
import WithdrawModal from "./WithdrawModal";
import TransactionListItem from "./TransactionListItem";
import SendModal from "./SendModal";

const Dashboard = ({ elusiv } : { elusiv: Elusiv}) => {

  const [localElusiv, setLocalElusiv] = useState<Elusiv>(elusiv);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    console.log("Updating Elusiv");
    
    setLocalElusiv(elusiv)
  }, [elusiv])

  const balances = useBalances(localElusiv, reload);
  const history = useHistory(localElusiv, reload);

  return (
    <div className="p-4 md:p-12 rounded-lg bg-[#374D3D] w-fit mx-auto my-12">
      <div className="md:flex justify-between items-center">
        <h1 className="my-8">DASHBOARD</h1>
        <div className="space-x-4 flex justify-center">
          <label htmlFor="deposit" className="btn glass">Deposit</label>
          <label htmlFor="withdraw" className="btn glass">Withdraw</label>
          <label htmlFor="send" className="btn glass">Send</label>
        </div>
      </div>
      <div className="divider"></div>

      {/* Body */}
      <div className="md:flex md:space-x-8">

        <div className="flex flex-col mb-4">
          {/* Balances */}
          <div className="stats bg-[#293a2e] stats-vertical text-left text-primary-content">
            <div className="stat">
              <div className="stat-title">SOL balance</div>
              {balances.loading ? (
                <progress className="progress w-full my-2"></progress>
              ) : (
                <>
                <div className="stat-value">{(balances.elusivBalanceSOL / LAMPORTS_PER_SOL).toFixed(2)}</div>
                <div className="stat-desc">In wallet {balances.walletBalanceSOL.toFixed(2)}</div>
                </>
              )}
              
            </div>
            <div className="stat">
              <div className="stat-title">USDC balance</div>
              {balances.loading ? (
                <progress className="progress w-full my-2"></progress>
              ) : (
                <>
                  <div className="stat-value">{balances.elusivBalanceUSDC.toFixed(2)}</div>
                  <div className="stat-desc">In wallet {balances.walletBalanceUSDC.toFixed(2)}</div>
                </>
              )}
            </div>
            <div className="stat">
              <div className="stat-title">USDT balance</div>
              {balances.loading ? (
                <progress className="progress w-full my-2"></progress>
              ) : (
                <>
                  <div className="stat-value">{balances.elusivBalanceUSDT.toFixed(2)}</div>
                  <div className="stat-desc">In wallet {balances.walletBalanceUSDT.toFixed(2)}</div>
                </>
              )}
            </div>          
          </div>
        </div>
        
        {/* History */}
        <div className="flex flex-col bg-[#fdf3d9] p-8 rounded-xl text-gray-700 mb-4">
          <div>
            <p className="text-left font-bold">Transaction History</p>
            <div className="divider !mt-0"></div>
          </div>
          {!history.loading && !history.error && history.history.length ? (history.history.map(tx => (
            <div className="grow" key={tx.sig.signature}>
            <TransactionListItem tx={tx} />
            <div className="divider"></div>
            </div>
          ))) : (
            <>
            {history.loading && <div className="grow"><progress className="progress md:w-96 mb-2"></progress></div>}
            {history.error && <div className="md:w-96 text-left grow">There was an error</div>}
            {(history.history.length === 0 && !history.loading && !history.error) && <div className="md:w-96 text-left grow">No transactions yet</div>}
            </>
          )}
          <p className="text-left text-xs text-inherit stat-title justify-self-end grow-0">Powered by Builderz & Elusiv</p>
        </div>
      </div>
      <DepositModal elusiv={localElusiv!} setReload={(() => setReload(((prev) => prev + 1 )))} />
      <WithdrawModal elusiv={localElusiv!} setReload={(() => setReload(((prev) => prev + 1 )))} />
      <SendModal elusiv={localElusiv!} setReload={(() => setReload(((prev) => prev + 1 )))} />
    </div>
  )
}

export default Dashboard;
