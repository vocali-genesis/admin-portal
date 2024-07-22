import { GlobalCore } from "@/core/module/module.types";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import messageHandler from "@/core/message-handler";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { AudioRecorder } from "@/modules/app/recording/libs/audio-recorder";
import dash_styles from "./styles/dashboard.module.css";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Dashboard = () => {
  const t = useTranslations("");
  const router = useRouter();
  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const audioRecorderRef = useRef<AudioRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");

  useEffect(() => {
    const getAudioDevices = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true }); // Request permission
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

    getAudioDevices();

    // Set up device change listener
    navigator.mediaDevices.addEventListener("devicechange", getAudioDevices);

    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        getAudioDevices,
      );
    };
  }, []);

  const toggleRecording = async () => {
    if (!audioRecorderRef.current) {
      audioRecorderRef.current = new AudioRecorder();
    }

    if (isRecording) {
      try {
        const audioUrl = await audioRecorderRef.current.stopRecording();
        messageHandler.info(t("Recording stopped"));
        setIsRecording(false);

        router.push({
          pathname: "/app/recording",
          query: { audioUrl: audioUrl },
        });
      } catch (error) {
        messageHandler.handleError((error as Error).message);
      }
    } else {
      try {
        await audioRecorderRef.current.startRecording(selectedDevice);
        messageHandler.info(t("Recording started"));
        setIsRecording(true);
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

    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileSelection(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    if (file.type.startsWith("audio/")) {
      setSelectedFile(file);
    } else {
      messageHandler.handleError(t("Please select an audio file"));
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      setIsUploading(true);
      const audioUrl = URL.createObjectURL(selectedFile);
      setIsUploading(false);
      router.push({
        pathname: "/app/recording",
        query: { audioUrl: audioUrl },
      });
    } else {
      messageHandler.handleError(t("Please select an audio file to upload"));
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="p-5">
      <h2 className={dash_styles.h2}>
        {t(
          "Record your consultation or upload an audio with the previously recorded consultation to generate a report",
        )}
      </h2>
      <p className={`${dash_styles.p} ${dash_styles.top_p}`}>
        {t("Activate the audio recorder")}
      </p>

      <div className={dash_styles.contentColumns}>
        <div className={dash_styles.recordSection}>
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
          <button
            className={`${dash_styles.recordButton} ${
              isRecording ? dash_styles.recording : ""
            }`}
            onClick={toggleRecording}
          >
            <Image
              src="/recordings.svg"
              alt="Microphone"
              width={60}
              height={60}
            />
          </button>
          <p className={dash_styles.p}>
            {isRecording
              ? t("Click To Stop Recording")
              : t("Click To Start Recording")}
          </p>
        </div>

        <div className={dash_styles.divider}></div>

        <div className={dash_styles.uploadSection}>
          <h3 className={dash_styles.h3}>{t("Upload")}</h3>
          <div
            className={`${dash_styles.uploadArea} ${
              isDragging ? dash_styles.dragging : ""
            }`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <Image
              src="/cloud-avatar.svg"
              alt="Upload"
              width={50}
              height={50}
            />
            <p className={dash_styles.p}>
              {t("Drag & Drop Or")}{" "}
              <span
                onClick={handleBrowseClick}
                className={dash_styles.browseLink}
              >
                {t("Browse")}
              </span>
            </p>
            <small className={dash_styles.small}>
              {t("Supported Formats: MP3. Max File Size: 50MB")}
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
            {isUploading ? (
              <>
                <span className={dash_styles.spinner}></span>
                {t("Uploading...")}
              </>
            ) : (
              t("Upload Files")
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

GlobalCore.manager.app("dashboard", Dashboard);
