import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({ value, onChange, placeholder }) => {
  const quillInstanceRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    if (editorRef.current && !quillInstanceRef.current) {
      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: placeholder || "Enter description...",
        modules: {
          toolbar: [
            [{ font: ["serif", "sans", "monospace"] }],
            [{ header: 1 }, { header: 2 }],
            ["bold", "italic", "underline"],
            [{ size: ["small", false] }],
            ["blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ align: [] }],
          ],
        },
      });

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value);
      }

      quill.on("text-change", () => {
        const html = editorRef.current.querySelector(".ql-editor").innerHTML;
        onChange(html);
      });

      quillInstanceRef.current = quill;
    }

    return () => {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.off("text-change");
        if (editorRef.current) {
          const toolbar = editorRef.current.querySelector(".ql-toolbar");
          if (toolbar) {
            toolbar.remove();
          }
        }
        quillInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (
      quillInstanceRef.current &&
      value !== quillInstanceRef.current.root.innerHTML
    ) {
      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value]);

  return (
    <div className="h-40">
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor;
