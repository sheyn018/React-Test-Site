import { EditorContent } from "@tiptap/react";
import { Box, BoxProps } from "@chakra-ui/react";

const TipTapBlock = ({
  editor,
  documentRef,
  ...rest
}: {
  editor: any;
  documentRef?: any;
} & BoxProps) => {
  return (
    <div ref={documentRef}>
      <Box
        py={4}
        px={6}
        cursor={"text"}
        minH={500}
        fontSize="md"
        border="solid 2px"
        borderColor="bg-subtle"
        borderBottomRadius="5px"
        {...rest}
      >
        <EditorContent editor={editor} />
      </Box>
    </div>
  );
};

export default TipTapBlock;
