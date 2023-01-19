import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { useBalances } from "../hooks/useBalances";
import { topup } from "../utils/elusiv";

const DepositModal = ({ elusiv } : { elusiv: Elusiv}) => {

  const [localElusiv, setLocalElusiv] = useState<Elusiv>(elusiv);

  useEffect(() => {
    console.log("Updating Elusiv");
    
    setLocalElusiv(elusiv)
  }, [elusiv])

  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SOL");

  const [reload, setReload] = useState(0);
  const [loading, setLoading] = useState(false);

  const wallet = useWallet()

  const balances = useBalances(localElusiv, reload)

  const handleTopup = async() => {
    if (amount <= 0) {
      toast.error("Select a valid amount");
      return;
    }

    setLoading(true)

    const tokenType = type === "SOL" ? "LAMPORTS" : type;

    try {
      const res = await topup(localElusiv, wallet, tokenType, amount * LAMPORTS_PER_SOL);
      console.log(res);
      toast.success("Topup successful");
      setLoading(false)

      await Promise.resolve(res.isConfirmed)

      console.log("Tx is confirmed");
      
      setReload((prev) => prev + 1)
      
    } catch (error) {
      console.log(error);
      setLoading(false)
      toast.error("Failed to topup balance")
    }
  }

  return (
    <>
      <input type="checkbox" id="deposit" className="modal-toggle" />
      <label htmlFor="deposit" className="modal cursor-pointer">
        <label className="modal-box relative bg-[#fdf3d9] flex flex-col items-center justify-center" htmlFor="">
          <p className="text-lg font-bold mb-4 text-gray-700 text-left">Topup your private balance</p>
          <div className="form-control">
            <div className="input-group">
              <select value={type} onChange={(e) => setType(e.target.value)} className="select select-bordered">
                <option value={"SOL"}>SOL</option>
                <option value={"USDC"}>USDC</option>
                <option value={"USDT"}>USDT</option>
              </select>
              <input type="number" value={amount} onChange={((e) => setAmount(e.target.valueAsNumber))} className="input input-bordered w-28 md:w-56" />
              <button onClick={handleTopup} className={"btn " + (loading && " loading")}>Go</button>
            </div>
          </div>

        </label>
      </label>
    </>
  )
}

export default DepositModal;