import { GetStaticProps } from 'next';

export const getStaticPropsWithTranslations: GetStaticProps = async ({ locale }) => {
  const messages = await import(`./${locale}/lang.json`);
  return {
    props: {
      messages: messages.default
    }
  };
};