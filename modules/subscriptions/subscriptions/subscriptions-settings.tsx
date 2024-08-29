import React, { useEffect, useState } from "react";
import { GlobalCore } from "@/core/module/module.types";
import styles from "./styles/subscriptions-settings.module.css";
import { useTranslation } from "react-i18next";
import Spinner from "@/resources/containers/spinner";
import Service from "@/core/module/service.factory";
import { useRouter } from "next/router";
import moment from "moment";
import Table from "@/resources/table";
import ConfirmDialog from "@/resources/containers/delete-confirmation";
import Badge from '@/resources/badge'

import { FaMoneyBillTransfer } from "react-icons/fa6";
import { GenesisInvoice, SubscriptionResponse } from "@/core/module/core.types";
import MessageHandler from "@/core/message-handler";
import Button from "@/resources/containers/button";

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
      render: (item) => <>{moment(item.created_at).format("DD MMM, YYYY")}</>,
    },
    {
      title: t("invoice-history.validity-th"),
      render: (item) => <>{moment(+item.metadata.period_end * 1000).format("DD MMM, YYYY")}</>,
    },
    {
      title: t("invoice-history.amount-th"),
      render: (item) => <span>€ {(item.amount / 100).toFixed(2)}</span>,
    },
    {
      title: t("invoice-history.action-th"),
      render: (item) => (
        <div style={{ display: "flex", justifyContent: "end" }}>
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

  const handleSort = (key: string, column: string) => {
    console.log({ key, column });
  };

  return (
    <div className="container mx-auto" data-testid="payment-history.main">
      <Table<GenesisInvoice>
        data={data}
        columns={columns}
        onSort={handleSort}
        isLoading={isLoading}
        data-testid="payment-history.main"
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

const CancelSubscriptonBtn = () => {
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
        onConfirm={onConfirm}
        title={t("subscription-settings.confirm-title")}
        message={t("subscription-settings.confirm-message")}
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
  const [subscription, setSubscription] = useState<SubscriptionResponse>();

  useEffect(() => {
    void (async () => {
      const data = await Service.require(
        "subscriptions"
      ).getActiveSubscription();
      setIsLoading(false);
      setSubscription(data || {});
    })();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  const validUntil = subscription?.id
    ? moment(subscription?.current_period_end || "").format("DD MMM, YYYY")
    : t("subscription-settings.inactive-label");
  const badgeClass = subscription?.id ? 'success' : 'warning'

  return (
    <div className={styles.container}>
      <main
        className={styles.contentWrapper}
        data-testid="subscriptions-settings.main"
      >
        <div className={styles.head}>
          <div className={styles.left}>
            <h2>
              {t("subscription-settings.exp-label")} <Badge variant={badgeClass}>{validUntil}</Badge>
            </h2>
          </div>
          <div className={styles.right}>
            {subscription?.status === "active" ? (
              <CancelSubscriptonBtn />
            ) : (
              <Button
                onClick={() => {
                  router.push("/app/subscriptions");
                }}
                variant="primary"
              >
                {t("subscription-settings.subscribe-btn")}
              </Button>
            )}
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
