import { Box, Button, HStack, Icon, useToast } from "@chakra-ui/react";
import { useCopyToClipboard } from "react-use";
import { RxClipboardCopy } from "react-icons/rx";
import { BeatLoader } from "react-spinners";
import FeedbackBox from "../chat/FeedbackBox";
import MarkdownRender from "../chat/MarkdownRender";
import TiptapRender from "../chat/TiptapRender";

function AssistantAnswerSnippetBox({
  answerText,
  gptQueryId,
  anonKey,
  utmParam,
  useTipTapMarkdown,
}: {
  answerText: string;
  gptQueryId: string;
  anonKey: string;
  useTipTapMarkdown?: boolean;
  utmParam?: string;
}) {
  const [state, copyToClipboard] = useCopyToClipboard();
  const toast = useToast();
  return (
    <Box pt={12} pb={8} px={{ base: "6", md: "8" }}>
      <Box>
        {answerText ? (
          useTipTapMarkdown ? (
            <TiptapRender content={JSON.parse(answerText ?? "{}")} />
          ) : (
            <MarkdownRender markdown={answerText} color="inherit" utmParam={utmParam} pt={0} />
          )
        ) : (
          <>
            <BeatLoader size={8} className="answerbeatloader" />
          </>
        )}
      </Box>
      <HStack justifyContent={"end"} spacing={0}>
        <Button
          bg="transparent"
          _hover={{
            bg: "transparent",
          }}
          variant="searchInverted"
          size="xs"
          mt={1}
        >
          <Icon
            as={RxClipboardCopy as any}
            _hover={{
              cursor: "pointer",
            }}
            onClick={() => {
              copyToClipboard(answerText ?? "");
              toast({
                title: "Copied to clipboard",
                status: "success",
                duration: 2000,
                variant: "left-accent",
                isClosable: true,
              });
            }}
          />
        </Button>
        <FeedbackBox anonKey={anonKey} gptQueryId={gptQueryId} />
      </HStack>
    </Box>
  );
}

export default AssistantAnswerSnippetBox;
