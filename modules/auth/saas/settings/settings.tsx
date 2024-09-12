import React, { useState } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import { Provider, useSelector } from "react-redux";
import styled from "styled-components";

import { GlobalCore } from "@/core/module/module.types";
import { LANGUAGES } from "@/core/constants";
import MessageHandler from "@/core/message-handler";
import { useService } from "@/core/module/service.factory";
import { SettingsInputField } from "@/resources/inputs/settings-input-field";
import SubmitButton from "@/resources/containers/submit.button";
import Button from "@/resources/containers/button";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import BasicInput from "@/resources/inputs/basic-input";
import BasicPasswordInput from "@/resources/inputs/basic-password.input";
import store, { RootState } from '@/core/store';
import { emailSchema, passwordSchema } from "./settings.schema";
import ConfirmModal from "@/resources/containers/confirm-modal";

const messageHandler = MessageHandler.get();

const Settings = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const authService = useService("oauth");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
    watch,
  } = useForm({
    resolver: yupResolver(emailSchema(t)),
  });
  const emailValue = watch("email");

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: yupResolver(passwordSchema(t)),
  });

  const handleEmailSubmit = async (data: { email: string }) => {
    try {
      setIsSubmittingEmail(true);
      const updatedUser = await authService.updateUser(data.email);
      if (updatedUser) {
        await authService.logout();
        router.push("/auth/confirm-email");
        messageHandler.handleSuccess(t("settings.email-update-success"));
      }
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  const onSubmitPassword = async (data: { password: string }) => {
    try {
      setIsSubmittingPassword(true);
      const updatedUser = await authService.updateUser(undefined, data.password);
      if (updatedUser) {
        messageHandler.handleSuccess(t("settings.password-update-success"));
      }
    } finally {
      setIsSubmittingPassword(false);
    }
  };

  const confirmEmailUpdate = () => {
    handleSubmitEmail(handleEmailSubmit)();
    setIsConfirmModalOpen(false);
  };

  return (
    <Container>
      <ContentWrapper>
        <MainContent>
          <Form>
            <div className="w-full px-[1rem] py-[2rem]">
              <SettingsInputField
                name="email"
                label={t("settings.email")}
                error={errorsEmail["email"]}
              >
                <BasicInput
                  type="email"
                  id="email"
                  {...registerEmail("email")}
                  defaultValue={user?.email}
                />
              </SettingsInputField>
              <div className="flex justify-center">
                <SubmitButton
                  isSubmitting={isSubmittingEmail}
                  label={t("settings.save-email")}
                  testId="updateEmail"
                  onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                    event?.preventDefault();
                    setIsConfirmModalOpen(true);
                  }}
                  disabled={emailValue === user?.email}
                />
              </div>
            </div>
          </Form>

          <Divider />

          <Form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <div className="w-full px-[1rem] py-[2rem]">
              <SettingsInputField
                name="password"
                label={t("settings.new-password")}
                error={errorsPassword["password"]}
              >
                <BasicPasswordInput id="password" {...registerPassword("password")} />
              </SettingsInputField>
              <SettingsInputField
                name="confirm_password"
                label={t("settings.confirm-password")}
                error={errorsPassword["confirm_password"]}
              >
                <BasicPasswordInput
                  id="confirm_password"
                  {...registerPassword("confirm_password")}
                />
              </SettingsInputField>
              <div className="flex justify-center">
                <SubmitButton
                  isSubmitting={isSubmittingPassword}
                  label={t("settings.save-password")}
                  testId="updatePassword"
                />
              </div>
            </div>
          </Form>

          {/*
          The logic is not right:
          - If we have login, we can revoke
           - If we have not, we can connect
           - If we revoke we can reconnect
           - If we have only google connection, it shall not allow us to revoke it
           Will be done in another task
          <Divider />
          <OAuthButton
            provider="google"
            label={t("settings.revoke")}
            onClick={handleRevokeOAuth}
          /> */}
          <Divider />

          <SettingsInputField name="language" label={t("settings.language")}>
            <BasicSelect
              name="language"
              value={i18n.language}
              onChange={(lang: string) => void i18n.changeLanguage(lang)}
              options={LANGUAGES.map((lang) => ({
                value: lang,
                label: lang.toUpperCase(),
              }))}
            />
          </SettingsInputField>
        </MainContent>
        <ConfirmModal
          testId="settings.confirm-modal"
          isOpen={isConfirmModalOpen}
          onRequestClose={() => setIsConfirmModalOpen(false)}
          title={t("settings.update-email-title")}
          message={t("settings.update-email-message")}
          confirmButtonText={t("settings.save-email")}
          onConfirm={confirmEmailUpdate}
        />
      </ContentWrapper>
    </Container>
  );
};

GlobalCore.manager.settings("settings", () => {
  return (
    <Provider store={store}>
      <Settings />
    </Provider>
  );
});

GlobalCore.manager.menuSettings({
  label: "settings.menu",
  icon: "/profile-avatar.svg",
  url: "settings",
  order: 0,
});

// Styled components remain the same
const Form = styled.form`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Divider = styled.div`
  width: 100%;
  height: 0.1px;
  background-color: rgb(0, 0, 0, 0.3);
  margin-bottom: 2rem;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: white;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  overflow: hidden;
`;

const MainContent = styled.main`
  flex-grow: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SocialLoginWrapper = styled.div`
  padding: 3vh 12.5vh 1vh 12.5vh;
`;