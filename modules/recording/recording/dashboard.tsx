import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import MessageHandler from "@/core/message-handler";
import { AudioRecorder } from "./libs/audio-recorder";
import { FaMicrophone, FaPause, FaStop, FaPlay } from "react-icons/fa6";
import dash_styles from "./styles/dashboard.module.css";
import { useTranslation } from "react-i18next";
import { MicrophoneSelect } from "../../../resources/inputs/microphones.select";
import { UploadFile } from "@/resources/inputs/upload-file.input";

const messageHandler = MessageHandler.get();

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [recordingState, setRecordingState] = useState<
    "inactive" | "recording" | "paused"
  >("inactive");
  const [microphone, setMicrophone] = useState("");
  const audioRecorderRef = useRef<AudioRecorder | null>(null);

  const toggleRecording = async () => {
    if (!microphone) {
      messageHandler.handleError(t("recording.permission-required"));
      return;
    }

    if (!audioRecorderRef.current) {
      audioRecorderRef.current = new AudioRecorder();
    }

    if (recordingState === "inactive") {
      try {
        await audioRecorderRef.current.startRecording(microphone);
        messageHandler.info(t("recording.started"));
        setRecordingState("recording");
      } catch (error) {
        messageHandler.handleError((error as Error).message);
      }
      return;
    }
    if (recordingState === "recording") {
      audioRecorderRef.current.pauseRecording();
      messageHandler.info(t("recording.paused"));
      setRecordingState("paused");
      return;
    }
    if (recordingState === "paused") {
      await audioRecorderRef.current.startRecording(microphone);
      messageHandler.info(t("recording.resumed"));
      setRecordingState("recording");
      return;
    }
  };

  const stopRecording = async () => {
    if (audioRecorderRef.current && recordingState !== "inactive") {
      try {
        const audioUrl = await audioRecorderRef.current.stopRecording();
        messageHandler.info(t("recording.stopped"));
        setRecordingState("inactive");

        router.push({
          pathname: "/app/recording",
          query: { audioUrl: audioUrl },
        });
      } catch (error) {
        messageHandler.handleError((error as Error).message);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioRecorderRef.current) {
        audioRecorderRef.current.dispose();
      }
    };
  }, []);

  const handleUpload = (selectedFile: File) => {
    if (selectedFile) {
      const audioUrl = URL.createObjectURL(selectedFile);
      router.push({
        pathname: "/app/recording",
        query: { audioUrl: audioUrl },
      });
    } else {
      messageHandler.handleError(t("recording.select-file-upload"));
    }
  };
  return (
    <div className="p-5">
      <h2 className={dash_styles.h2}>{t("recording.record-title")}</h2>
      <p className={`${dash_styles.p} ${dash_styles.top_p}`}>
        {t("recording.activate-audio")}
      </p>

      <div className={dash_styles.contentColumns}>
        <div className={dash_styles.recordSection}>
          <MicrophoneSelect value={microphone} onChange={setMicrophone} />
          <button
            className={`${dash_styles.recordButton} ${
              recordingState === "recording"
                ? dash_styles.recording
                : recordingState === "paused"
                ? dash_styles.paused
                : ""
            }`}
            onClick={toggleRecording}
          >
            {recordingState === "recording" ? (
              <FaPause size={40} />
            ) : recordingState === "paused" ? (
              <FaPlay size={40} />
            ) : (
              <FaMicrophone size={40} />
            )}
          </button>
          <p className={dash_styles.p}>
            {recordingState === "recording"
              ? t("recording.click-to-pause")
              : recordingState === "paused"
              ? t("recording.click-to-resume")
              : t("recording.click-to-start")}
          </p>
          {recordingState !== "inactive" && (
            <button className={dash_styles.stopButton} onClick={stopRecording}>
              <FaStop size={20} style={{ marginRight: "10px" }} />
              {t("recording.stop")}
            </button>
          )}
        </div>

        <div className={dash_styles.divider}></div>

        <div className={dash_styles.uploadSection}>
          <h3 className={dash_styles.h3}>{t("recording.upload")}</h3>
          <UploadFile onFile={(file) => handleUpload(file)} />
        </div>
      </div>
    </div>
  );
};

GlobalCore.manager.app("dashboard", Dashboard, { default: true });
GlobalCore.manager.menu({
  label: "recording.menu",
  icon: "/recordings.svg",
  url: "dashboard",
  order: 0,
});
