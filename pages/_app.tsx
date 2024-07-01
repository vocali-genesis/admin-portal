import "@/styles/globals.css";
import { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { Toaster } from 'react-hot-toast';
import { useRouter } from "next/router";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <NextIntlClientProvider
      locale={router.locale}
      timeZone="Europe/Vienna"
      messages={pageProps.messages}
    >
      <Toaster />
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}

export default App;
