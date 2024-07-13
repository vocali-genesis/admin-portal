import React, { useState } from "react";
// import ReactQuill from "react-quill";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import quill_styles from "./styles/quill-editor.module.css";

interface reportEditorProps {
  content?: string;
  onContentChange: (content: string) => void;
}

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const Editor: React.FC<reportEditorProps> = ({ content, onContentChange }) => {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
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
    "image",
  ];

  return (
    <div className={quill_styles.editor}>
      <ReactQuill
        theme="snow"
        value={content}
        onChange={onContentChange}
        modules={modules}
        formats={formats}
        className={quill_styles.quill}
      />
    </div>
  );
};

export default Editor;