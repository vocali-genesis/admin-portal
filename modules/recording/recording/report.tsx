import React, { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import Editor from "@/resources/inputs/text-editor";
import report_styles from "./styles/report.module.css";
import ViewContent from "@/resources/containers/view-content";
import { FaRegNewspaper, FaRegMessage } from "react-icons/fa6";

const Report = () => {
  // const { t } = useTransition()
  const router = useRouter();
  const { report, transcription } = router.query;
  const [activeTab, setActiveTab] = useState("report");
  const [reportContent, setReportContent] = useState((report as string) || "");
  const [transcriptionContent, setTranscriptionContent] = useState(
    (transcription as string) || "",
  );
  const [isEditing, setIsEditing] = useState(false);
  const [time, setTime] = useState({ transcription: 0, report: 0 });

  useEffect(() => {
    if (
      !router.query.report ||
      !router.query.transcription ||
      !router.query.time
    ) {
      router.push("/app/dashboard");
      return;
    }
    setReportContent(router.query.report as string);
    setTranscriptionContent(router.query.transcription as string);
    setTime(JSON.parse(router.query.time as string));
  }, [router.query]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleReportChange = (content: string) => {
    setReportContent(content);
  };

  const handleTranscriptionChange = (content: string) => {
    setTranscriptionContent(content);
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
              {Math.round(time.transcription / 1000)}s
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
              {Math.round(time.report / 1000)}s
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (isEditing) {
      return (
        <div className={report_styles.editorContainer}>
          <div
            className={
              activeTab === "report"
                ? report_styles.visibleEditor
                : report_styles.hiddenEditor
            }
          >
            <Editor
              content={reportContent}
              onContentChange={handleReportChange}
            />
          </div>
          <div
            className={
              activeTab === "transcription"
                ? report_styles.visibleEditor
                : report_styles.hiddenEditor
            }
          >
            <Editor
              content={transcriptionContent}
              onContentChange={handleTranscriptionChange}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={report_styles.viewContainer}>
          <div
            className={
              activeTab === "report"
                ? report_styles.visibleContent
                : report_styles.hiddenContent
            }
          >
            <ViewContent content={reportContent} />
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
    }
  };

  return (
    <div className={report_styles.reportContainer}>
      <h1 className={report_styles.title}>ESTADISTICAS</h1>
      <div className={report_styles.progressContainer}>
        {renderProgressBar()}
        <div className={report_styles.downloadButton}>
          <button>DOWNLOAD▼</button>
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
            Report
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
            Transcription
          </button>
        </div>
      </div>
      {renderContent()}
      <div className={report_styles.actionButtons}>
        {isEditing ? (
          <button className={report_styles.saveButton} onClick={toggleEditMode}>
            SAVE
          </button>
        ) : (
          <button className={report_styles.editButton} onClick={toggleEditMode}>
            EDIT
          </button>
        )}
        <button
          className={report_styles.newRecordingButton}
          onClick={() => router.push("/app/dashboard")}
        >
          NEW RECORDING
        </button>
      </div>
    </div>
  );
};

GlobalCore.manager.app("report", Report);
