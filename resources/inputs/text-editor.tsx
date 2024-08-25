import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import quill_styles from "./text-editor.module.css";
import Spinner from "@/resources/containers/spinner";

interface EditorProps {
  content?: { [key: string]: string | object }; // Allow object values
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

  // Convert object to HTML with bold headers
  const objectToHtml = (content: { [key: string]: string | object }) => {
    const formatObject = (obj: any, indent = 0): string => {
      return Object.entries(obj)
        .map(([key, value]) => {
          const formattedKey = `${" ".repeat(indent * 2)}${key}:`;
          if (typeof value === "object" && value !== null) {
            return `${formattedKey}\n${formatObject(value, indent + 1)}`;
          }
          return `${formattedKey} ${value}`;
        })
        .join("\n");
    };

    return Object.entries(content)
      .map(([key, value]) => {
        if (typeof value === "object") {
          value = formatObject(value); // Format nested objects
        }
        return `<h3><strong>${key}</strong></h3><p>${value}</p>`;
      })
      .join("");
  };

  // Convert HTML to object
  const htmlToObject = (html: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const updatedContent: { [key: string]: string } = {};

    doc.querySelectorAll("h3").forEach((header) => {
      const key = header.textContent || "";
      const nextParagraph = header.nextElementSibling as HTMLParagraphElement;
      const value = nextParagraph ? nextParagraph.textContent || "" : "";
      updatedContent[key] = value;
    });

    return updatedContent;
  };

  const handleChange = (value: string) => {
    const updatedContent = htmlToObject(value);
    onContentChange(updatedContent);
  };

  const htmlContent = objectToHtml(content);

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
