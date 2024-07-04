import React from "react";
import { useTranslations } from "next-intl";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";

export const getStaticProps = getStaticPropsWithTranslations;

const Dashboard: React.FC = () => {
  const t = useTranslations("");

  return <h1>{t("Dashboard")}</h1>;
};

export default Dashboard;
