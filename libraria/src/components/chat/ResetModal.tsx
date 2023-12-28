import { modifiedParseJSON } from "@/utils/stringUtils";
import { Box } from "@chakra-ui/react";
import { Editor } from "@tiptap/react";
import React from "react";
import { GiMagicBroom } from "react-icons/gi";
import { KnowledgeLibrary } from "@/types";
import ModalWithButton from "../core/ModalWithButton";

function ResetModal({
  library,
  editor,
  setMessages,
  removeConversation,
  cta,
  widgetType = "chatbot",
  buttonStyle = {},
}: {
  library: Partial<KnowledgeLibrary>;
  editor?: Editor | null;
  setMessages: any;
  widgetType?: "oracle" | "chatbot";
  removeConversation: any;
  cta?: React.ReactNode;
  buttonStyle?: any;
}) {
  return (
    <Box
      cursor="pointer"
      _hover={{
        color: "red.500",
      }}
    >
      <ModalWithButton
        header="Reset Conversation"
        cta={cta ?? <GiMagicBroom size="20px" />}
        buttonStyle={{
          bg: "none",
          _hover: {
            bg: "none",
            opacity: "50%",
          },
          p: 0,
          ...buttonStyle,
        }}
        modalCta="Reset"
        modalButtonStyle={{
          bg: "red.200",
          size: "md",
          color: "darken(255, 255, 255)",
          _hover: {
            bg: "red.300",
          },
        }}
        onDelete={() => {
          if (library && editor) {
            editor?.commands?.setContent(
              modifiedParseJSON(library?.chatInitialMessage ?? "Ask me anything!"),
            );
          }
          setMessages({
            messages:
              widgetType === "chatbot"
                ? [
                    {
                      type: "assistant",
                      text: library?.chatInitialMessage ?? "Ask me anything!",
                    },
                  ]
                : [],
            history: [],
          });
          removeConversation();
        }}
      >
        Are you sure you want to reset this conversation?
      </ModalWithButton>
    </Box>
  );
}

export default ResetModal;
