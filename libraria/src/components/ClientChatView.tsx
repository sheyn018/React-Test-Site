"use client";

import { Box, Stack, theme } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useChatHook } from "@/lib/hooks/useChatHook";
import { useAutoScroll } from "@/lib/hooks/useAutoScroll";
import useTipTapEditor from "@/lib/hooks/useTipTapEditor";
import { modifiedParseJSON } from "@/utils/stringUtils";
import ChatInput from "@/components/dashboard/library/home/ChatInput";
import ChatPanel from "@/components/dashboard/library/home/ChatPanel";
import ChatFooter from "@/components/dashboard/library/home/ChatFooter";
import { useMeasure } from "react-use";
import ChatHeader from "@/components/dashboard/library/home/ChatHeader";
import { LibraryResponse } from "@/types";
import { ChakraNestedProvider } from "./core/ChakraNestedProvider";

type PreviewChatbotHomeCardProps = {
  library: LibraryResponse;
  onClose?: any;
  resetModal?: boolean;
  userOptions?: {
    email: string;
    userId: string;
    name: string;
  };
};

function ClientChatView({
  library,
  userOptions,
  onClose,
  resetModal = true,
}: PreviewChatbotHomeCardProps) {
  const chatBoxRef = useRef<any>();
  const [chatContainerRef, { width }] = useMeasure();
  const padding = width < 1000 ? "10px" : "20px";

  const [vh, setVh] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setVh(window.innerHeight);
      } else {
        setVh(window.innerHeight - 10);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    messageState,
    handleSubmit,
    removeConversation,
    closeEmail,
    fetchedPreviousMessages,
    currentLang,
    setCurrentLang,
    streaming,
    currentConversation: p_currentConversation,
    postFollowUpValueToGptConversation,
    setMessageState,
    usedSuggestions,
    setUsedSuggestions,
  } = useChatHook({
    library,
    cachePreviousMessagesLocalStorage: true,
    type: "chatbot",
    isPublicFacing: true,
    userOptions,
  });

  const { messages, pending } = messageState;
  const chatMessages = useMemo(() => {
    return [
      ...messages,
      ...(streaming
        ? [
            {
              type: "assistant",
              text: pending ?? "",
              gptQuery: null,
            },
          ]
        : []),
    ];
  }, [messages, pending, streaming]);

  useAutoScroll(messages, [pending, streaming], chatBoxRef);
  const editor = useTipTapEditor(modifiedParseJSON(library?.chatInitialMessage ?? ""), false);

  return (
    <Box id={"libraria-react"}>
      <ChakraNestedProvider theme={theme} cssVarsRoot={"#libraria-react"}>
        <Stack
          bg="white"
          borderRadius="12px"
          h="inherit"
          w="full"
          ref={chatContainerRef as any}
          spacing={0}
        >
          <Box>
            <ChatHeader
              py={4}
              px={padding}
              library={library}
              currentConversation={p_currentConversation}
              chatMessages={chatMessages}
              removeConversation={removeConversation}
              editor={editor}
              onClose={onClose}
              resetModal={resetModal}
              setMessageState={setMessageState}
            />
          </Box>
          <Box
            borderRadius="md"
            w="100%"
            overflowY="auto" // Add this line
            overscrollBehavior={"contain"}
            ref={chatBoxRef}
            px={padding}
            pt={padding}
            h="inherit"
            bg="white"
          >
            <ChatPanel
              fetchedPreviousMessages={fetchedPreviousMessages}
              editor={editor}
              messages={chatMessages as any}
              library={library}
              closeEmail={closeEmail}
              removeConversation={removeConversation}
              isStreaming={streaming}
              conversation={p_currentConversation}
              postFollowUpValueToGptConversation={postFollowUpValueToGptConversation}
              handleSubmit={handleSubmit}
              currentLang={currentLang}
              usedSuggestions={usedSuggestions}
              setUsedSuggestions={setUsedSuggestions}
            />
          </Box>
          <Box px={padding} bg="white">
            <ChatInput
              isStreaming={streaming}
              chatMessages={chatMessages}
              currentConversation={p_currentConversation}
              fetchedPreviousMessages={fetchedPreviousMessages}
              library={library}
              variant="textarea"
              handleSubmit={handleSubmit}
            />
          </Box>
          <Box px={padding} pb={padding}>
            <ChatFooter
              isPublicFacing={true}
              currentLang={currentLang}
              setCurrentLang={setCurrentLang}
              library={library}
            />
          </Box>
        </Stack>
      </ChakraNestedProvider>
    </Box>
  );
}

export default ClientChatView;
