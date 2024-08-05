import "./globals.css";
import { AppProps } from "next/app";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

// -- Dynamic file generated via pnpm load
import "@/import";
// --  End

// Imports after the dynamic load
import "@/core/i18n"
// -- End

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

