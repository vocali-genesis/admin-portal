import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlobalCore } from "@/core/module/module.types";
import prices from "./pricing-config.json";
import Service from "@/core/module/service.factory";
import styles from "./styles/subscriptions.module.css";
import styled from "styled-components";
import { SubscriptionPriceData } from "@/core/module/core.types";

type Price = (typeof prices)[0];

const PriceCard = (props: { item: Price; index: number }) => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const {
    title,
    interval,
    amount,
    currency,
    features,
    buttonText,
    buttonAction,
  } = props.item;
  const [priceData, setPriceData] = useState<SubscriptionPriceData>();

  useEffect(() => {
    const getSubscriptionPrice = async () => {
      if (props.index === 1) {
        const data = await Service.require("subscriptions").getPrice();
        setPriceData(data as SubscriptionPriceData);
      }
    }

    getSubscriptionPrice();
  }, [props.index]);

  const handleSubscribe = async () => {
    setIsLoading(true);
    const subscriptionLink =
      await Service.require("subscriptions").getSubscriptionLink();
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
    <div className={styles.pricingCard}>
      <div className={styles.priceTitle}>{t(title)}</div>
      <div className={styles.priceTag}>
        <span className={styles.priceCurrency}>
          {priceData && props.index === 1
            ? priceData.currency
            : t(currency)}
        </span>
        {priceData && priceData.price && props.index === 1
          ? priceData.price / 100
          : t(amount)}
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
        {isLoading ? <Spinner /> : t(buttonText)}
      </button>
    </div>
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
            <PriceCard key={idx} item={item} index={idx} />
          ))}
        </div>
      </main>
    </>
  );
};

const Spinner = styled.span`
  border: 2px solid #f3f3f3;
  border-top: 2px solid var(--primary);
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
`;

GlobalCore.manager.app("subscriptions", Subscriptions);
