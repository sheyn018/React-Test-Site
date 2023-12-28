import CafeLink from "@/components/core/CafeLink";
import { CustomReactSelect } from "@/components/core/CustomReactSelect";
import TipTapBlock from "@/components/tiptap/TipTapBlock";
import useTipTapEditor from "@/lib/hooks/useTipTapEditor";
import { languages } from "@/utils/languages";
import { modifiedParseJSON } from "@/utils/stringUtils";
import { Box, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useMeasure } from "react-use";

function ChatFooter({ library, isPublicFacing, currentLang, setCurrentLang }) {
  const footerEditor = useTipTapEditor(modifiedParseJSON(library?.whiteLabelText ?? ""), false);
  const libraryColor = library?.assistantStyles?.["color"] ?? "blue.600";
  const [ref, { width }] = useMeasure();
  const direction = width < 200 ? "column" : "row";
  const footerPaddingBottom = width < 600 ? 1 : 4;
  const languagePaddingBottom = width < 600 ? 1 : 4;
  const whiteLabelPadding = width < 600 ? 1 : 4;

  return (
    <Flex ref={ref as any} direction={direction} align="center">
      {isPublicFacing && !library.whiteLabel && (
        <Box
          px={whiteLabelPadding}
          pb={footerPaddingBottom}
          fontSize={{
            base: "xs",
            md: "sm",
          }}
          color="gray.500"
          textAlign={"left"}
          w="full"
          borderColor="blackAlpha.100"
        >
          Powered with ❤️ and ☕️ by{" "}
          <CafeLink
            color="black !important"
            fontWeight="bold"
            href={"https://libraria.ai"}
            isExternal={true}
          >
            Libraria
          </CafeLink>
        </Box>
      )}
      {library.whiteLabelText && (
        <Box
          fontSize="xs"
          color={"subtle"}
          textAlign={"left"}
          w="full"
          alignItems="center"
          sx={{
            "& .ProseMirror > p": {
              "margin-bottom": "0 !important",
            },
            ".ProseMirror-trailingBreak": {
              display: "none !important",
            },
            a: {
              "text-decoration": "underline",
              "font-weight": "bold",
            },
          }}
        >
          <TipTapBlock
            px={1}
            color={"muted"}
            editor={footerEditor}
            minH={50}
            border="none"
            fontSize="xs"
            borderBottomRadius="none"
          ></TipTapBlock>
        </Box>
      )}
      <Flex align="center" px={whiteLabelPadding} pb={languagePaddingBottom}>
        <CustomReactSelect
          defaultValue={
            currentLang
              ? {
                  value: currentLang,
                  label: currentLang,
                }
              : undefined
          }
          menuPlacement={"top"}
          isClearable={true}
          placeholder={width > 600 ? "Select language" : "🌐"}
          size={width < 600 ? "sm" : "md"}
          onChange={(l) => {
            setCurrentLang(l?.value);
          }}
          libraryColor={libraryColor}
          colorScheme="purple"
          options={languages.map((l) => {
            return {
              value: l.name,
              label: l.name,
            };
          })}
        />
      </Flex>
    </Flex>
  );
}

export default ChatFooter;
