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
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import BasicInput from "@/resources/inputs/basic-input";
import BasicPasswordInput from "@/resources/inputs/basic-password.input";
import store, { RootState } from '@/core/store';
import { emailSchema, passwordSchema } from "./settings.schema";

const messageHandler = MessageHandler.get();

const Settings = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const authService = useService("oauth");
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  
  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: errorsEmail },
  } = useForm({
    resolver: yupResolver(emailSchema(t)),
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm({
    resolver: yupResolver(passwordSchema(t)),
  });

  const onSubmitEmail = async (data: { email: string }) => {
    try {
      setIsSubmittingEmail(true);
      const updatedUser = await authService.updateUser(data.email);
      if (updatedUser) {
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

  return (
    <Container>
      <ContentWrapper>
        <MainContent>
          <Form onSubmit={handleSubmitEmail(onSubmitEmail)}>
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