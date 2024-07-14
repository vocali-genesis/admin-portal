import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";
import { GlobalCore } from "@/core/module/module.types";
import Spinner from "@/resources/containers/spinner";
import messageHandler from "@/core/message-handler";
import MedicalTranscriptionAPI from "@/services/api/genesis-api.service";
import recording_styles from "./styles/recording.module.css";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Recording = () => {
  const t = useTranslations("");
  const router = useRouter();
  const { audioUrl } = router.query;
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl as string;
      audioRef.current.load();
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      updateSeekBarProgress();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      updateSeekBarProgress();
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleSkip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const updateSeekBarProgress = () => {
    if (audioRef.current) {
      const progressPercent = (currentTime / duration) * 100;
      const seekBar = document.querySelector(
        `.${recording_styles.seekBar}`,
      ) as HTMLInputElement;
      if (seekBar) {
        seekBar.style.setProperty("--seek-before-width", `${progressPercent}%`);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(duration);
    updateSeekBarProgress();
  };

  const handleSave = () => {
    if (audioRef.current && audioUrl) {
      const anchor = document.createElement("a");
      anchor.href = audioUrl as string;

      anchor.download = typeof audioUrl === "string" ? audioUrl : audioUrl[0];

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (audioRef.current && audioUrl) {
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
    }
  };

  const handleDelete = () => {
    router.push({
      pathname: "/app/dashboard",
    });
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
                <Image src="/delete.svg" alt="Delete" width={15} height={15} />
              </button>
              <button
                onClick={() => handleSkip(-30)}
                className={recording_styles.skipButton}
              >
                <Image src="/back.svg" alt="Backward" width={15} height={15} />
              </button>
              <button
                onClick={togglePlayPause}
                className={recording_styles.playPauseButton}
              >
                {isPlaying ? (
                  <Image
                    src="/pause.png"
                    alt="pause"
                    width={20}
                    height={20}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                ) : (
                  <Image
                    src="/play.svg"
                    alt="play"
                    width={10}
                    height={10}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                )}
              </button>
              <button
                onClick={() => handleSkip(30)}
                className={recording_styles.skipButton}
              >
                <Image
                  src="/fast-forward.svg"
                  alt="Forward"
                  width={15}
                  height={15}
                />
              </button>
              <button
                onClick={handleSave}
                className={recording_styles.actionButton}
              >
                <Image src="/save.svg" alt="Save" width={15} height={15} />
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
    </>
  );
};

GlobalCore.manager.app("recording", Recording);
