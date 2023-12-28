import TipTapBlock from "@/components/tiptap/TipTapBlock";
import useTipTapEditor from "@/lib/hooks/useTipTapEditor";
import { LibraryResponse } from "@/types";
import { LANGUAGE_CODE_TO_LANGUAGE_NAME } from "@/utils/languages";
import { modifiedParseJSON } from "@/utils/stringUtils";
import { Box, Heading } from "@chakra-ui/react";
import React, { useEffect } from "react";

type Props = {
  library: LibraryResponse;
  isCompact?: boolean;
  currentLang?: string;
};

function OracleHeader({ library, isCompact, currentLang }: Props) {
  const editor = useTipTapEditor("", false);

  useEffect(() => {
    if (library && editor) {
      const translatedDescription =
        library?.Greeting?.find(
          (g) => LANGUAGE_CODE_TO_LANGUAGE_NAME[g.language ?? ""] === currentLang,
        )?.assistantDescription ??
        library?.assistantDescription ??
        "Ask me anything!";
      // check if valid tiptap
      editor?.commands?.setContent(
        modifiedParseJSON(
          translatedDescription ?? "Ask me anything!",
          library?.assistantDescription,
        ),
      );
    }
  }, [currentLang, library, editor]);

  if (isCompact) {
    return null;
  }

  return (
    <>
      <Box px={{ base: "6", md: "8" }} textAlign="left">
        <Heading
          size={{
            base: "md",
            md: "lg",
          }}
          fontWeight="extrabold"
          letterSpacing="tight"
        >
          {library?.assistantName ?? library?.name ?? "your personal assistant"}
        </Heading>
        {editor && (
          <TipTapBlock
            px={1}
            fontSize={{
              base: "sm",
              md: "md",
            }}
            editor={editor}
            minH={50}
            border="none"
            borderBottomRadius="none"
          ></TipTapBlock>
        )}
      </Box>
    </>
  );
}

export default OracleHeader;
