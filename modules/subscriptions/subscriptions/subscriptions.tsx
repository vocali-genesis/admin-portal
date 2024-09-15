import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { GlobalCore } from "@/core/module/module.types";
import prices from "./pricing-config.json";
import Service from "@/core/module/service.factory";
import styles from "./styles/subscriptions.module.css";
import { SubscriptionPriceData } from "@/core/module/core.types";
import Button from "@/resources/containers/button";
import Spinner from "@/resources/containers/spinner";

type Price = (typeof prices)[0];

const PriceCard = (props: { item: Price; index: number }) => {
  const { t } = useTranslation();
  const {
    title,
    interval,
    amount,
    currency,
    features,
    buttonText,
    buttonAction,
  } = props.item;

  const handleSubscribe = async () => {
    const subscriptionLink =
      await Service.require("subscriptions").getSubscriptionLink();
    if (subscriptionLink) {
      window.location.href = subscriptionLink.url;
    }
  };

  const customAction = () => {
    if (!buttonAction) return;
    window.location.href = buttonAction;
  };

  return (
    <div className={styles.pricingCard}>
      <div className={styles.priceTitle}>{t(title)}</div>
      <div className={styles.priceTag}>
        <span className={styles.priceCurrency}>
          {t(currency)}
        </span>
        {t(amount)}
        <span className={styles.priceInterval}>{t(interval)}</span>
      </div>
      <hr className={styles.priceHr} />
      <ul className={styles.priceFeatList}>
        {features.map((feat, idx) => (
          <li key={idx}>{t(feat)}</li>
        ))}
      </ul>
      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={() =>
            buttonAction ? customAction() : handleSubscribe()
          }
        >
          {t(buttonText)}
        </Button>
      </div>
    </div >
  );
};

const Subscriptions = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSubscriptionPrice = async () => {
      setLoading(true)
      const data = await Service.require("subscriptions").getPrice();
      if (prices[1]) {
        prices[1].amount = data?.price ? (data.price / 100).toString() : "Error"
      }
      setLoading(false)
    }

    void getSubscriptionPrice();
  }, []);

  return (
    <>
      <main className={styles.mainContent}>
        <h1 className={styles.pricingTitle}>{t("subscriptions.title")}</h1>
        <p className={styles.pricingSubTitle}>{t("subscriptions.sub-title")}</p>

        {loading ? <Spinner /> :
          <div className={styles.pricingCardsWrapper}>
            {prices.map((item, idx) => (
              <PriceCard key={idx} item={item} index={idx} />
            ))}
          </div>
        }

      </main>
    </>
  );
};

GlobalCore.manager.app("subscriptions", Subscriptions);
