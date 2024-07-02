import "@/styles/globals.css";
import { AppProps } from "next/app";
import { NextIntlClientProvider } from "next-intl";
import { useRouter } from "next/router";
import { TranslatedToaster } from "@/resources/containers/translated-toaster";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";

function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <NextIntlClientProvider
      locale={router.locale || "en"}
      timeZone="Europe/Vienna"
      messages={pageProps.messages}
    >
      <TranslatedToaster />
      <Component {...pageProps} />
    </NextIntlClientProvider>
  );
}

export default App;

export const getStaticProps = getStaticPropsWithTranslations;
