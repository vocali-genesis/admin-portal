import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import MessageHandler from "@/core/message-handler";
import { AudioRecorder } from "./libs/audio-recorder";
import { FaStop } from "react-icons/fa6";
import dash_styles from "./styles/dashboard.module.css";
import { useTranslation } from "react-i18next";
import { MicrophoneSelect } from "../../../resources/inputs/microphones.select";
import { UploadFile } from "@/resources/inputs/upload-file.input";
import RecordButton from "@/resources/containers/record-button";

const messageHandler = MessageHandler.get();

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [recordingState, setRecordingState] = useState<
    "inactive" | "recording" | "paused"
  >("inactive");
  const [microphone, setMicrophone] = useState("");
  const [audioLevel, setAudioLevel] = useState(0);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const toggleRecording = async () => {
    if (!microphone) {
      messageHandler.handleError(t("recording.permission-required"));
      return;
    }

    if (!audioRecorderRef.current) {
      audioRecorderRef.current = new AudioRecorder();
    }
    console.log({ audioRecorderRef, recordingState });
    if (recordingState === "inactive") {
      try {
        await audioRecorderRef.current.startRecording(microphone);
        messageHandler.info(t("recording.started"));
        setRecordingState("recording");
        startVisualization();
      } catch (error) {
        console.error(error);
        messageHandler.handleError((error as Error).message);
      }
      return;
    }

    if (recordingState === "recording") {
      audioRecorderRef.current.pauseRecording();
      messageHandler.info(t("recording.paused"));
      setRecordingState("paused");
      stopVisualization();
      return;
    }

    if (recordingState === "paused") {
      audioRecorderRef.current.resumeRecording();
      messageHandler.info(t("recording.resumed"));
      setRecordingState("recording");
      startVisualization();
      return;
    }
  };

  const stopRecording = async () => {
    console.log({ recordingState });
    if (!(audioRecorderRef.current && recordingState !== "inactive")) return;

    try {
      const audioUrl = await audioRecorderRef.current.stopRecording();
      messageHandler.info(t("recording.stopped"));
      setRecordingState("inactive");
      stopVisualization();
      router.push({
        pathname: "/app/recording",
        query: { audioUrl: audioUrl },
      });
    } catch (error) {
      messageHandler.handleError((error as Error).message);
    }
  };

  const startVisualization = () => {
    if (analyserRef.current) {
      analyserRef.current.disconnect();
    }

    if (!audioRecorderRef.current) return;

    const audioContext = audioRecorderRef.current.getAudioContext();
    const sourceNode = audioRecorderRef.current.getSourceNode();

    if (audioContext && sourceNode) {
      analyserRef.current = audioContext.createAnalyser();
      if (analyserRef.current) {
        analyserRef.current.fftSize = 256;
        sourceNode.connect(analyserRef.current);
      }
    }

    const updateVisualization = () => {
      if (!analyserRef.current) return;

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((acc, val) => acc + val, 0) / dataArray.length;
      setAudioLevel(average / 255);

      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };

    updateVisualization();
  };

  const stopVisualization = () => {
    if (!animationFrameRef.current) return;

    cancelAnimationFrame(animationFrameRef.current);
    setAudioLevel(0);
  };

  useEffect(() => {
    return () => {
      if (audioRecorderRef.current) {
        audioRecorderRef.current.dispose();
      }
      stopVisualization();
    };
  }, []);

  const handleUpload = (selectedFile: File) => {
    if (!selectedFile) {
      messageHandler.handleError(t("recording.select-file-upload"));
    }

    const audioUrl = URL.createObjectURL(selectedFile);
    router.push({
      pathname: "/app/recording",
      query: { audioUrl },
    });
  };

  const getStatusMessage = () => {
    const message: Record<typeof recordingState, string> = {
      recording: t("recording.click-to-pause"),
      paused: t("recording.click-to-resume"),
      inactive: t("recording.click-to-start"),
    };

    return message[recordingState];
  };
  return (
    <div className="p-5">
      <h2 className={dash_styles.h2}>{t("recording.record-title")}</h2>
      <p className={dash_styles.p}>{t("recording.activate-audio")}</p>

      <div className={dash_styles.contentColumns}>
        <div className={dash_styles.recordSection}>
          <MicrophoneSelect value={microphone} onChange={setMicrophone} />
          <RecordButton
            recordingState={recordingState}
            audioLevel={audioLevel}
            onClick={toggleRecording}
            statusMessage={getStatusMessage()}
          />
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
          <UploadFile
            accept="audio/*"
            errorLabel={t("recording.select-file")}
            onFile={(file) => handleUpload(file)}
            testId="upload-recording"
            maxSizeMB={30}
          />
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
