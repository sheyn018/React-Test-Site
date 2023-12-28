import LibraryImageSnippet from "@/components/snippets/library/LibraryImageSnippet";
import LibraryLearnMoreSnippet from "@/components/snippets/library/LibraryLearnMoreSnippet";
import TipTapBlock from "@/components/tiptap/TipTapBlock";
import {
  Box,
  HStack,
  Divider,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  Text,
  Flex,
  Center,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { translateSuggestedQuestions } from "@/utils/i18nUtils";
import { useMemo, useState } from "react";
import { dynamicTitleColor } from "@/utils/styleUtils";
import ChatLeadForm from "@/components/chat/ChatLeadForm";
import FeedbackBox from "@/components/chat/FeedbackBox";
import SourceBadge from "@/components/snippets/library/SourceBadge";
import ShortcutButton from "@/components/chat/ShortcutButton";
import ToolProgress from "@/components/chat/ToolProgress";
import MarkdownRender from "@/components/chat/MarkdownRender";
import TiptapRender from "@/components/chat/TiptapRender";
import { OrganizationResponse, LibraryResponse, GptQuery } from "@/types";
import SuggestedQuestions from "@/components/chat/SuggestedQuestions";

type ChatPanelProps = {
  messages: {
    type: "user" | "assistant";
    text: string;
    tiptap?: any;
    gptQuery?: GptQuery;
    tool?: any;
  }[];
  currentLang?: string;
  fetchedPreviousMessages: boolean;
  organization?: OrganizationResponse;
  library: LibraryResponse;
  closeEmail: () => void;
  removeConversation: () => void;
  handleSubmit?: any;
  isStreaming: boolean;
  conversation?: any;
  postFollowUpValueToGptConversation: (value: string) => Promise<void>;
  editor: any;
  usedSuggestions: string[];
  setUsedSuggestions: any;
  enabledShortcuts?: ("email" | "copy")[];
};

function ChatPanel({
  currentLang,
  messages,
  usedSuggestions,
  setUsedSuggestions,
  organization,
  editor,
  handleSubmit,
  fetchedPreviousMessages,
  library,
  closeEmail,
  isStreaming,
  removeConversation,
  conversation,
  postFollowUpValueToGptConversation,
  enabledShortcuts = [],
}: ChatPanelProps) {
  const libraryColor = library?.assistantStyles?.["color"] ?? "blue.600";
  const invertedLibraryColor = dynamicTitleColor(libraryColor);

  // Memoized suggestions that excludes used ones
  const filteredSuggestions = useMemo(() => {
    return translateSuggestedQuestions(
      library?.Greeting ?? [],
      currentLang,
      library.assistantQuerySuggestions,
    )?.filter((suggestion) => !usedSuggestions.includes(suggestion));
  }, [usedSuggestions, library, currentLang]);

  const handleShortcut = (shortcut: string, message: string) => {
    if (shortcut === "copy") {
      navigator.clipboard.writeText(message);
    } else if (shortcut === "email") {
      window.location.href = `mailto:?body=${encodeURIComponent(message)}`;
    }
  };

  return (
    <>
      {!fetchedPreviousMessages && (
        <Center pt={4}>
          <BeatLoader color="lightgray" />
        </Center>
      )}
      {messages.map((message, i) => {
        const extraFields = message?.gptQuery?.extraFields as any;
        const documents = extraFields?.documents;
        const helpArticles = extraFields?.helpArticles
          ?.filter((x) => {
            return x.title && x.url;
          })
          ?.filter((v, i, a) => a.findIndex((t) => t.url === v.url) === i);
        const snippetImage = extraFields?.snippet?.image ?? extraFields?.images?.[0];
        const utmParams = documents?.map((x) => x.tags?.find((tag) => !!tag.utmParams)?.utmParams);
        const documentSnippets = documents?.filter((document) => {
          return document?.content && document?.sourceType === "pdf";
        });
        const tool = message?.tool;

        return (
          <>
            <HStack
              key={i}
              justifyContent={message.type === "user" ? "flex-end" : "flex-start"}
              py={2}
              fontFamily={"Calibre"}
            >
              <Box
                bg={message.type === "user" ? libraryColor : "#b6a6a026"}
                color={message.type === "user" ? invertedLibraryColor : "default"}
                rounded="md"
                boxShadow={"sm"}
                p={2}
                maxW="100%"
                textAlign={message.type === "user" ? "right" : "left"}
              >
                <Box
                  sx={{
                    ".ProseMirror-trailingBreak": {
                      display: "none !important",
                    },
                  }}
                >
                  {i === 0 && library?.chatInitialMessage ? (
                    <>
                      <Box>
                        <TipTapBlock
                          minH={10}
                          fontSize={{
                            base: "sm",
                            md: "md",
                          }}
                          color={
                            message.type === "user" ? dynamicTitleColor(libraryColor) : "black"
                          }
                          editor={editor}
                          border="none"
                          borderBottomRadius="none"
                        />
                      </Box>
                    </>
                  ) : extraFields?.returnDirectly && message.type === "assistant" ? (
                    <TiptapRender
                      fontSize={{
                        base: "sm",
                        md: "md",
                      }}
                      content={JSON.parse(message.text ?? "{}")}
                    />
                  ) : (
                    <MarkdownRender
                      fontSize={{
                        base: "sm",
                        md: "md",
                      }}
                      markdown={message.text ?? ""}
                      utmParam={utmParams?.[0] ?? undefined}
                    />
                  )}
                </Box>
                {message.type === "assistant" &&
                  i !== 0 &&
                  (i === messages.length - 1 ? !isStreaming : true) && (
                    <Flex
                      direction="row"
                      justifyContent="center"
                      alignItems="center"
                      mt={4}
                      gap={2}
                    >
                      <FeedbackBox
                        gptQueryId={message.gptQuery?.id as string}
                        inline={true}
                        anonKey={library.anonKey as string}
                      />
                      {message.type === "assistant" &&
                        enabledShortcuts.map((shortcut) => (
                          <ShortcutButton
                            question={messages.length > 0 ? messages[i - 1]?.text : ""}
                            library={library}
                            organization={organization}
                            key={shortcut}
                            shortcut={shortcut}
                            message={message.text}
                          />
                        ))}
                    </Flex>
                  )}
                {tool !== undefined && (
                  <Box px={8}>
                    <ToolProgress tool={tool} isTyping={false} isStreaming={isStreaming} />
                  </Box>
                )}
                {isStreaming && i === messages.length - 1 && messages[i].type === "assistant" && (
                  <>
                    <Box textAlign="left">
                      <Text size="sm" fontWeight="bold" color="main.midBrown">
                        <BeatLoader size={8} />
                      </Text>
                    </Box>
                  </>
                )}
                {snippetImage && <LibraryImageSnippet src={snippetImage} />}
                {documentSnippets && documentSnippets?.length > 0 && (
                  <>
                    <Accordion allowToggle border="solid 1px transparent">
                      <AccordionItem>
                        <AccordionButton _expanded={{ bg: "tomato", color: "white" }}>
                          <Box flex="1" textAlign="left">
                            <Text size="sm" fontWeight="bold">
                              Source Documents →
                            </Text>
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                        <AccordionPanel>
                          <Box>
                            {documentSnippets && (
                              <Wrap>
                                {documentSnippets.map((document, i) => {
                                  return (
                                    <WrapItem key={`source-${document.id}`}>
                                      <SourceBadge i={i} document={document} />
                                    </WrapItem>
                                  );
                                })}
                              </Wrap>
                            )}
                          </Box>
                        </AccordionPanel>
                      </AccordionItem>
                    </Accordion>
                  </>
                )}
                {((helpArticles && helpArticles.length > 0) ||
                  extraFields?.maps ||
                  extraFields?.shopify) && (
                  <>
                    <Divider pt={8} borderColor={"gray.200"} />
                    <Box>
                      <LibraryLearnMoreSnippet
                        shopify={extraFields.shopify}
                        places={extraFields?.maps}
                        documents={helpArticles}
                        removeConversation={removeConversation}
                      />
                    </Box>
                  </>
                )}
              </Box>
            </HStack>
            {library.chatbotFollowUp && i === 2 && !isStreaming && !conversation?.emailClosed && (
              <ChatLeadForm
                message={message}
                library={library}
                postFollowUpValueToGptConversation={postFollowUpValueToGptConversation}
                closeEmail={closeEmail}
              />
            )}
            {i === messages.length - 1 && messages[i].type === "assistant" && (
              <SuggestedQuestions
                containerType="wrap"
                currentLang={currentLang}
                suggestions={filteredSuggestions}
                handleSubmit={async (query) => {
                  setUsedSuggestions((prev) => [...prev, query]);
                  await handleSubmit({
                    input: query,
                  });
                }}
                buttonProps={{
                  _hover: {
                    bg: "gray/95",
                  },
                }}
              />
            )}
          </>
        );
      })}
    </>
  );
}

export default ChatPanel;
