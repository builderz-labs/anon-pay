import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider as ReactUIWalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
  SlopeWalletAdapter,
  GlowWalletAdapter
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useCallback, useMemo } from "react";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const network = WalletAdapterNetwork.Devnet;

  const wallets = useMemo(
    () => [
      new SolflareWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new SlopeWalletAdapter(),
      new GlowWalletAdapter()
    ],
    [network]
  );

  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={process.env.NEXT_PUBLIC_RPC_URL!}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect={true}>
        <ReactUIWalletModalProvider>{children}</ReactUIWalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default WalletContextProvider;
