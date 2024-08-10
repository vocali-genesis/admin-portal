import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import quill_styles from "./text-editor.module.css";
import Spinner from "@/resources/containers/spinner";

interface EditorProps {
  content?: { [key: string]: string };
  onContentChange: (content: { [key: string]: string }) => void;
}

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <Spinner />,
});

const Editor: React.FC<EditorProps> = ({ content = {}, onContentChange }) => {
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

  const handleChange = (value: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(value, "text/html");
    const updatedContent: { [key: string]: string } = {};

    doc.body.childNodes.forEach((node: any) => {
      if (node.nodeName !== "P") return;

      const strong = node.querySelector("strong");
      if (!strong) return;

      const key = strong.textContent;
      const textValue = node.textContent.replace(strong.textContent, "").trim();
      updatedContent[key] = textValue;
    });

    onContentChange(updatedContent);
  };

  const htmlContent = Object.entries(content)
    .map(([key, value]) => `<p><strong>${key}</strong> ${value}</p>`)
    .join("");

  return (
    <div className={quill_styles.editor}>
      <ReactQuill
        theme="snow"
        value={htmlContent}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className={quill_styles.quill}
      />
    </div>
  );
};

export default Editor;
