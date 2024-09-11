import React, { useState, useRef, useCallback } from "react";
import Image from "next/image";
import MessageHandler from "@/core/message-handler";
import { useTranslation } from "react-i18next";
import dash_styles from "./upload-file.module.css";
import { SmallSpinner } from "../containers/small-spinner";

const messageHandler = MessageHandler.get();
interface Props {
  onFile: (file: File) => void;
  testId?: string;
  errorLabel: string;
  accept: string;
  maxSizeMB: number;
  disabled?: boolean;
}
export const UploadFile = ({
  onFile,
  testId,
  accept,
  errorLabel,
  maxSizeMB,
  disabled,
}: Props) => {
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

  const handleFileSelection = useCallback(
    (file: File) => {
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        messageHandler.handleError(
          t("resources.file-too-large", { size: maxSizeMB })
        );
        return;
      }

      const formats = accept.split(",");
      const accepted = formats.find((format) =>
        file.type.includes(format.replace("/*", ""))
      );

      console.log({ accepted });
      if (!accepted) {
        messageHandler.handleError(errorLabel);
        return;
      }
      setSelectedFile(file);
    },
    [accept, t]
  );

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

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      setIsUploading(true);
      const files = e.dataTransfer.files;
      if (files.length) {
        handleFileSelection(files[0]);
      }
      setIsUploading(false);
    },
    [handleFileSelection]
  );

  return (
    <div>
      <div
        className={`
          ${dash_styles.uploadArea} ${isDragging ? dash_styles.dragging : ""}`}
        onDragEnter={disabled ? () => { } : handleDragEnter}
        onDragOver={disabled ? () => { } : handleDragOver}
        onDragLeave={disabled ? () => { } : handleDragLeave}
        onDrop={disabled ? () => { } : handleDrop}
        onClick={disabled ? () => { } : handleBrowseClick}
      >
        <Image
          src="/cloud-avatar.svg"
          alt={t("recording.upload")}
          width={50}
          height={50}
        />
        <p className={dash_styles.p}>
          {t("resources.drag-and-drop")}{" "}
          <span onClick={handleBrowseClick} className={dash_styles.browseLink}>
            {t("resources.browse")}
          </span>
        </p>
        <small className={dash_styles.small}>
          {t("resources.supported-format")}
        </small>
        <small className={dash_styles.small}>
          {t("resources.max-size")} {`${maxSizeMB}MB`}
        </small>
        {selectedFile && (
          <p className={dash_styles.selectedFile}>{selectedFile.name}</p>
        )}
      </div>
      <div className="flex justify-center m-4 md:hidden">
        <input
          data-testid={testId}
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept={accept}
          className="w-[120px] ml-[20px]"
        />
      </div>
      <button
        className={dash_styles.uploadButton}
        onClick={() => selectedFile && onFile(selectedFile)}
        disabled={!selectedFile || isUploading}
      >
        {isUploading && <SmallSpinner />}
        {t(isUploading ? "recording.uploading" : "recording.upload-files")}
      </button>
    </div>
  );
};
