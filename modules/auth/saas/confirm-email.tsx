import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GlobalCore } from "@/core/module/module.types";
import auth_style from "./auth.module.css";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

const ConfirmEmail = () => {
  const { t } = useTranslation();

  return (
    <div className={auth_style.rightColumnContent}>
      <Image
        src="/user.svg"
        alt={t("auth.login-register")}
        width={45}
        height={45}
      />
      <h1 className={auth_style.title}>{t("auth.confirm-email")}</h1>
      <Paragraph>
        {t("auth.confirm-email-text")}
      </Paragraph>
      <p className={auth_style.login_text}>
        {t("auth.email-confirmed")}{" "}
        <strong>
          <Link href="/auth/login" className={auth_style.register_link}>
            {t("auth.login")}
          </Link>
        </strong>
      </p>
    </div>
  );
};

const Paragraph = styled.p`
  color: rgb(0, 0, 0, 0.5);
  font-family: 'Montserrat', sans-serif;

  background-color: var(--primary);
  padding: 1rem 3rem;
  align-items: center;
  font-size: 0.75rem;
  border-radius: 3px;

  margin-bottom: 2rem;
`

GlobalCore.manager.auth("confirm-email", ConfirmEmail);
