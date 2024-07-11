import { GetStaticProps } from "next";
import { setLocale } from "@/resources/utils/translate";

export const getStaticPropsWithTranslations: GetStaticProps = async ({
  locale,
}) => {
  const messages = await import(`./${locale}/lang.json`);
  setLocale(locale as string, messages.default);

  return {
    props: {
      messages: messages.default,
    },
  };
};
