import "./globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import "@/core/i18n"

// -- Dynamic file generated via pnpm load
import "@/import";
// --  End

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

