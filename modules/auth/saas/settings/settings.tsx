import React, { FormEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { GlobalCore } from "@/core/module/module.types";
import { settings_schema } from "./settings.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { LANGUAGES } from "@/core/constants";
import { useTranslation } from "react-i18next";
import MessageHandler from "@/core/message-handler";
import { useService } from "@/core/module/service.factory";
import { SettingsInputField } from "@/resources/inputs/settings-input-field";
import styled from "styled-components";
import SubmitButton from "@/resources/containers/submit.button";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import OAuthButton from "@/resources/containers/oauth.button";
import Service from "@/core/module/service.factory";
import BasicInput from "@/resources/inputs/basic-input";
import BasicPasswordInput from "@/resources/inputs/basic-password.input";
import { useRouter } from "next/router";

const messageHandler = MessageHandler.get();

const Settings = () => {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const authService = useService("oauth");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(settings_schema(t)),
  });

  const logout = () => {
    Service.require("oauth").logout();
    void router.push("/auth/login");
  };

  const handleRevokeOAuth = async (): Promise<void> => {
    const response = await Service.require("oauth").revokeOauth();
    if (response) {
      return logout();
    }
  };
  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      setIsSubmitting(true);
      const updatedUser = await authService.updateUser(
        data.email,
        data.password
      );

      if (updatedUser) {
        messageHandler.handleSuccess("Profile updated successfully");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <MainContent>
          <Form
            onSubmit={
              handleSubmit(onSubmit) as unknown as FormEventHandler<HTMLElement>
            }
          >
            <div className="w-full px-[1rem] py-[5rem]">
              <SettingsInputField
                name="email"
                label={t("settings.email")}
                error={errors["email"]}
              >
                <BasicInput type="email" id="email" {...register("email")} />
              </SettingsInputField>
              <SettingsInputField
                name="password"
                label={t("settings.new-password")}
                error={errors["password"]}
              >
                <BasicPasswordInput id="password" {...register("password")} />
              </SettingsInputField>
              <SettingsInputField
                name="confirm_password"
                label={t("settings.confirm-password")}
                error={errors["confirm_password"]}
              >
                <BasicPasswordInput
                  id="confirm_password"
                  {...register("confirm_password")}
                />
              </SettingsInputField>

              <div className="flex justify-center">
                <SubmitButton
                  isSubmitting={isSubmitting}
                  label={t("settings.save")}
                  testId="updateSettings"
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
      </ContentWrapper>
    </Container>
  );
};

GlobalCore.manager.settings("settings", Settings);
GlobalCore.manager.menuSettings({
  label: "settings.menu",
  icon: "/profile-avatar.svg",
  url: "settings",
  order: 0,
});

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
