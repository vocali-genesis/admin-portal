import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import Editor from "@/resources/inputs/text-editor";
import report_styles from "./styles/report.module.css";
import ViewContent from "@/resources/containers/view-content";
import MessageHandler from "@/core/message-handler";
import { FaRegNewspaper, FaRegMessage, FaPlay, FaPause } from "react-icons/fa6";
import { useTranslation } from "react-i18next";

const messageHandler = MessageHandler.get();

const Report = () => {
  const router = useRouter();
  const { t } = useTranslation()
  const { report, transcription, audioUrl } = router.query;
  const [activeTab, setActiveTab] = useState("report");
  const [reportContent, setReportContent] = useState((report as string) || "");
  const [transcriptionContent, setTranscriptionContent] = useState<string[]>(
    [],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [time, setTime] = useState({ transcription: 0, report: 0 });
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    if (
      !router.query.report ||
      !router.query.transcription ||
      !router.query.time ||
      !router.query.audioUrl
    ) {
      router.push("/app/dashboard");
      return;
    }

    setReportContent(decodeURIComponent(router.query.report as string));
    setTranscriptionContent(JSON.parse(router.query.transcription as string));
    setTime(JSON.parse(router.query.time as string));
  }, [router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleReportChange = (content: string) => {
    setReportContent(content);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const renderProgressBar = () => {
    const totalTime = time.transcription + time.report;
    const transcriptionWidth = (time.transcription / totalTime) * 100;
    const reportWidth = (time.report / totalTime) * 100;

    return (
      <div className={report_styles.progressBarContainer}>
        <div className={report_styles.progressBar}>
          <div
            className={report_styles.progressSegment}
            style={{
              width: `${transcriptionWidth}%`,
              backgroundColor: "#FF6B6B",
              borderTopLeftRadius: "20px",
              borderBottomLeftRadius: "20px",
            }}
          >
            <span className={report_styles.timeLabel}>
              {Math.round(time.transcription / 1000)} s
            </span>
          </div>
          <div
            className={report_styles.progressSegment}
            style={{
              width: `${reportWidth}%`,
              backgroundColor: "#4ECDC4",
              borderTopRightRadius: "20px",
              borderBottomRightRadius: "20px",
            }}
          >
            <span className={report_styles.timeLabel}>
              {Math.round(time.report / 1000)}{" "}s
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={report_styles.viewContainer}>
        <div
          className={
            activeTab === "report"
              ? report_styles.visibleContent
              : report_styles.hiddenContent
          }
        >
          {isEditing ?
            <Editor
              content={reportContent}
              onContentChange={handleReportChange}
            /> :
            <ViewContent content={reportContent} />
          }
        </div>
        <div
          className={
            activeTab === "transcription"
              ? report_styles.visibleContent
              : report_styles.hiddenContent
          }
        >
          <ViewContent content={transcriptionContent} />
        </div>
      </div>
    );

  };

  const handleDownload = (type: string) => {
    let content = "";
    let filename = "";

    switch (type) {
      case "audio":
        window.open(audioUrl as string, "_blank");
        return;
      case "report":
        content = reportContent;
        filename = "report.txt";
        break;
      case "transcription":
        content = transcriptionContent.join("\n");
        filename = "transcription.txt";
        break;
    }

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleReplayAudio = () => {
    if (audioRef.current) {
      if (isAudioPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsAudioPlaying(!isAudioPlaying);
    }
  };

  return (
    <div className={report_styles.reportContainer}>
      <h1 className={report_styles.title}> {t('recording.statistics')}</h1>
      <div className={report_styles.progressContainer}>
        {renderProgressBar()}
        <div className={report_styles.downloadButton}>
          <button onClick={() => setIsDownloadOpen(!isDownloadOpen)}>
            <span>
              {t('recording.download')}
            </span>
            <span className={report_styles.dropdownArrow}>▼</span>
          </button>
          {isDownloadOpen && (
            <div className={report_styles.downloadDropdown}>
              <button onClick={() => handleDownload("audio")}>
                {t('recording.download-audio')}
              </button>
              <button onClick={() => handleDownload("report")}>
                {t('recording.download-audio')}
              </button>
              <button onClick={() => handleDownload("transcription")}>
                {t('recording.download-transcription')}
              </button>
            </div>
          )}
        </div>
      </div>
      <div className={report_styles.tabs}>
        <div
          className={`${activeTab === "report" ? report_styles.activeTab : ""} ${report_styles.tabContainer}`}
        >
          <FaRegNewspaper
            size={25}
            style={{ paddingTop: "1.15vh" }}
            className={`${activeTab === "report" ? report_styles.activeTabIcon : ""}`}
          />
          <button
            className={`${report_styles.tabButton}`}
            onClick={() => handleTabChange("report")}
          >
            {t('recording.report')}
          </button>
        </div>
        <div
          className={`${activeTab === "transcription" ? report_styles.activeTab : ""} ${report_styles.tabContainer}`}
        >
          <FaRegMessage
            size={25}
            style={{ paddingTop: "1.5vh" }}
            className={`${activeTab === "transcription" ? report_styles.activeTabIcon : ""}`}
          />
          <button
            className={`${report_styles.tabButton}`}
            onClick={() => handleTabChange("transcription")}
          >
            {t('recording.transcription')}
          </button>
        </div>
      </div>
      {renderContent()}
      <div className={report_styles.actionButtons}>
        <button
          className={`${report_styles.replayButton} ${isAudioPlaying ? report_styles.playing : ""}`}
          onClick={handleReplayAudio}
        >
          {isAudioPlaying ? <FaPause /> : <FaPlay />}
          {isAudioPlaying ? "Pause Audio" : "Replay Audio"}
        </button>
        <div>
          {activeTab === "report" && (
            <button
              className={isEditing ? report_styles.editButton : report_styles.saveButton}
              onClick={toggleEditMode}
            >
              {isEditing ? t('common.save') : t('common.edit')}
            </button>
          )}
          <button
            className={report_styles.newRecordingButton}
            onClick={() => router.push("/app/dashboard")}
          >
            {t('recording.new-recording')}
          </button>
        </div>
      </div>
      <audio
        ref={audioRef}
        src={audioUrl as string}
        style={{ display: "none" }}
        onEnded={() => setIsAudioPlaying(false)}
        onPause={() => setIsAudioPlaying(false)}
        onPlay={() => setIsAudioPlaying(true)}
      />
    </div>
  );
};

GlobalCore.manager.app("report", Report);
