import "./globals.css";
import { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import { setLocale } from "@/resources/utils/translate";
import "@/import";
import "@/core/i18n"

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  setLocale(router.locale || "en", pageProps.messages);

  return (
    <NextIntlClientProvider
      locale={router.locale || "en"}
      timeZone="Europe/Vienna"
      messages={pageProps.messages}
    >
      <Toaster />
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}

export default App;

