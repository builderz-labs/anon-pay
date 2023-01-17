import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PrivateTxWrapper } from "elusiv-sdk";

const TransactionListItem = ({ tx } : { tx: PrivateTxWrapper }) => {
  const date = new Date(tx?.sig?.blockTime! * 1000);
  
  const shortenSignature = (signature: string) => {
    return signature.slice(0, 4) + "..." + signature.slice(-4);
  }

  return (
    <div className="flex space-x-24 items-center justify-between" key={tx.sig.signature}>
      <span className="badge badge-lg p-2">{tx.txType}</span>
      <p><span className="font-bold text-xl">{tx.amount / LAMPORTS_PER_SOL}</span> {tx.tokenType === "LAMPORTS" ? "SOL" : tx.tokenType}</p>
      <a target="_blank" rel="noreferrer" href={`https://solana.fm/tx/${tx.sig.signature}?cluster=devnet-solana`} className="underline text-sm">{shortenSignature(tx.sig.signature)}</a>
      <p className="text-sm">{date.toDateString()}</p>
    </div>
  )
}

export default TransactionListItem;
