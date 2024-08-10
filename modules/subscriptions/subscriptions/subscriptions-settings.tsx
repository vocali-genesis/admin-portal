import React, { useEffect, useState } from "react";
import { GlobalCore } from "@/core/module/module.types";
import styles from "./styles/subscriptions-settings.module.css";
import { useTranslation } from "react-i18next";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";
import { useRouter } from "next/router";
import moment from "moment";
import Table from "@/resources/table";

import { FaMoneyBillTransfer } from "react-icons/fa6";
import { SubscriptionResponse } from "@/core/module/services.types";

const PaymentHistory: React.FC = () => {
  const { t } = useTranslation();
  const columns: ColumnConfig<TableDataModel>[] = [
    {
      title: t("invoice-history.invoice-id-th"),
      dataIndex: "invoice_id",
      sorter: false,
    },
    {
      title: t("invoice-history.date-th"),
      render: (item) => <>{moment(item.created_at).format("DD MMM, YYYY")}</>,
    },
    {
      title: t("invoice-history.amount-th"),
      render: (item) => <span>€ {(item.amount / 100).toFixed(2)}</span>,
    },
    {
      title: t("invoice-history.action-th"),
      render: (item) => (
        <>
          <a href={item.invoice_url} className="text-blue-500" target="__blank">
            {t("invoice-history.view-receipt")}
          </a>
        </>
      ),
    },
  ];

  const [data, setData] = useState<[SubscriptionResponse] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const itemsPerPage = 5;
  const fromRange = currentPage * itemsPerPage - itemsPerPage;
  const toRange = fromRange + itemsPerPage - 1;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const loadData = () => {
    (async () => {
      setIsLoading(true);
      const { invoices, count } = await Service.get(
        "subscriptions"
      ).getInvoices(fromRange, toRange);
      setTotalRecords(count);
      setData(invoices);
      setIsLoading(false);
    })();
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const handleSort = (key: string, column: string) => {
    console.log({ key, column });
  };

  return (
    <div className="container mx-auto">
      <Table
        data={data}
        columns={columns}
        onSort={handleSort}
        isLoading={isLoading}
        pagination={{
          currentPage,
          totalPages,
          totalRecords,
          onPageChange: setCurrentPage,
          totalLabel: t("invoice-history.total-label"),
          pageLabel: t("invoice-history.page-label"),
          ofLabel: t("invoice-history.of-label"),
        }}
      />
    </div>
  );
};

const Subscriptions = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionResponse>();

  useEffect(() => {
    (async () => {
      const data = await Service.get("subscriptions").getActiveSubscription();
      setIsLoading(false);
      if (!data || !data.status || data.status !== "active") {
        return router.push("/app/subscriptions");
      }
      setSubscription(data);
    })();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const validUntil = moment(subscription?.current_period_end || "").format(
    "DD MMM, YYYY"
  );

  return (
    <div className={styles.container}>
      <main className={styles.contentWrapper}>
        <div className={styles.head}>
          <div className={styles.left}>
            <span>
              {t("subscription-settings.exp-label")} {validUntil}
            </span>
          </div>
          <div className={styles.right}>
            <button className={styles.cancelBtn}>
              {t("subscription-settings.cancel-sub-btn")}
            </button>
          </div>
        </div>
        <div className={styles.content}>
          <h2 className={styles.title}>
            {t("subscription-settings.payment-history")}
          </h2>
          <PaymentHistory />
        </div>
      </main>
    </div>
  );
};

GlobalCore.manager.settings("subscriptions", Subscriptions);
GlobalCore.manager.menuSettings({
  label: "subscription-settings.menu",
  icon: FaMoneyBillTransfer,
  url: "subscriptions",
  order: 1,
});
