import React, { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const QuillEditor = ({ value, onChange, placeholder }) => { // Functional component for the Quill editor
  const quillInstanceRef = useRef(null); // Ref to hold the Quill instance
  const editorRef = useRef(null); // Ref to hold the editor DOM element

  useEffect(() => { // Effect to initialize the Quill editor
    if (editorRef.current && !quillInstanceRef.current) { // Check if the editor is not already initialized
      const quill = new Quill(editorRef.current, { // Initialize Quill
        theme: "snow", // Theme for the editor
        placeholder: placeholder || "Enter description...", // Placeholder text
        modules: { // Quill modules
          toolbar: [ // Toolbar options
            [{ font: ["serif", "sans", "monospace"] }], // Font options
            ["bold", "italic", "underline"], // Text formatting options
            [{ size: ["small", false, "large"] }], // Size options
            ["blockquote"], // Blockquote option
            [{ list: "ordered" }, { list: "bullet" }], // List options
          ],
        },
      });

      if (value) { // If there is initial value, set it in the editor
        quill.clipboard.dangerouslyPasteHTML(value); // Set initial HTML content
      }

      quill.on("text-change", () => { // Listen for text changes in the editor
        const html = editorRef.current.querySelector(".ql-editor").innerHTML; // Get the HTML content
        onChange(html); // Call the onChange prop with the new HTML content
      });

      quillInstanceRef.current = quill; // Store the Quill instance in the ref
    }

    return () => { // Cleanup function to remove the Quill instance
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

  useEffect(() => { // Effect to update the editor content when the value prop changes
    if (
      quillInstanceRef.current &&
      value !== quillInstanceRef.current.root.innerHTML
    ) {
      quillInstanceRef.current.clipboard.dangerouslyPasteHTML(value || "");
    }
  }, [value]);

  return ( // Render the editor
    <div className="h-40">
      <div ref={editorRef} />
    </div>
  );
};

export default QuillEditor;
