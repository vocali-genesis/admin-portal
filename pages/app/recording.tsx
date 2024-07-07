import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { useTranslations } from "next-intl";
import Navbar from "@/resources/containers/nav";
import SideBar from "@/resources/containers/sidebar";
import recording_styles from "@/styles/pages/recording.module.css";
import { getStaticPropsWithTranslations } from "@/modules/lang/props";
import { GetStaticProps } from "next";

export const getStaticProps: GetStaticProps = getStaticPropsWithTranslations;

const Recording: React.FC = () => {
  const t = useTranslations("");
  const router = useRouter();
  const { audioUrl } = router.query;
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const sideBarItems = [
    { icon: "/recordings.svg", label: "Recordings" },
    { icon: "/history.svg", label: "Historical" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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
      console.log(audioRef.current.duration);
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

  const handleSubmit = () => {
    // Handle submission logic here
    console.log("Recording submitted");
  };

  const handleDelete = () => {
    router.push({
      pathname: "/app/dashboard",
    });
  };

  return (
    <div className={recording_styles.container}>
      <Navbar toggleSidebar={toggleSidebar} />
      <div className={recording_styles.contentWrapper}>
        <SideBar
          _activeTab={"Recordings"}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
          sideBarItems={sideBarItems}
        />
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
                  onClick={() => {
                    handleDelete;
                  }}
                  className={recording_styles.actionButton}
                >
                  <Image
                    src="/delete.svg"
                    alt="Delete"
                    width={15}
                    height={15}
                  />
                </button>
                <button
                  onClick={() => handleSkip(-30)}
                  className={recording_styles.skipButton}
                >
                  <Image
                    src="/back.svg"
                    alt="Backward"
                    width={15}
                    height={15}
                  />
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
                    />
                  ) : (
                    <Image src="/play.svg" alt="play" width={10} height={10} />
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
                  onClick={() => {
                    /* Handle save */
                  }}
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
      </div>
    </div>
  );
};

export default Recording;
