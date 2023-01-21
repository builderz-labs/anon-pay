import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { PrivateTxWrapper } from "elusiv-sdk";

const TransactionListItem = ({ tx } : { tx: PrivateTxWrapper }) => {
  const date = new Date(tx?.sig?.blockTime! * 1000);
  
  const shortenSignature = (signature: string) => {
    return signature.slice(0, 4) + "..." + signature.slice(-4);
  }
  
  return (
    <div className="relative">
      <div className="flex w-full md:space-x-24 items-center justify-between">
        <div className="text-left md:flex md:space-x-24 md:items-center md:justify-between">
          <span className="badge md:badge-lg p-2">{tx.txType}</span>
          <p className="mt-4 md:mt-0"><span className="font-bold text-xl">{tx.amount / LAMPORTS_PER_SOL}</span> {tx.tokenType === "LAMPORTS" ? "SOL" : tx.tokenType}</p>
        </div>
        <div className="md:flex md:space-x-24 md:items-center md:justify-between">
          <a target="_blank" rel="noreferrer" href={`https://solana.fm/tx/${tx.sig.signature}?cluster=devnet-solana`} className="underline text-sm">{shortenSignature(tx.sig.signature)}</a>
          <p className="text-sm mt-4 md:mt-0">{`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`}</p>
        </div>
      </div>
      <div className="absolute top-6 md:top-2 -left-5">
        {tx.transactionStatus === "PENDING" || tx.transactionStatus === "PROCESSED" && (
          <span className="flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-accent opacity-75"></span>
          </span>
        )}
      </div>
    </div>
  )
}

export default TransactionListItem;
