import React, { useState } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import Spinner from "@/resources/containers/spinner";

import recording_styles from "./styles/recording.module.css";
import { useTranslation } from "react-i18next";
import Service from "@/core/module/service.factory";
import Button from "@/resources/containers/button";
import { AudioPlayer } from "@/resources/media/audio-player";
import MessageHandler from "@/core/message-handler";
import OnLeaveConfirmation from "@/resources/containers/on-leave-confirmation";
import { BasicSelect } from "@/resources/inputs/basic-select.input";
import { GenesisTemplate } from "@/core/module/core.types";
import store from "@/core/store";
import { Provider } from "react-redux";
import { useTemplates } from "@/core/components/use-templates";

const messageHandler = MessageHandler.get();

const Recording = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [template, setTemplate] = useState<GenesisTemplate | null>(null);
  const { audioUrl } = router.query as { audioUrl: string };
  const { templates, isLoading, setIsLoading } = useTemplates();

  const handleSubmit = async () => {
    if (!audioUrl) {
      MessageHandler.get().handleError(t("recording.error-no-audio-file"));
      await router.replace("/app/dashboard");
      return;
    }

    setIsLoading(true);
    const response = await fetch(audioUrl);
    const blob = await response.blob();
    const file = new File([blob], "audio.mp3", { type: "audio/mpeg" });

    const api_response = await Service.require(
      "medical-api",
    ).processAudioAndGenerateReport(file, template as GenesisTemplate, "en");

    console.log(api_response);
    if (!api_response) {
      setIsLoading(false);

      return;
    }
    // TODO: Find a better way than the query parameter
    router.push({
      pathname: "/app/report",
      query: {
        audioUrl: audioUrl as string,
        report: JSON.stringify(api_response.report),
        transcription: api_response.transcription,
        time: JSON.stringify(api_response.time),
      },
    });
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <main className={recording_styles.mainContent}>
        <div className={recording_styles.instructions}>
          <h2 className={recording_styles.h2}>{t("recording.record-title")}</h2>
          <p className={recording_styles.p}>{t("recording.activate-audio")}</p>
        </div>
        <div className={recording_styles.audioPlayerContainer}>
          <AudioPlayer
            testId="audio-player"
            audioUrl={audioUrl}
            onDelete={() => void router.push("/app/dashboard")}
          />
          <BasicSelect
            name="template-select"
            value={template?.id.toString() as string}
            onChange={(value) => {
              const selectedTemplate = templates.find(
                (option) => option.id.toString() === value,
              );
              if (!selectedTemplate) {
                messageHandler.handleError(t("error-no-template"));
                return;
              }
              setTemplate(selectedTemplate);
            }}
            options={templates.map((template) => {
              return { value: template.id.toString(), label: template.name };
            })}
          />
          <Button
            onClick={() => void handleSubmit()}
            variant="primary"
            className={recording_styles.submitButton}
            testId="submit-button"
          >
            {t("recording.submit")}
          </Button>
        </div>
      </main>
      <OnLeaveConfirmation
        allowedRoutes={["/app/report", "/app/dashboard", "settings/settings"]}
      />
    </>
  );
};

GlobalCore.manager.app("recording", () => {
  return (
    <Provider store={store}>
      <Recording />
    </Provider>
  );
});
