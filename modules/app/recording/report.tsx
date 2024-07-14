import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
// import { useTranslations } from "next-intl";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import { GlobalCore } from "@/core/module/module.types";
import Editor from "@/core/components/text-editor";
import report_styles from "./styles/report.module.css";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Report = () => {
  // const t = useTranslations();
  const router = useRouter();
  const { report, transcription } = router.query;
  const [activeTab, setActiveTab] = useState("report");
  const [reportContent, setReportContent] = useState((report as string) || "");
  const [transcriptionContent, setTranscriptionContent] = useState(
    (transcription as string) || "",
  );

  useEffect(() => {
    // Assuming the router query contains 'report' and 'transcription'
    if (router.query.report) {
      setReportContent(router.query.report as string);
    }
    if (router.query.transcription) {
      setTranscriptionContent(router.query.transcription as string);
    }
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

  return (
    <div className={report_styles.reportContainer}>
      <h1 className={report_styles.title}>ESTADISTICAS</h1>
      <div className={report_styles.progressContainer}>
        <div className={report_styles.progressBar}>
          <span>Consulta Realizada En 30S</span>
          {/* Add progress bar implementation here */}
        </div>
        <div className={report_styles.downloadButton}>
          <button>DOWNLOAD ▼</button>
        </div>
      </div>
      <div className={report_styles.tabs}>
        <div
          className={`${activeTab === "report" ? report_styles.activeTab : ""} ${report_styles.tabContainer}`}
        >
          <Image
            className={report_styles.tabImage}
            src="/report.svg"
            alt=""
            width={13}
            height={13}
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
          <Image
            className={report_styles.tabImage}
            src="/transcription.svg"
            alt=""
            width={13}
            height={13}
          />
          <button
            className={`${report_styles.tabButton}`}
            onClick={() => handleTabChange("transcription")}
          >
            Transcription
          </button>
        </div>
      </div>
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
      <div className={report_styles.actionButtons}>
        <button className={report_styles.saveButton}>SAVE</button>
        <button className={report_styles.newRecordingButton}>
          NEW RECORDING
        </button>
      </div>
    </div>
  );
};

GlobalCore.manager.app("report", Report);
