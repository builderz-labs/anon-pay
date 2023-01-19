import type { AppProps } from "next/app";
import AppBar from "../components/AppBar";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { useState, useEffect } from "react";
import { useMediaQuery } from "@mui/material";
import ContextProvider from "../contexts/ContextProvider";
require("@solana/wallet-adapter-react-ui/styles.css");
require("../styles/globals.css")
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from 'react-toastify';
import themes from "../components/themes";
import dynamic from "next/dynamic";

const WalletMultiButtonDynamic = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

function MyApp({ Component, pageProps }: AppProps) {
  // Get OS-level preference for dark mode
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [theme, setTheme] = useState(themes.dark);
  
  // create react use effect hook that sets dark mode to OS-level preference on load
  useEffect(() => {
    prefersDarkMode && setTheme(themes.dark);
  }, [prefersDarkMode]);

  const toggleDarkMode = (useDark: boolean) => {
    setTheme(useDark ? themes.dark : themes.light);
  };

  return (
    <ThemeProvider theme={theme} >
      <ContextProvider>
        <CssBaseline enableColorScheme />
        <WalletModalProvider>
          <AppBar setTheme={toggleDarkMode} />
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
        theme={theme.palette.mode === "dark" ? "light" : "dark"}
      />
    </ThemeProvider>
  );
}

export default MyApp;
