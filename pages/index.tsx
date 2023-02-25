import type { NextPage } from "next";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { toast } from "react-toastify";
import Head from "next/head";
import { Elusiv } from "elusiv-sdk";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import Dashboard from "../components/Dashboard";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [elusiv, setElusiv] = useState<Elusiv | null>(null);
  
  const wallet = useWallet();
  const { connection } = useConnection()

  useEffect(() => {
    setElusiv(null)
    setInput("")
  }, [wallet.publicKey])

  const createElusivInstance = async () => {
    setLoading(true);
    setElusiv(null)

    if (wallet.publicKey && wallet.signMessage) {
      const seed = Elusiv.hashPw(input);

      const encoder = new TextEncoder();
      const messageUint8 = encoder.encode(seed);      

      try {
        const signedSeed = await wallet.signMessage(messageUint8);
        // Create the elusiv instance
        const elusiv = await Elusiv.getElusivInstance(signedSeed, wallet.publicKey, connection);
        setElusiv(elusiv)
        toast.success("Logged in successfully");
      } catch (error) {
        console.log(error);
        toast.error("Couldn't create Elusiv instance");
      }
    } else {
      toast.error("Connection Wallet first")
    }

    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>AnonPay | Private Payments</title>
        <link rel="icon" href="/anon-pay-logo.png" />
      </Head>

      {!elusiv || !wallet.publicKey ? ( // Login
        <div className="flex items-center justify-center my-4 md:my-24">
          <div className="p-12 rounded-lg bg-[#202327]">
            <h2 className="mb-8">Login</h2>
            <WalletMultiButtonDynamic className="glow my-4 !w-full" />
            <div className="text-sm">
              {/* <p>Enter your elusive password</p> */}
              <input type="password" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Enter Password" className="input w-full max-w-xs" required />
            </div>
            <div className="divider"></div>
            <button onClick={createElusivInstance} className={"btn btn glass w-full mx-2" + (loading && " loading")} disabled={input === ""}>Login</button>
            <p className="text-center text-xs text-inherit stat-title mt-4">Powered by Dynamic Labs & Elusiv</p>
          </div>
        </div>
        
      ) : ( // Dashboard
        <div>
          <Dashboard elusiv={elusiv} />
        </div>
      )}
    </>
  );
};

export default Home;
