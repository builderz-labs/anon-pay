import { Connection, PublicKey, ConfirmedSignatureInfo, Keypair } from '@solana/web3.js'
import { Elusiv } from 'elusiv-sdk'
import { findReference, FindReferenceError } from '@solana/pay'
import { toast } from 'react-toastify'

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

// export const withdraw = async(elusiv: Elusiv, tokenType: any, amount: number) => {
//   const withdrawTx = await elusiv.buildWithdrawTx(amount, tokenType);

//   const res = await elusiv.sendElusivTx(withdrawTx)

//   return res;
// }

export const send = async(elusiv: Elusiv, tokenType: any, amount: number, recipient: PublicKey, connection: Connection) => {
  const refKey = Keypair.generate();

  const toastId = toast.loading("Building Transaction...")

  try {
    const sendTx = await elusiv.buildSendTx(amount, recipient, tokenType , refKey.publicKey);
    toast.update(toastId, {render: "Sending Transaction..."});


    const res = await elusiv.sendElusivTx(sendTx);
    await awaitSolanaPayConfirmation(refKey.publicKey, connection);
    toast.update(toastId, {render: "Action successful, Waiting for Elusiv confirmation..."});

    return { res, toastId }

  } catch (error) {
    console.log(error);
    toast.update(toastId, {render: "Something went wrong, please try again", type: "error", autoClose: 5000, isLoading: false})
  }

}

const awaitSolanaPayConfirmation = async(reference: PublicKey, connection: Connection): Promise<ConfirmedSignatureInfo> => {
    // Adapted from https://github.com/solana-labs/solana-pay/blob/master/core/example/payment-flow-merchant/main.ts#L61
    let signatureInfo: ConfirmedSignatureInfo;

    return await new Promise((resolve, reject) => {
        /**
         * Retry until we find the transaction
         *
         * If a transaction with the given reference can't be found, the `findTransactionSignature`
         * function will throw an error. There are a few reasons why this could be a false negative:
         *
         * - Transaction is not yet confirmed
         * - Customer is yet to approve/complete the transaction
         *
         * You can implement a polling strategy to query for the transaction periodically.
         */
        const interval = setInterval(async () => {
            console.count('Checking for transaction...');
            try {
                signatureInfo = await findReference(connection, reference, { finality: 'finalized' });
                console.log('\n 🖌  Signature found: ', signatureInfo.signature);
                clearInterval(interval);
                resolve(signatureInfo);
            } catch (error: any) {
                if (!(error instanceof FindReferenceError)) {
                    console.error(error);
                    clearInterval(interval);
                    reject(error);
                }
            }
        }, 5000);
    });
}