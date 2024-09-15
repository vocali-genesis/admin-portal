import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import report_styles from "./report.module.css";
import ViewContent from "@/resources/containers/view-content";
import { FaRegNewspaper, FaRegMessage, FaPlay, FaPause } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import Button from "@/resources/containers/button";
import Download from "./libs/download";
import { ProgressBar } from "@/resources/containers/progress-bar";
import ViewContentEditable from "@/resources/containers/view-content-editable";
import { useReactToPrint } from 'react-to-print';
import { SubscriptionGuard } from "@/resources/guards/subscription.guard";
import OnLeaveConfirmation from "@/resources/containers/on-leave-confirmation";
import MessageHandler from "@/core/message-handler";

const messageHandler = MessageHandler.get();

const Report = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { audioUrl } = router.query as { audioUrl: string };
  const [activeTab, setActiveTab] = useState("report");
  const [reportContent, setReportContent] = useState({} as Record<string, string>);
  const [transcriptionContent, setTranscriptionContent] = useState<string[]>([]);
  const [time, setTime] = useState({ transcription: 0, report: 0 });
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [editingKeys, setEditingKeys] = useState<string[]>([]);

  useEffect(() => {
    if (
      !router.query.report ||
      !router.query.transcription ||
      !router.query.time ||
      !router.query.audioUrl
    ) {
      void router.push("/app/dashboard");
      return;
    }
    setReportContent(JSON.parse(router.query.report as string) as Record<string, string>);
    setTranscriptionContent(router.query.transcription as string[]);
    setTime(JSON.parse(router.query.time as string) as { transcription: number, report: number });
  }, [router]);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      const audio = audioRef.current;
      audio.src = audioUrl;
      audio.load();

      const setAudioDuration = () => {
        if (isFinite(audio.duration) && audio.duration > 0) {
          setDuration(audio.duration);
        } else {
          // Fallback for small files
          audio.currentTime = 1e101;
          audio.addEventListener('timeupdate', function getDuration() {
            if (isFinite(audio.duration) && audio.duration > 0) {
              setDuration(audio.duration);
              audio.removeEventListener('timeupdate', getDuration);
              audio.currentTime = 0;
            }
          });
        }
      };

      audio.addEventListener('loadedmetadata', setAudioDuration);
      audio.addEventListener('durationchange', setAudioDuration);
      setTimeout(() => {
        if (duration === 0) {
          setAudioDuration();
        }
      }, 500);

      return () => {
        audio.removeEventListener('loadedmetadata', setAudioDuration);
        audio.removeEventListener('durationchange', setAudioDuration);
      };
    }
  }, [audioUrl]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const componentRef = useRef<HTMLDivElement>(null);
  const [hideIcons, setHideIcons] = useState(false);
  const downloadPdf = useReactToPrint({
    pageStyle: 'margin: 2em',
    content: () => componentRef.current,
    documentTitle: 'Report',
    onAfterPrint: () => setHideIcons(false),
  });

  console.log({ downloadPdf, useReactToPrint })

  const handleDownloadPdf = () => {
    console.log({ downloadPdf })

    if (editingKeys.length) {
      messageHandler.handleError(t('recording.download-editing-warning'))
      return
    }
    setHideIcons(true);
    downloadPdf();
    setTimeout(() => {
      downloadPdf();
    }, 300);
  };

  const renderProgressBar = () => {
    const totalTime = time.transcription + time.report;
    const transcriptionWidth = (time.transcription / totalTime) * 100;
    const reportWidth = (time.report / totalTime) * 100;

    return (
      <div className="w-full flex gap-4 flex-col">
        <ProgressBar
          segments={[
            {
              percentage: 100,
              color: "#59DBB",
              label: t("recording.audio-time", {
                seconds: duration.toFixed(2),
              }),
            },
          ]}
        />
        <ProgressBar
          displayLabelMinPercentage={10}
          testId="time-bar"
          segments={[
            {
              percentage: transcriptionWidth,
              color: "#FF6B6B",
              label: t("recording.transcription-time", {
                seconds: (time.transcription / 1000).toFixed(2),
              }),
            },
            {
              percentage: reportWidth,
              color: "#8359DB",
              label: t("recording.report-time", {
                seconds: (time.report / 1000).toFixed(2),
              }),
            },
          ]}
        />
        <div className={report_styles.totalTime}>
          <span>{t("recording.total-time")}</span>:{" "}
          <span>{(totalTime / 1000).toFixed(2)}</span>{" "}
          <span>{t("recording.seconds")}</span>
        </div>
      </div>
    );
  };

  const renderContent = () => {

    return (
      <div className={report_styles.viewContainer}>
        <div ref={componentRef}
          className={
            activeTab === "report"
              ? report_styles.visibleContent
              : report_styles.hiddenContent
          }
        >
          {Object.entries(reportContent).map(
            ([title, content], index: number) => {
              return (
                <ViewContentEditable
                  hideIcons={hideIcons}
                  key={index}
                  title={title}
                  content={content}
                  onEdit={(title, content) => {
                    setReportContent({ ...reportContent, [title]: content });
                  }}
                  onEditStateChange={(state) => {
                    setEditingKeys(state ? [...editingKeys, title] : [...editingKeys.filter(key => key !== title)])
                  }}
                />
              );
            },
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

  const handleDownload = (type: string): Promise<void> | void => {
    const action = {
      'audio': async function () {
        if (audioUrl) {
          await Download.downloadAudio(audioUrl);
        }
      },
      'report': () => handleDownloadPdf(),
      'transcription': () => Download.downloadTranscription(transcriptionContent)

    }
    return action[type as keyof typeof action]?.()

  };

  const handleReplayAudio = () => {
    if (!audioRef.current) {
      return;
    }

    void (isAudioPlaying ? audioRef.current.pause() : audioRef.current.play());

    setIsAudioPlaying(!isAudioPlaying);
  };

  // TODO: Create a button select for this in resources
  function renderDownloadButton() {
    return (
      <div className={report_styles.downloadButton}>
        <button onClick={() => setIsDownloadOpen(!isDownloadOpen)}>
          <span>{t("recording.download")}</span>
          <span className={report_styles.dropdownArrow}>▼</span>
        </button>
        {isDownloadOpen && (
          <div className={report_styles.downloadDropdown}>
            <button onClick={() => void handleDownload("audio")}>
              {t("recording.download-audio")}
            </button>
            <button onClick={() => void handleDownload("report")}>
              {t("recording.download-report")}
            </button>
            <button onClick={() => void handleDownload("transcription")}>
              {t("recording.download-transcription")}
            </button>
          </div>
        )}
      </div >
    );
  }

  function renderTabs() {
    return (
      <div className={report_styles.tabs}>
        <div
          className={`${activeTab === "report" ? report_styles.activeTab : ""
            } ${report_styles.tabContainer}`}
        >
          <FaRegNewspaper
            size={25}
            style={{ paddingTop: "1.15vh" }}
            className={`${activeTab === "report" ? report_styles.activeTabIcon : ""
              }`}
          />
          <button
            className={`${report_styles.tabButton}`}
            onClick={() => handleTabChange("report")}
          >
            {t("recording.report")}
          </button>
        </div>
        <div
          className={`${activeTab === "transcription" ? report_styles.activeTab : ""
            } ${report_styles.tabContainer}`}
        >
          <FaRegMessage
            size={25}
            style={{ paddingTop: "1.5vh" }}
            className={`${activeTab === "transcription" ? report_styles.activeTabIcon : ""
              }`}
          />
          <button
            className={`${report_styles.tabButton}`}
            onClick={() => handleTabChange("transcription")}
          >
            {t("recording.transcription")}
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className={report_styles.reportContainer}>
      <div className={`${report_styles.topContainer}`}>
        <div className={"mobile-hidden flex flex-1"}>{renderProgressBar()}</div>
        {renderDownloadButton()}
      </div>
      {renderTabs()}
      {renderContent()}
      <div className={report_styles.actionButtons}>
        <Button
          testId="replay-audio"
          onClick={handleReplayAudio}
          variant="primary"
          className={`${report_styles.replayButton} ${isAudioPlaying ? report_styles.playing : ""
            }`}
        >
          {isAudioPlaying ? <FaPause /> : <FaPlay />}
          {isAudioPlaying
            ? t("recording.pause-audio")
            : t("recording.replay-audio")}
        </Button>
        <div className="flex" style={{ gap: "8px" }}>
          <Button
            onClick={() => void router.push("/app/dashboard")}
            variant="primary"
            className={report_styles.newRecordingButton}
          >
            {t("recording.new-recording")}
          </Button>
        </div>
        <audio
          ref={audioRef}
          src={audioUrl}
          onLoadedMetadata={() => {
            console.log({ duration: audioRef.current?.duration });
            setDuration(audioRef.current?.duration || 0);
          }}
          style={{ display: "none" }}
          onEnded={() => setIsAudioPlaying(false)}
          onPause={() => setIsAudioPlaying(false)}
          onPlay={() => setIsAudioPlaying(true)}
        />

      </div>
      <OnLeaveConfirmation />
    </div>
  );
};

GlobalCore.manager.app("report", () => <SubscriptionGuard><Report /></SubscriptionGuard>);
