import CafeLink from "@/components/core/CafeLink";
import { CustomReactSelect } from "@/components/core/CustomReactSelect";
import TipTapBlock from "@/components/tiptap/TipTapBlock";
import useTipTapEditor from "@/lib/hooks/useTipTapEditor";
import { LanguageName, languages } from "@/utils/languages";
import { Box, Flex } from "@chakra-ui/react";
import { modifiedParseJSON } from "@/utils/stringUtils";
import { useMeasure } from "react-use";
import { LibraryResponse } from "@/types";

type Props = {
  library: LibraryResponse;
  setCurrentLang: (lang: LanguageName) => void;
  currentLang?: string;
  isCompact?: boolean;
};

function OracleFooter({ library, setCurrentLang, currentLang, isCompact }: Props) {
  const [ref, { width }] = useMeasure();
  const direction = width < 600 ? "column" : "row";
  const justifyContent = width < 600 ? "start" : "space-between";
  const footerEditor = useTipTapEditor(modifiedParseJSON(library?.whiteLabelText ?? ""), false);

  return (
    <Flex
      ref={ref as any}
      direction={direction}
      justifyContent={justifyContent}
      gap={2}
      w="full"
      mt={isCompact ? "20px" : "inherit"}
      pb={isCompact ? "20px" : "inherit"}
    >
      {!library.whiteLabelText ? (
        <Box fontSize="xs" textAlign={"left"} w="full">
          Powered with ❤️ and ☕️ by{" "}
          <CafeLink
            href={"https://libraria.ai"}
            isExternal={true}
            fontWeight="bold"
            textDecoration={"underline"}
          >
            Libraria
          </CafeLink>
        </Box>
      ) : (
        library.whiteLabelText && (
          <Box
            fontSize="xs"
            textAlign={"left"}
            w="full"
            alignItems="center"
            sx={{
              "& .ProseMirror > p": {
                "margin-bottom": "0 !important",
              },
            }}
          >
            {footerEditor && (
              <TipTapBlock
                px={1}
                editor={footerEditor}
                minH={50}
                border="none"
                fontSize="xs"
                borderBottomRadius="none"
              ></TipTapBlock>
            )}
          </Box>
        )
      )}
      <Box>
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
          colorScheme="purple"
          options={languages.map((l) => {
            return {
              value: l.name,
              label: l.name,
            };
          })}
        />
      </Box>
    </Flex>
  );
}

export default OracleFooter;
