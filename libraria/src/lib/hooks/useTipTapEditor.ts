import { Content, useEditor } from "@tiptap/react";
import { TextAlign } from "@tiptap/extension-text-align";
import { Highlight } from "@tiptap/extension-highlight";
import { Underline } from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableRow } from "@tiptap/extension-table-row";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Link } from "@tiptap/extension-link";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import python from "highlight.js/lib/languages/python";
import { common, createLowlight } from "lowlight";
import CustomImage from "@/components/tiptap/TiptapEditor/CustomImage";
import { HardBreak } from "@tiptap/extension-hard-break";
import { StarterKit } from "@tiptap/starter-kit";
import { TableCell } from "@tiptap/extension-table-cell";

const lowlight = createLowlight(common);

// register all languages
lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
lowlight.register("python", python);

const TIPTAP_EXTENSIONS = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {
        class: "libraria-heading",
      },
    },
    paragraph: {
      HTMLAttributes: {
        class: "libraria-paragraph",
      },
    },
    codeBlock: false,
  }),
  Underline,
  TaskList,
  TaskItem,
  TableRow,
  TableHeader,
  TableCell,
  Link,
  Highlight,
  Subscript,
  HardBreak,
  Superscript,
  CustomImage,
  Table,
  TextAlign,
];

const useTipTapEditor = (
  content: string | Content = "",
  editable = true,
  dependencies = [],
  options = {},
) => {
  return useEditor(
    {
      extensions: TIPTAP_EXTENSIONS as any,
      content: content,
      editable: editable,
      ...options,
    },
    dependencies,
  );
};

export default useTipTapEditor;
