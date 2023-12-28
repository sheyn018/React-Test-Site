import { HStack, Flex, Button, Image, Text, CloseButton, StackProps, Box } from "@chakra-ui/react";
import { IoIosSync } from "react-icons/io";
import ResetModal from "@/components/chat/ResetModal";
import { dynamicTitleColor } from "@/utils/styleUtils";
import { modifiedParseJSON } from "@/utils/stringUtils";
import { ExternalLinkIcon } from "@/components/icons/Icons";
import { LibraryResponse } from "@/types";

type ChatHeaderProps = {
  library: LibraryResponse;
  editor: any;
  setMessageState: any;
  removeConversation: any;
  currentConversation: any;
  chatMessages: any;
  onClose?: any;
  resetModal?: boolean;
};

function ChatHeader({
  library,
  editor,
  setMessageState,
  removeConversation,
  currentConversation,
  chatMessages,
  onClose,
  resetModal = true,
  ...rest
}: ChatHeaderProps & StackProps) {
  const primaryCta = library?.AssistantCta?.find((x) => x.isPrimary);
  const libraryColor = library?.assistantStyles?.["color"] ?? "blue.600";
  const secondaryColor = library?.assistantStyles?.["backgroundColor"] ?? "white";
  const invertedLibraryColor = dynamicTitleColor(libraryColor);

  const handleButtonClick = () => {
    if (!primaryCta?.ctaUrl) return;

    let url = primaryCta.ctaUrl;

    if (url.startsWith("mailto")) {
      const transcript = chatMessages
        .slice(1)
        .map((message, i) => {
          return `${message.type === "user" ? "You" : "Chatbot"}: ${message.text}`;
        })
        .join("\n")
        .replace("\n", "%0D%0A");

      url = `${url}?subject=Question (ID: ${currentConversation?.id})&body=%0D%0A%0D%0ATranscript:%0D%0A${transcript}`;
    } else if (!url.startsWith("http")) {
      url = `https://${url}`;
    }

    window.open(url);
  };

  return (
    <HStack
      borderTopRadius={"lg"}
      justifyContent={"space-between"}
      position="sticky"
      top={0}
      backgroundColor={libraryColor}
      color={invertedLibraryColor}
      {...rest}
    >
      <HStack gap={2}>
        <Image
          src={library.assistantImage ?? undefined}
          borderRadius="full"
          boxSize="30px"
          objectFit="cover"
          fallbackSrc="/peep-1.svg"
        />
        <Box>
          <Text fontWeight="bold" fontSize="md">
            {library.assistantName}
          </Text>
          <Text opacity="80%" fontSize="xs">
            {library.assistantChatSubheader}
          </Text>
        </Box>
      </HStack>
      <Flex gap={2} alignItems={"center"}>
        {primaryCta && primaryCta.ctaPosition === "top" && (
          <Button
            variant="outline"
            borderColor={invertedLibraryColor}
            size="sm"
            fontSize={"sm"}
            borderRadius="xl"
            color={invertedLibraryColor}
            _hover={{
              bg: invertedLibraryColor,
              color: libraryColor,
            }}
            onClick={handleButtonClick}
            fontFamily={"Calibre"}
            w="fit-content"
            rightIcon={primaryCta?.ctaUrl ? <ExternalLinkIcon /> : undefined}
          >
            {primaryCta?.ctaText}
          </Button>
        )}
        {resetModal ? (
          <ResetModal
            library={library}
            editor={editor}
            setMessages={setMessageState}
            removeConversation={removeConversation}
            cta={<IoIosSync color={invertedLibraryColor} />}
          />
        ) : (
          <IoIosSync
            cursor={"pointer"}
            onClick={async () => {
              if (library && editor) {
                editor?.commands?.setContent(
                  modifiedParseJSON(library?.chatInitialMessage ?? "Ask me anything!"),
                );
              }
              setMessageState({
                history: [],
                pending: undefined,
                messages: [
                  {
                    text: `I am ${library?.assistantName ?? "Chatbot"}. Nice to meet you! ${
                      library?.assistantShouldIgnoreGpt
                        ? `\n\nI only have access to documents you put in my library. You may enable access to external knowledge in the Assistant Settings if you prefer`
                        : `\n\nI have access to documents you put in my library and other external knowledge I was trained on.\n\n You can disable the external knowledge in your Assistant Settings if you prefer`
                    }`,
                    type: "assistant",
                  },
                ],
              });
              removeConversation();
            }}
          />
        )}
        {onClose && <CloseButton onClick={onClose} />}
      </Flex>
    </HStack>
  );
}

export default ChatHeader;
