import type { AppProps } from "next/app";
import localFont from '@next/font/local'
import AppBar from "../components/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import ContextProvider from "../contexts/ContextProvider";
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css")
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import themes from "../components/themes";

const myFont = localFont({ src: '../public/Hubot-Sans.woff2' })

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <div className={myFont.className}>
    <ThemeProvider theme={themes.dark} >
      <ContextProvider>
        <CssBaseline enableColorScheme />
        <WalletModalProvider>
          <AppBar />
          <Component {...pageProps} />
        </WalletModalProvider>
      </ContextProvider>
      {/* Change Notification settings here */}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={"light"}
      />
    </ThemeProvider>
    </div>
  );
}

export default MyApp;
