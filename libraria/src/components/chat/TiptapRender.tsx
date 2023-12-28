import TipTapBlock from "@/components/tiptap/TipTapBlock";
import useTipTapEditor from "@/lib/hooks/useTipTapEditor";

function TiptapRender({ content, ...rest }) {
  const editor = useTipTapEditor(content, false);
  return (
    <TipTapBlock
      sx={{
        ".ProseMirror-trailingBreak": {
          display: "none !important",
        },
      }}
      editor={editor}
      border={0}
      px={JSON.stringify(content)?.includes("listItem") ? 4 : 0}
      minH={0}
      {...rest}
    />
  );
}

export default TiptapRender;
