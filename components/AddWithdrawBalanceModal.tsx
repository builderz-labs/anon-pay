import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState } from "react"
import { toast } from "react-toastify";
import { useBalances } from "../hooks/useBalances";
import { topup } from "../utils/elusiv";

const AddWithdrawBalanceModal = ({ elusiv } : { elusiv: Elusiv}) => {
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SOL");

  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);

  const wallet = useWallet()

  const balances = useBalances(elusiv, reload)

  const handleTopup = async() => {
    if (amount <= 0) {
      toast.error("Select a valid amount");
      return;
    }

    setLoading(true)

    const tokenType = type === "SOL" ? "LAMPORTS" : type;

    try {
      const res = await topup(elusiv, wallet, tokenType, amount * LAMPORTS_PER_SOL);
      console.log(res);

      const conf = await res.isConfirmed;
      console.log(conf);
      
      
      setReload((prev) => prev + 1)
      toast.success("Topup successful");

    } catch (error) {
      console.log(error);
      toast.error("Failed to topup balance")
    }

    setLoading(false)
  }

  return (
    <>
      <input type="checkbox" id="add-balance" className="modal-toggle" />
      <label htmlFor="add-balance" className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold mb-4">Topup your private balance</h3>
          <div className="form-control">
            <div className="input-group">
              <select value={type} onChange={(e) => setType(e.target.value)} className="select select-bordered">
                <option value={"SOL"}>SOL</option>
                <option value={"USDC"}>USDC</option>
                <option value={"USDT"}>USDT</option>
              </select>
              <input type="number" value={amount} onChange={((e) => setAmount(e.target.valueAsNumber))} className="input input-bordered max-w-xs" />
              <button onClick={handleTopup} className={"btn " + (loading && " loading")}>Go</button>
            </div>
          </div>

        </label>
      </label>
    </>
  )
}

export default AddWithdrawBalanceModal;