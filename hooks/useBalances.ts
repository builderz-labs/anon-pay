import { useEffect, useState } from 'react';
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { Elusiv } from 'elusiv-sdk';

const tryGetBalance = async (connection: Connection, address: PublicKey) => {
  try {
    return await connection.getTokenAccountBalance(address)
  } catch (error) {
    return null;
  }
} 

export const useBalances = (elusiv: Elusiv, reload?: number) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [walletBalanceSOL, setWalletBalanceSOL] = useState(0);
  const [elusivBalanceSOL, setElusivBalanceSOL] = useState(0);

  const [walletBalanceUSDC, setWalletBalanceUSDC] = useState(0);
  const [elusivBalanceUSDC, setElusivBalanceUSDC] = useState(0);

  const [walletBalanceUSDT, setWalletBalanceUSDT] = useState(0);
  const [elusivBalanceUSDT, setElusivBalanceUSDT] = useState(0);

  const wallet = useWallet();
  const { connection } = useConnection();

  const usdcMint = new PublicKey("4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU") // Devnet currently
  const usdtMint = new PublicKey("Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB")

  useEffect(() => {
    const fetchBalances = async() => {
      setLoading(true);

      setWalletBalanceSOL(0);
      setElusivBalanceSOL(0);
      setWalletBalanceUSDC(0);
      setElusivBalanceUSDC(0);
      setWalletBalanceUSDT(0);
      setElusivBalanceUSDT(0);

      try {
        // SOL
        const balanceSOL = await connection.getBalance(wallet.publicKey!);
        setWalletBalanceSOL(balanceSOL / LAMPORTS_PER_SOL);
        const privateBalanceSOL = await elusiv.getLatestPrivateBalance("LAMPORTS")
        setElusivBalanceSOL(Number(privateBalanceSOL));
        // USDC
        const usdcAddress = getAssociatedTokenAddressSync(usdcMint, wallet.publicKey!);
        const balanceUSDC = await tryGetBalance(connection, usdcAddress);
        setWalletBalanceUSDC(balanceUSDC?.value?.uiAmount || 0)
        const privateBalanceUSDC = await elusiv.getLatestPrivateBalance("USDC")
        setElusivBalanceUSDC(Number(privateBalanceUSDC))
        // USDT
        const usdtAddress = getAssociatedTokenAddressSync(usdtMint, wallet.publicKey!);
        const balanceUSDT = await tryGetBalance(connection, usdtAddress);
        setWalletBalanceUSDT(balanceUSDT?.value?.uiAmount || 0)
        const privateBalanceUSDT = await elusiv.getLatestPrivateBalance("USDT")
        setElusivBalanceUSDT(Number(privateBalanceUSDT))

        setError(false)
        setLoading(false);
      } catch (error) {
        console.log(error);
        setError(true)
        setLoading(false);
      }
    }

    if (wallet.publicKey && elusiv) {
      console.log("Fetching balances");
      fetchBalances()
    }

  }, [elusiv, reload])

  return {
    loading,
    error,
    walletBalanceSOL,
    elusivBalanceSOL,
    walletBalanceUSDC,
    elusivBalanceUSDC,
    walletBalanceUSDT,
    elusivBalanceUSDT,
  }
}