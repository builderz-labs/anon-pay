import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { Elusiv } from "elusiv-sdk";
import { useState, useEffect } from "react"
import { toast } from "react-toastify";
import { send } from "../utils/elusiv";

const Withdraw = ({ elusiv, setReload } : { elusiv: Elusiv, setReload: any}) => {

  const [localElusiv, setLocalElusiv] = useState<Elusiv>(elusiv);

  useEffect(() => {
    console.log("Updating Elusiv");
    
    setLocalElusiv(elusiv)
  }, [elusiv])

  const wallet = useWallet();
  const { connection } = useConnection();


  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SOL");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleWithdraw = async() => {
    if (amount <= 0) {
      toast.error("Select a valid amount");
      return;
    }

    setLoading(true)

    const tokenType = type === "SOL" ? "LAMPORTS" : type;

    const res = await send(localElusiv, tokenType, amount * LAMPORTS_PER_SOL, wallet.publicKey!, connection);
    
    setLoading(false)
    setModalOpen(false)
    setReload()

    if (res) {
      try {
        await res.res.commitmentInsertionPromise
        toast.update(res.toastId, {render: "Transaction confirmed!", type: "success", autoClose: 5000, isLoading: false})
      } catch (error) {
        console.log(error);
        toast.update(res.toastId, {render: "Something went wrong, please try again", type: "error", autoClose: 5000, isLoading: false})
      }

      setReload()
    }
  }

  return (
    <>
      <input type="checkbox" id="withdraw" className="modal-toggle" checked={modalOpen} onChange={() => {setModalOpen((prev) => !prev); setAmount(0)}} />
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
              <input type="number" step={0.000001} min={0} value={amount.toString()} onChange={((e) => !isNaN(e.target.valueAsNumber) && setAmount(e.target.valueAsNumber))} className="input input-bordered w-28 md:w-56" />
              <button onClick={handleWithdraw} className={"btn " + (loading && " loading")}>Go</button>
            </div>
          </div>

        </label>
      </label>
    </>
  )
}

export default Withdraw;