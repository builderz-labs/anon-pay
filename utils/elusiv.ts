import { Wallet, WalletContextState } from '@solana/wallet-adapter-react'
import { Connection, PublicKey } from '@solana/web3.js'
import { Elusiv, TokenType } from 'elusiv-sdk'

export const topup = async(elusiv: Elusiv, wallet: any, tokenType: any, amount: number) => {
  const topupTx = await elusiv.buildTopUpTx(amount, tokenType);

  await wallet.signTransaction(topupTx.tx);

  const res = await elusiv.sendElusivTx(topupTx);
  
  return res
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