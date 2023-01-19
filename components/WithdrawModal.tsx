import { useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { useBalances } from "../hooks/useBalances";
import { topup, withdraw } from "../utils/elusiv";

const Withdraw = ({ elusiv, reload, setReload } : { elusiv: Elusiv, reload: number, setReload: any}) => {

  const [localElusiv, setLocalElusiv] = useState<Elusiv>(elusiv);

  useEffect(() => {
    console.log("Updating Elusiv");
    
    setLocalElusiv(elusiv)
  }, [elusiv])

  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SOL");

  const [loading, setLoading] = useState(false);

  const handleWithdraw = async() => {
    if (amount <= 0) {
      toast.error("Select a valid amount");
      return;
    }

    setLoading(true)
    const toastId = toast.loading("Sending Transaction...")

    const tokenType = type === "SOL" ? "LAMPORTS" : type;

    try {
      const res = await withdraw(localElusiv, tokenType, amount * LAMPORTS_PER_SOL);
      console.log(res);
      toast.update(toastId, {render: "Transaction sent, waiting for confirmation..."});
      setLoading(false)
      setReload()

      await Promise.resolve(res.isConfirmed)
      toast.update(toastId, {render: "Transaction confirmed!", type: "success", autoClose: 5000, isLoading: false})

      setReload()

    } catch (error) {
      console.log(error);
      setLoading(false)
      toast.update(toastId, {render: "Failed to withdraw balance", type: "error", autoClose: 5000, isLoading: false})
    }
  }

  return (
    <>
      <input type="checkbox" id="withdraw" className="modal-toggle" />
      <label htmlFor="withdraw" className="modal cursor-pointer">
        <label className="modal-box relative bg-[#fdf3d9] flex flex-col items-center justify-center" htmlFor="">
          <p className="text-lg font-bold mb-4 text-gray-700 text-left">Withdraw from your private balance</p>
          <div className="form-control">
            <div className="input-group">
              <select value={type} onChange={(e) => setType(e.target.value)} className="select select-bordered">
                <option value={"SOL"}>SOL</option>
                <option value={"USDC"}>USDC</option>
                <option value={"USDT"}>USDT</option>
              </select>
              <input type="number" value={amount} onChange={((e) => setAmount(e.target.valueAsNumber))} className="input input-bordered w-28 md:w-56" />
              <button onClick={handleWithdraw} className={"btn " + (loading && " loading")}>Go</button>
            </div>
          </div>

        </label>
      </label>
    </>
  )
}

export default Withdraw;