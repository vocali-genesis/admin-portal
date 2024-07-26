import React, { useState, useEffect, useCallback } from "react";
import MessageHandler from "@/core/message-handler";
import { useTranslation } from "react-i18next";
import styled from 'styled-components';


const messageHandler = MessageHandler.get();

export const MicrophoneSelect = ({ value, onChange }: { value: string, onChange: (deviceId: string) => void }) => {
  const { t } = useTranslation();

  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [permissionGranted, setPermissionGranted] = useState<boolean | ''>('');

  const setUpDevices = useCallback(async () => {
    setPermissionGranted(true);
    const devices = await navigator.mediaDevices.enumerateDevices();
    const audioInputDevices = devices.filter(
      (device) => device.kind === "audioinput",
    );
    // If no granted is undefined
    const defaultDevice = !!audioInputDevices[0]?.deviceId
    setPermissionGranted(!!defaultDevice)
    setDevices(audioInputDevices);
    defaultDevice && onChange(audioInputDevices[0].deviceId);
  }, [onChange, setPermissionGranted])

  const requestPermissions = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setUpDevices()
    } catch (error) {
      console.error("Error getting audio devices:", error);
      messageHandler.handleError(
        "resources.microphone-error",
      );
    }
  }, [setUpDevices]);

  /**
   * Check on load if the permissions are given
   */
  useEffect(() => {
    setUpDevices()
  }, [setUpDevices])

  /**
   * Listen to devices changes
   */
  useEffect(() => {
    if (!permissionGranted) { return }
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

  }, [permissionGranted, requestPermissions]);

  // Not ready
  if (permissionGranted === '') {
    return
  }

  if (!permissionGranted) {
    return (
      <PermissionButton
        onClick={requestPermissions}
      >
        {t("recording.allow-permissions")}
      </PermissionButton>
    )
  }

  return (
    <DeviceSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      {
        devices.map((device) => (
          <option key={device.deviceId} value={device.deviceId}>
            {device.label || `Microphone ${device.deviceId.slice(0, 5)}`}
          </option>
        ))
      }
    </DeviceSelect >
  );
};

const PermissionButton = styled.button`
  background-color: #59DBBC;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-family: "Montserrat", sans-serif;
  font-size: 1.9vh;
  margin-bottom: 2vh;
`
const DeviceSelect = styled.select`
  margin-bottom: 2vh;
  padding: 1vh;
  border-radius: 4px;
  border: 1px solid #ccc;
  color: black;
  font-family: "Montserrat", sans-serif;
  font-size: 2vh;
  width: 45vh;
`