import { Wallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Elusiv, TokenType } from 'elusiv-sdk'

export const topup = async(elusiv: Elusiv, wallet: any, tokenType: any, amount: number, connection: Connection) => {
  const toastId = toast.loading("Building Transaction...")

  try {
    const topupTx = await elusiv.buildTopUpTx(amount, tokenType);

    await wallet.signTransaction(topupTx.tx);
    toast.update(toastId, {render: "Sending Transaction..."});

    const res = await elusiv.sendElusivTx(topupTx);

    const confirmation = await connection.confirmTransaction({
      signature: res.sig.signature,
      lastValidBlockHeight: topupTx.tx.lastValidBlockHeight!,
      blockhash: topupTx.tx.recentBlockhash!
    }, "finalized")
    toast.update(toastId, {render: "Action successful, Waiting for Elusiv confirmation..."});    

    return { res, toastId }
  } catch (error) {
    console.log(error);
    toast.update(toastId, {render: "Something went wrong, please try again", type: "error", autoClose: 5000, isLoading: false}) 
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