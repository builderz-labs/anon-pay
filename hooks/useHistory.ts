import { useEffect, useState } from 'react';
import { useWallet } from "@solana/wallet-adapter-react";
import { Elusiv, PrivateTxWrapper } from 'elusiv-sdk';

export const useHistory = (elusiv: Elusiv, reload: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [history, setHistory] = useState<PrivateTxWrapper[]>([]);

  const wallet = useWallet();

  useEffect(() => {
    const fetchHistory = async() => {
      !history.length && setLoading(true);
      
      try {
        const history = await elusiv.getPrivateTransactions(5);        
        setHistory(history);
        setError(false)
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true)
        setLoading(false);
      }
    }

    if (wallet.publicKey && elusiv) {
      console.log("Fetching history");
      fetchHistory()
    }

  }, [elusiv, reload]);

  return {
    loading,
    error,
    history
  }
}