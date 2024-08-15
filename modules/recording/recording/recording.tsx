import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { GlobalCore } from "@/core/module/module.types";
import Spinner from "@/resources/containers/spinner";
import MessageHandler from "@/core/message-handler";
import {
  FaCirclePlay,
  FaCirclePause,
  FaBackwardStep,
  FaForwardStep,
  FaTrash,
  FaFloppyDisk,
  FaCircleStop,
} from "react-icons/fa6";
import recording_styles from "./styles/recording.module.css";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";
import { useTranslation } from "react-i18next";
import Service from "@/core/module/service.factory";
import Button from "@/resources/containers/button";
import IconButton from "@/resources/containers/icon-button";
import Download from "./libs/download";

const messageHandler = MessageHandler.get();

const Recording = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { audioUrl } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isLeavingPage, setIsLeavingPage] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleLeavePage = (event: BeforeUnloadEvent | PopStateEvent) => {
    if (event.type === "beforeunload") {
      event.preventDefault();
      event.returnValue = "";
    }
    setIsLeavingPage(true);
  };

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl as string;
      audioRef.current.load();
    }
  }, [audioUrl]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleLeavePage);
    window.addEventListener("popstate", handleLeavePage);

    return () => {
      window.removeEventListener("beforeunload", handleLeavePage);
      window.removeEventListener("popstate", handleLeavePage);
    };
  }, []);

  useEffect(() => {
    router.beforePopState(() => {
      setIsLeavingPage(true);
      return false;
    });

    return () => {
      router.beforePopState(() => true);
    };
  }, [router]);

  const togglePlayPause = () => {
    if (!(audioUrl && audioRef.current)) return;

    audioRef.current[isPlaying ? "pause" : "play"]();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
    updateSeekBarProgress();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;

    const time = Number(e.target.value);
    setCurrentTime(time);

    audioRef.current.currentTime = time;
    updateSeekBarProgress();
  };

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return;

    setDuration(audioRef.current.duration);
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;

    audioRef.current.currentTime += seconds;
  };

  const updateSeekBarProgress = () => {
    if (!audioRef.current) return;

    const progressPercent = (currentTime / duration) * 100;
    const seekBar = document.querySelector(
      `.${recording_styles.seekBar}`,
    ) as HTMLInputElement;
    if (seekBar) {
      seekBar.style.setProperty("--seek-before-width", `${progressPercent}%`);
    }
  };

  const handleEnded = () => {
    if (!audioRef.current) return;

    setIsPlaying(false);
    setCurrentTime(audioRef.current.duration);
    updateSeekBarProgress();
  };

  const handleSave = () => {
    if (!(audioUrl && audioRef.current)) return;

    Download.downloadAudio(audioUrl as string).catch((error) => {
      console.error("Error downloading audio:", error);
      messageHandler.handleError("Failed to download audio file");
    });
  };

  const handleSubmit = async () => {
    if (!(audioUrl && audioRef.current)) return;

    setIsLoading(true);
    const response = await fetch(audioUrl as string);
    const blob = await response.blob();
    const file = new File([blob], "audio.mp3", { type: "audio/mpeg" });

    const api_response =
      await Service.get("medical-api")?.processAudioAndGenerateReport(file);

    if (!api_response) {
      MessageHandler.get().handleError("Failed to generate report");
      return;
    }
    console.log({ api_response });
    // TODO: FInd a better way than teh query parameter
    router.push({
      pathname: "/app/report",
      query: {
        audioUrl: audioUrl as string,
        report: JSON.stringify(api_response.report),
        transcription: api_response.transcription,
        time: JSON.stringify(api_response.time),
      },
    });
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    router.push({
      pathname: "/app/dashboard",
    });
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  if (isLoading) return <Spinner />;

  return (
    <>
      <main className={recording_styles.mainContent}>
        <div className={recording_styles.instructions}>
          <h2 className={recording_styles.h2}>{t("recording.record-title")}</h2>
          <p className={recording_styles.p}>{t("recording.activate-audio")}</p>
        </div>
        <div className={recording_styles.audioPlayerContainer}>
          <div className={recording_styles.audioPlayer}>
            <audio
              ref={audioRef}
              src={audioUrl as string}
              onTimeUpdate={handleTimeUpdate}
              onLoadedData={handleLoadedMetadata}
              onDurationChange={() => {
                if (audioRef.current) setDuration(audioRef.current.duration);
              }}
              onEnded={handleEnded}
              preload="metadata"
            />
            <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              className={recording_styles.seekBar}
            />
            <div className={recording_styles.timeDisplay}>
              <span>{formatTime(currentTime)}</span>
              <span>
                {formatTime(duration) !== "Infinity:NaN"
                  ? formatTime(duration)
                  : ""}
              </span>
            </div>
            <div className={recording_styles.controlsContainer}>
              <IconButton
                onClick={handleDelete}
                className={recording_styles.actionButton}
                size="small"
              >
                <FaTrash size={16} style={{ color: "#DF4949" }} />
              </IconButton>

              <IconButton
                onClick={() => handleSkip(-30)}
                className={recording_styles.skipButton}
                size="small"
              >
                <FaBackwardStep size={16} style={{ color: "black" }} />
              </IconButton>

              <IconButton
                onClick={togglePlayPause}
                className={recording_styles.playPauseButton}
                size="medium"
              >
                {isPlaying ? (
                  <FaCirclePause
                    color="#59DBBC"
                    style={{ backgroundColor: "white", borderRadius: "50%" }}
                  />
                ) : (
                  <FaCirclePlay
                    color="#59DBBC"
                    style={{ backgroundColor: "white", borderRadius: "50%" }}
                  />
                )}
              </IconButton>

              <IconButton
                onClick={() => handleSkip(30)}
                className={recording_styles.skipButton}
                size="small"
              >
                <FaForwardStep size={16} style={{ color: "black" }} />
              </IconButton>

              <IconButton
                onClick={handleSave}
                className={recording_styles.actionButton}
                size="small"
              >
                <FaFloppyDisk size={16} style={{ color: "blue" }} />
              </IconButton>
            </div>
          </div>
          <Button
            onClick={handleSubmit}
            variant="primary"
            className={recording_styles.submitButton}
          >
            {t("recording.submit")}
          </Button>
        </div>
      </main>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen || isLeavingPage}
        onRequestClose={() => {
          setIsDeleteModalOpen(false);
          setIsLeavingPage(false);
        }}
        onConfirm={() => {
          if (isDeleteModalOpen) {
            confirmDelete();
          } else if (isLeavingPage) {
            router.push({
              pathname: "/app/dashboard",
            });
          }
        }}
        isLeavingPage={isLeavingPage}
      />
    </>
  );
};

GlobalCore.manager.app("recording", Recording);
