import { Box, useDisclosure } from "@chakra-ui/react";
import { useState } from "react";
import { BsFillHandThumbsDownFill, BsFillHandThumbsUpFill } from "react-icons/bs";
import FeedbackInline from "./FeedbackInline";
import FeedbackModal from "./FeedbackModal";

function FeedbackBox({
  gptQueryId,
  anonKey,
  inline = false,
}: {
  gptQueryId: string;
  anonKey: string;
  inline?: boolean;
}) {
  const [currentFeedback, setCurrentFeedback] = useState<boolean>();
  const { isOpen: isInlineOpen, onOpen: onInlineOpen, onClose: onInlineClose } = useDisclosure();

  const feedbackEndpoint = `https://api.libraria.dev/public/gpt-query/${gptQueryId}/feedback`;

  if (inline) {
    return (
      <Box
        w="full"
        boxShadow={isInlineOpen ? "lg" : "none"}
        p={isInlineOpen ? 2 : 0}
        borderRadius="md"
      >
        {currentFeedback === false ? (
          <></>
        ) : (
          <FeedbackInline
            isOpen={isInlineOpen}
            anonKey={anonKey}
            onOpen={onInlineOpen}
            onClose={onInlineClose}
            isFeedbackCorrect={true}
            feedbackEndpoint={feedbackEndpoint}
            setCurrentFeedback={setCurrentFeedback}
            icon={<BsFillHandThumbsUpFill />}
          />
        )}
        {currentFeedback === true ? (
          <></>
        ) : (
          <FeedbackInline
            anonKey={anonKey}
            isOpen={isInlineOpen}
            onOpen={onInlineOpen}
            onClose={onInlineClose}
            feedbackEndpoint={feedbackEndpoint}
            setCurrentFeedback={setCurrentFeedback}
            isFeedbackCorrect={false}
            icon={<BsFillHandThumbsDownFill />}
          />
        )}
      </Box>
    );
  }

  return (
    <Box w="fit-content">
      <FeedbackModal
        feedbackEndpoint={feedbackEndpoint}
        anonKey={anonKey}
        isFeedbackCorrect={true}
        icon={<BsFillHandThumbsUpFill />}
      />
      <FeedbackModal
        anonKey={anonKey}
        feedbackEndpoint={feedbackEndpoint}
        isFeedbackCorrect={false}
        icon={<BsFillHandThumbsDownFill />}
      />
    </Box>
  );
}

export default FeedbackBox;
