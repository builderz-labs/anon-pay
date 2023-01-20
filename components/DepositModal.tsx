import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { sleep, topup } from "../utils/elusiv";

const DepositModal = ({ elusiv, reload, setReload } : { elusiv: Elusiv, reload: number, setReload: any}) => {

  const [localElusiv, setLocalElusiv] = useState<Elusiv>(elusiv);

  useEffect(() => {
    console.log("Updating Elusiv");
    
    setLocalElusiv(elusiv)
  }, [elusiv])

  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SOL");

  const [loading, setLoading] = useState(false);

  const wallet = useWallet()
  const { connection } = useConnection()

  const handleTopup = async() => {
    if (amount <= 0) {
      toast.error("Select a valid amount");
      return;
    }

    setLoading(true)
    const toastId = toast.loading("Sending Transaction...")

    const tokenType = type === "SOL" ? "LAMPORTS" : type;

    try {
      const res = await topup(localElusiv, wallet, tokenType, amount * LAMPORTS_PER_SOL, connection);
      await sleep(1000);
      console.log(res);
      console.log(res.sig.signature);
      
      
      
      toast.update(toastId, {render: "Transaction sent, waiting for confirmation..."});
      setLoading(false)
      setReload()

      await Promise.resolve(res.isConfirmed)
      toast.update(toastId, {render: "Transaction confirmed!", type: "success", autoClose: 5000, isLoading: false})

      setReload()
      
    } catch (error) {
      console.log(error);
      setLoading(false)
      toast.update(toastId, {render: "Failed to topup balance", type: "error", autoClose: 5000, isLoading: false})
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