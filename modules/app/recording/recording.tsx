import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import { GlobalCore } from "@/core/module/module.types";
import Spinner from "@/resources/containers/spinner";
import messageHandler from "@/core/message-handler";
import {
  FaCirclePlay,
  FaCirclePause,
  FaBackwardStep,
  FaForwardStep,
  FaTrash,
  FaFloppyDisk,
  FaCircleStop,
} from "react-icons/fa6";
import Modal from "react-modal";
import MedicalTranscriptionAPI from "@/services/api/genesis-api.service";
import recording_styles from "./styles/recording.module.css";
import DeleteConfirmation from "@/resources/containers/delete-confirmation";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;
Modal.setAppElement("#__next");

const Recording = () => {
  const t = useTranslations("");
  const router = useRouter();
  const { audioUrl } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl as string;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!(audioUrl && audioRef.current)) return;

    audioRef.current[isPlaying ? "pause" : "play"]();
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;

    setCurrentTime(audioRef.current.currentTime);
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

  const handleStop = () => {
    if (!audioRef.current) return;

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
    updateSeekBarProgress();
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    updateSeekBarProgress();
  };

  const handleSave = () => {
    if (!(audioUrl && audioRef.current)) return;

    const anchor = document.createElement("a");
    anchor.href = audioUrl as string;

    anchor.download = typeof audioUrl === "string" ? audioUrl : audioUrl[0];

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleSubmit = async () => {
    if (!(audioUrl && audioRef.current)) return;

    setIsLoading(true);

    const response = await fetch(audioUrl as string);
    const blob = await response.blob();
    const file = new File([blob], "audio.mp3", { type: "audio/mpeg" });

    const api_response =
      await MedicalTranscriptionAPI.processAudioAndGenerateReport(file);

    if (api_response) {
      router.push({
        pathname: "/app/report",
        query: {
          report: api_response.report,
          transcription: api_response.transcription,
        },
      });
    } else {
      messageHandler.handleError("Failed to generate report");
      setIsLoading(false);
    }
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
          <h2>
            {t(
              "Record your consultation or upload an audio with the previously recorded consultation to generate a report",
            )}
          </h2>
          <p>{t("Activate the audio recorder")}</p>
        </div>
        <div className={recording_styles.audioPlayerContainer}>
          <div className={recording_styles.audioPlayer}>
            <audio
              ref={audioRef}
              src={audioUrl as string}
              onTimeUpdate={handleTimeUpdate}
              onLoadedData={handleLoadedMetadata}
              onDurationChange={handleLoadedMetadata}
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
              <span>{formatTime(duration)}</span>
            </div>
            <div className={recording_styles.controlsContainer}>
              <button
                onClick={handleDelete}
                className={recording_styles.actionButton}
              >
                <FaTrash size={16} style={{ color: "#DF4949" }} />
              </button>
              <button
                onClick={() => handleSkip(-30)}
                className={recording_styles.skipButton}
              >
                <FaBackwardStep size={16} style={{ color: "black" }} />
              </button>
              <div className={recording_styles.playPauseContainer}>
                {isPlaying ? (
                  <>
                    <button
                      onClick={togglePlayPause}
                      className={recording_styles.playPauseButton}
                    >
                      <FaCirclePause
                        size={40}
                        color="#59DBBC"
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </button>
                    <button
                      onClick={handleStop}
                      className={recording_styles.playPauseButton}
                    >
                      <FaCircleStop
                        size={40}
                        color="#DF4949"
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={togglePlayPause}
                    className={recording_styles.playPauseButton}
                  >
                    <FaCirclePlay
                      size={40}
                      color="#59DBBC"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "50%",
                      }}
                    />
                  </button>
                )}
              </div>
              <button
                onClick={() => handleSkip(30)}
                className={recording_styles.skipButton}
              >
                <FaForwardStep size={16} style={{ color: "black" }} />
              </button>
              <button
                onClick={handleSave}
                className={recording_styles.actionButton}
              >
                <FaFloppyDisk size={16} style={{ color: "blue" }} />
              </button>
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className={recording_styles.submitButton}
          >
            {t("Submit")}
          </button>
        </div>
      </main>
      <DeleteConfirmation
        isOpen={isDeleteModalOpen}
        onRequestClose={cancelDelete}
        onConfirm={confirmDelete}
      />
    </>
  );
};

GlobalCore.manager.app("recording", Recording);
