import React from "react";
import progress_bar_styles from "./progress-bar.module.css";

interface ProgressBarProps {
  time: {
    transcription: number;
    report: number;
  };
  audioLength: number;
  testId?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  time,
  audioLength,
  testId,
}) => {
  const totalTime = time.transcription + time.report;
  const transcriptionWidth = (time.transcription / totalTime) * 100;
  const reportWidth = (time.report / totalTime) * 100;
  const audioWidth = ((audioLength * 1000) / totalTime) * 100;

  return (
    <div
      className={progress_bar_styles.progressBarContainer}
      data-testid={testId}
    >
      <div className={progress_bar_styles.progressBar}>
        <div
          className={progress_bar_styles.progressSegment}
          style={{
            width: `7.5px`,
            backgroundColor: "#59DBBC",
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
          }}
          title={`Audio Length: ${Math.round(audioLength)} seconds`}
        ></div>
        <div
          className={progress_bar_styles.progressSegment}
          style={{
            width: `${audioWidth}%`,
            backgroundColor: "#59DBBC",
          }}
          title={`Audio Length: ${Math.round(audioLength)} seconds`}
        >
          {audioLength !== Infinity && (
            <span className={progress_bar_styles.timeLabel}>
              {Math.round(audioLength)} s
            </span>
          )}
        </div>
        <div
          className={progress_bar_styles.progressSegment}
          style={{
            width: `${transcriptionWidth}%`,
            backgroundColor: "#FF6B6B",
          }}
          title={`Transcription Time: ${Math.round(time.transcription / 1000)} seconds`}
        >
          <span className={progress_bar_styles.timeLabel}>
            {Math.round(time.transcription / 1000)} s
          </span>
        </div>
        <div
          className={progress_bar_styles.progressSegment}
          style={{
            width: `${reportWidth}%`,
            backgroundColor: "#8359DB",
            borderTopRightRadius: "20px",
            borderBottomRightRadius: "20px",
          }}
          title={`Report Generation Time: ${Math.round(time.report / 1000)} seconds`}
        >
          <span className={progress_bar_styles.timeLabel}>
            {Math.round(time.report / 1000)} s
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
