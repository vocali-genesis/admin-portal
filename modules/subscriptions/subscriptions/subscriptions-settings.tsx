import React, { useEffect, useState } from "react";
import { GlobalCore } from "@/core/module/module.types";
import styles from "./styles/subscriptions-settings.module.css";
import { useTranslation } from "react-i18next";
import Service from "@/core/module/service.factory";
import { useRouter } from "next/router";
import moment from "moment";
import Table from "@/resources/table";
import ConfirmDialog from "@/resources/containers/delete-confirmation";
import Badge from "@/resources/containers/badge";

import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GenesisInvoice, GenesisSubscription } from "@/core/module/core.types";
import MessageHandler from "@/core/message-handler";
import Button from "@/resources/containers/button";
import { SmallSpinner } from "@/resources/containers/small-spinner";

const messageHandler = MessageHandler.get();

const PaymentHistory: React.FC = () => {
  const { t } = useTranslation();

  const columns: ColumnConfig<GenesisInvoice>[] = [
    {
      title: t("invoice-history.invoice-id-th"),
      dataIndex: "invoice_id",
      sorter: false,
    },
    {
      title: t("invoice-history.date-th"),
      render: (item) => (
        <>
          {item.created_at
            ? moment(item.created_at).format("DD MMM, YYYY")
            : ""}
        </>
      ),
    },
    {
      title: t("invoice-history.amount-th"),
      render: (item) => <span>€ {(item.amount / 100).toFixed(2)}</span>,
    },
    {
      title: t("invoice-history.action-th"),
      render: (item) => (
        <div style={{ display: "flex", justifyContent: "start" }}>
          <a href={item.invoice_url} className="text-blue-500" target="__blank">
            {t("invoice-history.view-receipt")}
          </a>
        </div>
      ),
    },
  ];

  const [data, setData] = useState<GenesisInvoice[] | []>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);

  const itemsPerPage = 5;
  const fromRange = currentPage * itemsPerPage - itemsPerPage;
  const toRange = fromRange + itemsPerPage - 1;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);

  const loadData = () => {
    void (async () => {
      setIsLoading(true);
      const { invoices, count } = await Service.require(
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



  return (
    <div className="container mx-auto">
      <Table<GenesisInvoice>
        data={data}
        columns={columns}
        isLoading={isLoading}
        pagination={{
          currentPage: totalPages ? currentPage : 0,
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

const CancelSubscriptionBtn = () => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onConfirm = async () => {
    setIsLoading(true);
    const data = await Service.require("subscriptions").cancelSubscription();
    if (data?.id) {
      messageHandler.handleSuccess(t("subscription-settings.success-message"));
      await router.push("/settings/subscriptions");
    }
    setIsOpen(false);
    setIsLoading(false);
  };
  const [subscription, setSubscription] = useState<GenesisSubscription>();

  const validUntil = subscription?.id
    ? moment(subscription?.current_period_end || "").format("DD MMM, YYYY")
    : t("subscription-settings.inactive-label");

  useEffect(() => {
    void (async () => {
      const data = await Service.require(
        "subscriptions"
      ).getActiveSubscription();
      setIsLoading(false);

      if (!data) { return }

      setSubscription(data);
    })();
  }, []);
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen(true);
        }}
        variant="danger"
      >
        {t("subscription-settings.cancel-sub-btn")}
      </Button>
      <ConfirmDialog
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        onConfirm={() => void onConfirm()}
        title={t("subscription-settings.confirm-title")}
        message={t("subscription-settings.confirm-message", { validUntil })}
        cancelButtonText={t("subscription-settings.cancel-btn")}
        confirmButtonText={t("subscription-settings.confirm-btn")}
        isLoading={isLoading}
      />
    </>
  );
};

const Subscriptions = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);
  const [subscription, setSubscription] = useState<GenesisSubscription>();

  useEffect(() => {
    void (async () => {
      const data = await Service.require("subscriptions").getActiveSubscription();
      setIsLoading(false);

      if (!data) { return }

      setSubscription(data);
    })();
  }, []);


  // Calculate the subscription end date
  const validUntil = subscription?.id
    ? moment(subscription?.current_period_end || "").format("DD MMM, YYYY")
    : t("subscription-settings.inactive-label");

  const badgeClass = subscription?.id ? "success" : "warning";

  const isCanceledButValid = subscription?.status === "canceled" && moment().isBefore(subscription?.current_period_end);

  function SubscriptionAction() {
    if (isLoading) {
      return
    }
    if (subscription?.status === "active") {
      return <CancelSubscriptionBtn />
    }
    return (
      <Button
        onClick={() => {
          void router.push("/app/subscriptions");
        }}
        variant="primary"
      >
        {t("subscription-settings.subscribe-btn")}
      </Button >
    )


  }
  return (
    <div className={styles.container}>
      <main className={styles.contentWrapper}>
        <div className={`${styles.head} flex justify-between items-center`}>
          <div className={styles.expiration}>
            <h2 className={styles.left} >
              {t("subscription-settings.exp-label")}
            </h2>
            {isLoading ? <SmallSpinner /> : <Badge variant={badgeClass}>{validUntil}</Badge>}
            {isCanceledButValid && (
              <span>
                <Badge variant={"warning"}>{t("subscription-settings.canceled-but-valid-warning")}</Badge>
              </span>
            )}
          </div>
          <div className={styles.right}>
            <SubscriptionAction />
          </div>
        </div>
        <div className={styles.content}>
          <h3 className={styles.title}>
            {t("subscription-settings.payment-history")}
          </h3>
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
