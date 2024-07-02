import { GetStaticProps } from 'next';

export const getStaticPropsWithTranslations: GetStaticProps = async ({ locale }) => {
  const messages = await import(`@/modules/lang/${locale}/lang.json`);
  return {
    props: {
      messages: messages.default
    }
  };
};