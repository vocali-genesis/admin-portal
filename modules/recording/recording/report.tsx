import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import Editor from "@/resources/inputs/text-editor";
import report_styles from "./styles/report.module.css";
import ViewContent from "@/resources/containers/view-content";
import MessageHandler from "@/core/message-handler";
import { FaRegNewspaper, FaRegMessage, FaPlay, FaPause } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Button from "@/resources/containers/button";
import Download from "./libs/download";
import ProgressBar from "@/resources/containers/progress-bar";

const messageHandler = MessageHandler.get();

const Report = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { audioUrl } = router.query;
  const [activeTab, setActiveTab] = useState("report");
  const [reportContent, setReportContent] = useState({});
  const [transcriptionContent, setTranscriptionContent] = useState<string[]>(
    [],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [time, setTime] = useState({ transcription: 0, report: 0 });
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioLength, setAudioLength] = useState(0);
  const [originalReportContent, setOriginalReportContent] = useState({});

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

    setReportContent(JSON.parse(router.query.report as string));
    setOriginalReportContent(JSON.parse(router.query.report as string));
    setTranscriptionContent(router.query.transcription as string[]);
    setTime(JSON.parse(router.query.time as string));

    if (audioRef.current) {
      audioRef.current.onloadedmetadata = () => {
        setAudioLength(audioRef.current!.duration);
      };
    }
  }, [router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleReportChange = (content: any) => {
    setReportContent(content);
  };

  const toggleEditMode = () => {
    if (isEditing) {
      setOriginalReportContent(reportContent);
    } else {
      setOriginalReportContent(reportContent);
    }
    setIsEditing(!isEditing);
  };

  const handleCancelEdit = () => {
    setReportContent(originalReportContent);
    setIsEditing(false);
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
          {isEditing ? (
            <Editor
              content={reportContent}
              onContentChange={handleReportChange}
            />
          ) : (
            <ViewContent content={reportContent} />
          )}
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
    switch (type) {
      case "audio":
        if (audioUrl) {
          Download.downloadAudio(audioUrl as string);
        }
        break;
      case "report":
        Download.downloadReport(reportContent);
        break;
      case "transcription":
        Download.downloadTranscription(transcriptionContent);
        break;
    }
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
      <h1 className={report_styles.title}> {t("recording.statistics")}</h1>
      <div className={report_styles.progressContainer}>
        <ProgressBar time={time} audioLength={audioLength} testId="time-bar" />
        <div className={report_styles.downloadButton}>
          <button onClick={() => setIsDownloadOpen(!isDownloadOpen)}>
            <span>{t("recording.download")}</span>
            <span className={report_styles.dropdownArrow}>▼</span>
          </button>
          {isDownloadOpen && (
            <div className={report_styles.downloadDropdown}>
              <Button
                onClick={() => handleDownload("audio")}
                variant="action"
                testId="report.download-audio"
              >
                {t("recording.download-audio")}
              </Button>
              <Button
                onClick={() => handleDownload("report")}
                variant="action"
                testId="report.download-report"
              >
                {t("recording.download-report")}
              </Button>
              <Button
                onClick={() => handleDownload("transcription")}
                variant="action"
                testId="report.download-transcription"
              >
                {t("recording.download-transcription")}
              </Button>
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
            {t("recording.report")}
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
            {t("recording.transcription")}
          </button>
        </div>
      </div>
      {renderContent()}
      <div className={report_styles.actionButtons}>
        <Button
          testId="replay-audio"
          onClick={handleReplayAudio}
          variant="primary"
          className={`${report_styles.replayButton} ${
            isAudioPlaying ? report_styles.playing : ""
          }`}
        >
          {isAudioPlaying ? <FaPause /> : <FaPlay />}
          {isAudioPlaying
            ? t("recording.pause-audio")
            : t("recording.replay-audio")}
        </Button>
        <div>
          {activeTab === "report" && (
            <>
              {isEditing ? (
                <>
                  <Button
                    onClick={toggleEditMode}
                    variant="primary"
                    className={report_styles.saveButton}
                  >
                    {t("common.save")}
                  </Button>
                  <Button
                    onClick={handleCancelEdit}
                    variant="secondary"
                    className={report_styles.cancelButton}
                  >
                    {t("common.cancel")}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={toggleEditMode}
                  variant="secondary"
                  className={report_styles.editButton}
                >
                  {t("common.edit")}
                </Button>
              )}
            </>
          )}
          <Button
            onClick={() => router.push("/app/dashboard")}
            variant="primary"
            className={report_styles.newRecordingButton}
          >
            {t("recording.new-recording")}
          </Button>
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
