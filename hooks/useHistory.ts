import { useEffect, useState } from 'react';
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Elusiv, PrivateTxWrapper } from 'elusiv-sdk';

export const useHistory = (elusiv: Elusiv) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [history, setHistory] = useState<PrivateTxWrapper[]>([]);

  const wallet = useWallet();
  const { connection } = useConnection();

  useEffect(() => {
    const fetchHistory = async() => {
      setLoading(true);
      
      try {
        const history = await elusiv.getPrivateTransactions(3);        
        setHistory(history);
        setError(false)
        setLoading(false);
      } catch (error) {
        setError(true)
        setLoading(false);
      }
    }

    if (wallet.publicKey) {
      console.log("Fetching history");
      fetchHistory()
    }

  }, [wallet.publicKey])

  return {
    loading,
    error,
    history
  }
}