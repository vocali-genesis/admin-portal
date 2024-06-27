import React from "react";
import { useTranslations } from "next-intl";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";

export const getStaticProps = getStaticPropsWithTranslations;

const Login: React.FC = () => {
  const t = useTranslations("common");

  return <h1>{t("login")}</h1>;
};

export default Login;
