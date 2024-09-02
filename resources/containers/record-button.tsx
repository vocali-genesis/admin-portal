import React from "react";
import { FaMicrophone, FaPause } from "react-icons/fa6";
import record_btn_styles from "./styles/record-button.module.css";

interface RecordButtonProps {
  recordingState: "inactive" | "recording" | "paused";
  audioLevel: number;
  onClick: () => void;
  statusMessage: string;
  disabled?: boolean;
}

const RecordButton: React.FC<RecordButtonProps> = ({
  recordingState,
  audioLevel,
  onClick,
  statusMessage,
  disabled,
}) => {
  return (
    <>
      <button
        data-testid="record-button"
        className={`${record_btn_styles.recordButton} ${
          recordingState === "recording"
            ? record_btn_styles.recording
            : recordingState === "paused"
              ? record_btn_styles.paused
              : ""
        }`}
        onClick={onClick}
        style={{
          transform: `scale(${1 + audioLevel * 0.4})`,
          transition: "transform 0s ease-in-out",
        }}
        disabled={disabled}
      >
        {recordingState === "recording" ? (
          <FaPause size={40} />
        ) : recordingState === "paused" ? (
          <FaMicrophone size={40} />
        ) : (
          <FaMicrophone size={40} />
        )}
      </button>
      <p className={record_btn_styles.p}>{statusMessage}</p>
    </>
  );
};

export default RecordButton;
