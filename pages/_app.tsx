import "./globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import "@/import";
import "@/core/i18n"

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <Toaster />
      <Component {...pageProps} />
    </>
  );
}

export default App;

