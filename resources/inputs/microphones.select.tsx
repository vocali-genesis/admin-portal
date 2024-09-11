import React, { useState, useEffect, useCallback } from "react";
import MessageHandler from "@/core/message-handler";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import { BasicSelect } from "./basic-select.input";

const messageHandler = MessageHandler.get();

export const MicrophoneSelect = ({
  value,
  onChange,
}: {
  value: string;
  onChange: (deviceId: string) => void;
}) => {
  const { t } = useTranslation();

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | "">("");

  const setUpDevices = useCallback(async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter(
      (device) => device.kind === "audioinput"
    );
    // If no granted is undefined
    const defaultDevice = !!audioInputDevices[0]?.deviceId;

    setPermissionGranted(!!defaultDevice);
    setDevices(audioInputDevices);
    if (defaultDevice) {
      onChange(audioInputDevices[0].deviceId);
    }
  }, [onChange, setPermissionGranted]);

  const requestPermissions = useCallback(() => {
    async function request() {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        void setUpDevices();
      } catch (error) {
        console.error("Error getting audio devices:", error);
        messageHandler.handleError("resources.microphone-error");
      }
    }
    void request();
  }, [setUpDevices]);

  /**
   * Check on load if the permissions are given
   */
  useEffect(() => {
    void setUpDevices();
  }, [setUpDevices]);

  /**
   * Listen to devices changes
   */
  useEffect(() => {
    if (!permissionGranted) {
      return;
    }
    navigator.mediaDevices.addEventListener("devicechange", requestPermissions);
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        requestPermissions
      );
    };
  }, [permissionGranted, requestPermissions]);

  // Not ready
  if (permissionGranted === "") {
    return;
  }
  if (!permissionGranted) {
    return (
      <PermissionButton onClick={requestPermissions}>
        {t("resources.allow-permissions")}
      </PermissionButton>
    );
  }

  return (
    <BasicSelect
      name="microphone-select"
      value={value}
      onChange={onChange}
      className="max-w-[300px]"
      options={devices.map((device) => ({
        value: device.deviceId,
        label:
          device.label ||
          `Microphone ${device.deviceId.slice(0, 5)}`,
      }))}
    />
  );
};

const PermissionButton = styled.button`
  background-color: #59dbbc;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  font-size: 1.9vh;
  margin-bottom: 2vh;
`;