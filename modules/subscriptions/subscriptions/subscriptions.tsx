import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalCore } from "@/core/module/module.types";
import prices from "./pricing-config.json";
import Service from "@/core/module/service.factory";
import styles from "./styles/subscriptions.module.css";

type Price = (typeof prices)[0];

const PriceCard = (props: { item: Price }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    title,
    currency,
    amount,
    interval,
    features,
    bttonText,
    buttonAction,
  } = props.item;
  const handleSubscribe = async () => {
    setIsLoading(true);
    const subscriptionLink =
      await Service.get("subscriptions")?.getSubscriptionLink();
    if (subscriptionLink) {
      window.location.href = subscriptionLink.url;
    }
    setIsLoading(false);
  };
  const customAction = () => {
    if (!buttonAction) return;
    setIsLoading(true);
    window.location.href = buttonAction;
  };
  return (
    <>
      <div className={styles.pricingCard}>
        <div className={styles.priceTitle}>{t(title)}</div>
        <div className={styles.priceTag}>
          <span className={styles.priceCurrency}>{t(currency)}</span>
          {t(amount)}
          <span className={styles.priceInterval}>{t(interval)}</span>
        </div>
        <hr className={styles.priceHr} />
        <ul className={styles.priceFeatList}>
          {features.map((feat, idx) => (
            <li key={idx}>{t(feat)}</li>
          ))}
        </ul>
        <button
          onClick={() => {
            void (buttonAction ? customAction() : handleSubscribe());
          }}
          disabled={isLoading}
          className={styles.priceButton}
        >
          {t(bttonText)}
        </button>
      </div>
    </>
  );
};

const Subscriptions = () => {
  const { t } = useTranslation();
  return (
    <>
      <main className={styles.mainContent}>
        <h1 className={styles.pricingTitle}>{t("subscriptions.title")}</h1>
        <p className={styles.pricingSubTitle}>{t("subscriptions.sub-title")}</p>
        <div className={styles.pricingCardsWrapper}>
          {prices.map((item, idx) => (
            <PriceCard key={idx} item={item} />
          ))}
        </div>
      </main>
    </>
  );
};

GlobalCore.manager.app("subscriptions", Subscriptions);
