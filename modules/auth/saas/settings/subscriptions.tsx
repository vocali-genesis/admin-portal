import React, { useEffect, useState } from "react";
import { GlobalCore } from "@/core/module/module.types";
import styles from "./styles/subscriptions.module.css";
import { useTranslation } from "react-i18next";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";
import { useRouter } from "next/router";
import moment from "moment";

import { FaMoneyBillTransfer } from "react-icons/fa6";

const Subscriptions = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] =
    useState<Record<string, string | number>>();

  useEffect(() => {
    (async () => {
      const data = await Service.get("subscriptions")?.getActiveSubscription();
      setIsLoading(false); 
      if (!data || !data.status || data.status !== "active") {
        return router.push("/app/subscriptions");
      }
      setSubscription(data);
    })();
  }, [router]);

  if (isLoading) {
    return <Spinner />;
  }

  const validUntil = moment(subscription?.current_period_end || "").format(
    "DD MMM, YYYY"
  );
  console.log(GlobalCore.manager.settings);
  return (
    <div className={styles.container}>
      <main className={styles.contentWrapper}>
        <div className={styles.head}>
          <div className={styles.left}>
            <span>
              {t("settings.subscriptions.exp-label")} {validUntil}
            </span>
          </div>
          <div className={styles.right}>
            <button className={styles.cancelBtn}>
              {t("settings.subscriptions.cancel-sub-btn")}
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {t("settings.subscriptions.payment-history")}
          </h2>
        </div>
      </main>
    </div>
  );
};

GlobalCore.manager.settings("subscriptions", Subscriptions);
GlobalCore.manager.menuSettings({
  label: "settings.subscriptions.menu",
  icon: FaMoneyBillTransfer,
  url: "subscriptions",
  order: 1,
});
