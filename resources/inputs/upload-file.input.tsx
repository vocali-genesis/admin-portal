import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import MessageHandler from "@/core/message-handler";
import { useTranslation } from "react-i18next";
import { ButtonSpinner } from "../containers/button-spinner";
import dash_styles from "./upload-file.module.css";

const messageHandler = MessageHandler.get();

export const UploadFile = ({ onFile }: { onFile: (file: File) => void }) => {
  const { t } = useTranslation();
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);


  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsUploading(true);
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelection(files[0]);
    }
    setIsUploading(false);
  };

  const handleFileSelection = useCallback((file: File) => {
    if (!file.type.startsWith("audio/")) {
      messageHandler.handleError(t("recording.select-file"));
      return
    }
    setSelectedFile(file);
  }, [t]);

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };



  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    setIsUploading(true);
    const files = e.dataTransfer.files;
    if (files.length) {
      handleFileSelection(files[0]);
    }
    setIsUploading(false);
  }, [handleFileSelection]);



  return (
    <div>
      <div
        className={`
          ${dash_styles.uploadArea} ${isDragging ? dash_styles.dragging : ""
          }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
      >
        <Image
          src="/cloud-avatar.svg"
          alt={t("recording.upload")}
          width={50}
          height={50}
        />
        <p className={dash_styles.p}>
          {t("recording.drag-and-drop")}{" "}
          <span
            onClick={handleBrowseClick}
            className={dash_styles.browseLink}
          >
            {t("recording.browse")}
          </span>
        </p>
        <small className={dash_styles.small}>
          {t("recording.supported-format")}
        </small>
        {selectedFile && (
          <p className={dash_styles.selectedFile}>{selectedFile.name}</p>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="audio/*"
        style={{ display: "none" }}
      />

      <button
        className={dash_styles.uploadButton}
        onClick={() => selectedFile && onFile(selectedFile)}
        disabled={!selectedFile || isUploading}
      >
        <ButtonSpinner hidden={!isUploading} />
        {t(isUploading ? "recording.uploading" : "recording.upload-files")}
      </button>
    </div>
  );
};
