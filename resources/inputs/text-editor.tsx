import React, { useMemo } from "react";
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
      [{ header: [3 /*1, 2, 3,  */, false] }],
      // ["bold", "italic", "underline", "strike"],
      // [{ list: "ordered" }, { list: "bullet" }],
      // ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    // TODO: Talk to the client, how we render the report?
    // "bold",
    // "italic",
    // "underline",
    // "strike",
    // "list",
    // "bullet",
    // "link",
    // "image",
  ];

  const handleChange = (value: string, delta: unknown, source: string) => {
    if (source === "api") {
      return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(value, "text/html");

    const editorNodes = Array.from(doc.body.childNodes);
    const updatedContent = editorNodes.reduce(
      (json: Record<string, string>, node: ChildNode) => {
        // Title
        if (node.nodeName.toLocaleLowerCase() === "h3") {
          if (node.textContent) {
            json[node.textContent] = "";
          }
          return json;
        }
        // Paragraph, append to the last title
        if (node.nodeName.toLocaleLowerCase() === "p") {
          const lastKey = Object.keys(json).slice(-1)[0];
          if (lastKey) {
            json[lastKey] += node.textContent + "\n";
          }
          return json;
        }
        return json;
      },
      {} as Record<string, string>
    );

    onContentChange(updatedContent);
  };

  const htmlContent = useMemo(
    () =>
      Object.entries(content)
        .map(
          ([key, value]) =>
            `<div><h3>${key}</h3></div><div>${value}</div><div><br/></div>`
        )
        .join(""),
    [content]
  );

  return (
    <div className={quill_styles.editor}>
      <ReactQuill
        theme="snow"
        defaultValue={htmlContent}
        onChange={handleChange}
        modules={modules}
        formats={formats}
        className={quill_styles.quill}
      />
    </div>
  );
};

export default Editor;
