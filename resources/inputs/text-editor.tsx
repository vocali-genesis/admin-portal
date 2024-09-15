import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import quill_styles from "./text-editor.module.css";
import Spinner from "@/resources/containers/spinner";

interface EditorProps {
  content: string;
  onContentChange: (content: string) => void;
  height?: string;
}

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
});

const Editor: React.FC<EditorProps> = ({
  content,
  onContentChange,
  height,
}) => {
  const modules = {
    toolbar: [
      [{ header: [2, 3 /* 1 */, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", /*"image"*/],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    // "image",
  ];

  const handleChange = (value: string, delta: unknown, source: string) => {
    if (source === "api") {
      return;
    }

    onContentChange(value);
  };

  // Patch, the numbers are not display as a string
  if (!Number.isNaN(+content)) {
    content = `<p>${content}</p>`;
  }

  return (
    <div className={quill_styles.c} style={{ height }}>
      <ReactQuill
        theme="snow"
        defaultValue={content}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className={quill_styles.quill}
      />
    </div>
  );
};

export default Editor;
