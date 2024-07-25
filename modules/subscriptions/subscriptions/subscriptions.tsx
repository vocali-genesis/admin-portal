import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { GlobalCore } from "@/core/module/module.types";
import styles from "./styles/subscriptions.module.css";
import Service from "@/core/module/service.factory";

const Subscriptions = () => {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false)

  const handleSubscribe = async () => {
    setIsLoading(true)
    const { url } = await Service.get('subscriptions').getSubscriptionLink();
    if (url) {
      window.location.href = url;
    }
    setIsLoading(false)
  };

  return (
    <>
      <main className={styles.mainContent}>
        <h1 className={styles.pricingTitle}>
          Find the pricing plan for your business
        </h1>
        <p className={styles.pricingSubTitle}>
          Select the perfect paln for your business to grow
        </p>
        <div className={styles.pricingCardsWrapper}>
          <div className={styles.pricingCard}>
            <div className={styles.priceTitle}>FREE</div>
            <div className={styles.priceTag}>
              <span className={styles.priceCurrency}>€</span>0
              <span className={styles.priceInterval}>/month</span>
            </div>
            <hr className={styles.priceHr} />
            <ul className={styles.priceFeatList}>
              <li>Benefit 1</li>
            </ul>
            <button onClick={handleSubscribe} disabled={isLoading} className={styles.priceButton}>
              {t("TRY IT NOW")}
            </button>
          </div>
          <div className={styles.pricingCard}>
            <div className={styles.priceTitle}>PRO</div>
            <div className={styles.priceTag}>
              <span className={styles.priceCurrency}>€</span>100
              <span className={styles.priceInterval}>/month</span>
            </div>
            <hr className={styles.priceHr} />
            <ul className={styles.priceFeatList}>
              <li>Benefit 1</li>
              <li>Benefit 2</li>
              <li>Benefit 3</li>
            </ul>
            <button onClick={handleSubscribe} disabled={isLoading} className={styles.priceButton}>
              {t("SUBSCRIBE NOW")}
            </button>
          </div>
        </div>
      </main>
    </>
  );
};

GlobalCore.manager.app("subscriptions", Subscriptions);
