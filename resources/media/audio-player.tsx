import { useEffect, useRef, useState } from "react";
import {
  FaBackwardStep,
  FaCirclePause,
  FaCirclePlay,
  FaFloppyDisk,
  FaForwardStep,
  FaTrash,
} from "react-icons/fa6";
import IconButton from "@/resources/containers/icon-button";
import audioPlayer from "./audio-player.module.css";
import DeleteConfirmation from "../containers/delete-confirmation";
import Download from "@/modules/recording/recording/libs/download";

interface Props {
  audioUrl: string;
  onDelete?: () => void;
  testId?: string;
}

export const AudioPlayer = ({ audioUrl, onDelete, testId }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.load();
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current?.duration || 0);
      };
    }
  }, [audioUrl]);

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    setIsDeleteModalOpen(false);
    if (audioRef.current) {
      audioRef.current.src = "";
    }
    onDelete?.();
  };

  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleEnded = () => {
    if (!audioRef.current) return;

    setIsPlaying(false);
    setCurrentTime(audioRef.current.duration);
    updateSeekBarProgress();
  };

  const handleSave = () => {
    if (!(audioUrl && audioRef.current)) return;

    Download.downloadAudio(audioUrl as string);
  };

  const togglePlayPause = () => {
    if (!(audioUrl && audioRef.current)) return;

    void audioRef.current[isPlaying ? "pause" : "play"]();
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

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) {
      return "00:00";
    }

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
      `.${audioPlayer.seekBar}`,
    ) as HTMLInputElement;
    if (seekBar) {
      seekBar.style.setProperty("--seek-before-width", `${progressPercent}%`);
    }
  };

  return (
    <div className={audioPlayer.audioPlayer}>
      <audio
        data-testid={testId}
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={() => {
          setDuration(audioRef.current?.duration || 0);
        }}
        onDurationChange={() => {
          if (audioRef.current) setDuration(audioRef.current.duration);
        }}
        onEnded={handleEnded}
        preload="metadata"
      />
      <input
        type="range"
        min={0}
        max={duration || 1}  // To avoid NaN issues
        value={currentTime}
        onChange={handleSeek}
        className={audioPlayer.seekBar}
      />
      <div className={audioPlayer.timeDisplay}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
      <div className={audioPlayer.controlsContainer}>
        <IconButton
          onClick={handleDelete}
          className={audioPlayer.actionButton}
          size="small"
          name="delete"
          testId="recording.audio-delete"
        >
          <FaTrash size={16} style={{ color: "#DF4949" }} />
        </IconButton>

        <IconButton
          onClick={() => handleSkip(-30)}
          className={audioPlayer.skipButton}
          size="small"
          name="backward"
        >
          <FaBackwardStep size={16} style={{ color: "black" }} />
        </IconButton>

        <IconButton
          onClick={togglePlayPause}
          className={audioPlayer.playPauseButton}
          size="medium"
          name={isPlaying ? "pause" : "play"}
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
          className={audioPlayer.skipButton}
          size="small"
          name="forward"
        >
          <FaForwardStep size={16} style={{ color: "black" }} />
        </IconButton>

        <IconButton
          onClick={handleSave}
          className={audioPlayer.actionButton}
          size="small"
          name="save"
          testId="save-audio"
        >
          <FaFloppyDisk size={16} style={{ color: "blue" }} />
        </IconButton>
        <DeleteConfirmation
          testId="audio-delete"
          isOpen={isDeleteModalOpen}
          onRequestClose={cancelDelete}
          onConfirm={confirmDelete}
        />
      </div>
    </div>
  );
};
