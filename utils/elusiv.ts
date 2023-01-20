import { Wallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Elusiv, TokenType } from 'elusiv-sdk'

export const topup = async(elusiv: Elusiv, wallet: any, tokenType: any, amount: number, connection: Connection) => {
  try {
    const topupTx = await elusiv.buildTopUpTx(amount, tokenType);

    console.log(topupTx.tx);
    console.log(topupTx.commitment);
    
    
    

    await wallet.signTransaction(topupTx.tx);

    const res = await elusiv.sendElusivTx(topupTx);

    const confirmation = await connection.confirmTransaction({
      signature: res.sig.signature,
      lastValidBlockHeight: topupTx.tx.lastValidBlockHeight!,
      blockhash: topupTx.tx.recentBlockhash!
    }, "finalized")

    console.log(confirmation);
    

    return res
  } catch (error) {
    console.log(error);
    throw new Error("lel");
    
  }
  
}

export const withdraw = async(elusiv: Elusiv, tokenType: any, amount: number) => {
  const withdrawTx = await elusiv.buildWithdrawTx(amount, tokenType);

  const res = await elusiv.sendElusivTx(withdrawTx)

  return res;
}

export const send = async(elusiv: Elusiv, tokenType: any, amount: number, recipient: PublicKey) => {
  const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType );

  const res = await elusiv.sendElusivTx(sendTx);

  return res;
}

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}