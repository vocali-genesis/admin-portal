import React, { useEffect, useState } from "react";
import { GlobalCore } from "@/core/module/module.types";
import styles from "./styles/subscriptions.module.css";
import { useTranslation } from "react-i18next";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";
import { useRouter } from "next/router";
import moment from "moment";
import Table from "@/resources/table";

import { FaMoneyBillTransfer } from "react-icons/fa6";

const data: TableDataModel[] = [
  {
    id: "Invoice 1",
    date: new Date().toLocaleDateString(),
    plan: "Basic",
    amount: "€ 200",
  },
  {
    id: "Invoice 2",
    date: new Date().toLocaleDateString(),
    plan: "Basic",
    amount: "€ 150",
  },
];

[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].forEach(
  (i) => {
    data.push({
      id: `Invoice ${i}`,
      date: new Date().toLocaleDateString(),
      plan: "Basic",
      amount: "€ 150",
    });
  }
);

const PaymentHistory: React.FC = () => {
  const columns: ColumnConfig<TableDataModel>[] = [
    { title: "Invoice ID", dataIndex: "id", sorter: true },
    {
      title: "Date",
      render: (item) => <span>{item.date}</span>,
    },
    {
      title: "Plan",
      render: (item) => <span>{item.plan}</span>,
      sorter: true,
    },
    { title: "Amount", dataIndex: "amount" },
    {
      title: "Actions",
      render: () => (
        <>
          <a href="#">Download</a> | <a href="#">View</a>
        </>
      ),
    },
  ];

  const itemsPerPage = 5;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);
  const intialData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const [paginatedData, setPaginatedData] =
    useState<TableDataModel[]>(intialData);

  useEffect(() => {
    setPaginatedData(() => {
      return data.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      );
    });
  }, [currentPage]);

  const handleSort = (key: string, column: string) => {
    console.log({ key, column });
  };

  return (
    <div className="container mx-auto">
      <Table
        data={paginatedData}
        columns={columns}
        onSort={handleSort}
        pagination={{
          currentPage,
          totalPages,
          totalRecords,
          onPageChange: setCurrentPage,
        }}
      />
    </div>
  );
};

const Subscriptions = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] =
    useState<Record<string, string | number>>();

  useEffect(() => {
    (async () => {
      const data = await Service.get("subscriptions").getActiveSubscription();
      setIsLoading(false);
      if (!data.status || data.status !== "active") {
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
  console.log(GlobalCore.manager.settings);
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
