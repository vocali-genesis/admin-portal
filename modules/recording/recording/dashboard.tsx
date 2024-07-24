import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import MessageHandler from "@/core/message-handler";
import { AudioRecorder } from "./libs/audio-recorder";
import { FaMicrophone, FaPause, FaStop, FaPlay } from "react-icons/fa6";
import dash_styles from "./styles/dashboard.module.css";
import { useTranslation } from "react-i18next";

const messageHandler = MessageHandler.get();

const Dashboard = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [recordingState, setRecordingState] = useState<
    "inactive" | "recording" | "paused"
  >("inactive");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [permissionGranted, setPermissionGranted] = useState(false);

  const requestPermissions = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setPermissionGranted(true);
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputDevices = devices.filter(
        (device) => device.kind === "audioinput",
      );
      setDevices(audioInputDevices);
      if (audioInputDevices.length > 0) {
        setSelectedDevice(audioInputDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Error getting audio devices:", error);
      messageHandler.handleError(
        "Failed to get audio devices. Please ensure you've granted microphone permissions.",
      );
    }
  };

  useEffect(() => {
    if (permissionGranted) {
      navigator.mediaDevices.addEventListener(
        "devicechange",
        requestPermissions,
      );
      return () => {
        navigator.mediaDevices.removeEventListener(
          "devicechange",
          requestPermissions,
        );
      };
    }
  }, [permissionGranted]);

  const toggleRecording = async () => {
    if (!permissionGranted) {
      messageHandler.handleError(t("recording.permission-required"));
      return;
    }

    if (!audioRecorderRef.current) {
      audioRecorderRef.current = new AudioRecorder();
    }

    if (recordingState === "inactive") {
      try {
        await audioRecorderRef.current.startRecording(selectedDevice);
        messageHandler.info(t("recording.started"));
        setRecordingState("recording");
      } catch (error) {
        messageHandler.handleError((error as Error).message);
      }
    } else if (recordingState === "recording") {
      audioRecorderRef.current.pauseRecording();
      messageHandler.info(t("recording.paused"));
      setRecordingState("paused");
    } else if (recordingState === "paused") {
      await audioRecorderRef.current.startRecording(selectedDevice);
      messageHandler.info(t("recording.resumed"));
      setRecordingState("recording");
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

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    setIsUploading(true);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileSelection(files[0]);
    }
    setIsUploading(false);
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
    setIsUploading(false);
  };

  const handleFileSelection = (file: File) => {
    if (file.type.startsWith("audio/")) {
      setSelectedFile(file);
    } else {
      messageHandler.handleError(t("recording.select-file"));
    }
  };

  const handleUpload = () => {
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

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-5">
      <h2 className={dash_styles.h2}>{t("recording.record-title")}</h2>
      <p className={`${dash_styles.p} ${dash_styles.top_p}`}>
        {t("recording.activate-audio")}
      </p>

      <div className={dash_styles.contentColumns}>
        <div className={dash_styles.recordSection}>
          {!permissionGranted ? (
            <button
              className={dash_styles.permissionButton}
              onClick={requestPermissions}
            >
              {t("recording.allow-permissions")}
            </button>
          ) : (
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className={dash_styles.deviceSelect}
            >
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
                </option>
              ))}
            </select>
          )}
          <button
            className={`${dash_styles.recordButton} ${recordingState === "recording"
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
          <div
            className={`${dash_styles.uploadArea} ${isDragging ? dash_styles.dragging : ""
              }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <Image
              src="/cloud-avatar.svg"
              alt={t("recording.upload")}
              width={50}
              height={50}
            />
            <p className={dash_styles.p}>
              {t("recording.drag-and-drop")}{" "}
              <span
                onClick={handleBrowseClick}
                className={dash_styles.browseLink}
              >
                {t("recording.browse")}
              </span>
            </p>
            <small className={dash_styles.small}>
              {t("recording.supported-format")}
            </small>
            {selectedFile && (
              <p className={dash_styles.selectedFile}>{selectedFile.name}</p>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInput}
            accept="audio/*"
            style={{ display: "none" }}
          />
          <button
            className={dash_styles.uploadButton}
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? <span className={dash_styles.spinner}></span> : null}
            {t(isUploading ? "recording.uploading" : "recording.upload-files")}
          </button>
        </div>
      </div>
    </div>
  );
};

GlobalCore.manager.app("dashboard", Dashboard);
