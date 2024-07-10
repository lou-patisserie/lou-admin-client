import React from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const QuillEditor = dynamic(() => import("react-quill"), { ssr: false });

interface RichTextProps {
  value: string;
  onChange: (value: string) => void;
}

export default function RichText({ value, onChange }: RichTextProps) {
  const quillModules = {
    toolbar: [
      [{ header: [3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
    ],
  };

  const quillFormats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "align",
  ];

  return (
    <div className="min-h-200px w-full rounded-sm">
      <QuillEditor
        value={value}
        onChange={onChange}
        modules={quillModules}
        formats={quillFormats}
        className="w-full h-[100%] bg-white rounded-sm"
      />
    </div>
  );
}
