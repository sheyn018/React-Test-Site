"use client";

import { useChatHook } from "@/lib/hooks/useChatHook";
import { LANGUAGE_CODE_TO_LANGUAGE_NAME } from "@/utils/languages";
import { Box, Stack, Divider } from "@chakra-ui/react";
import { useMemo } from "react";
import { LibraryStyle } from "@/types/style";
import { getColorSchemeFromLibrary } from "@/utils/styleUtils";
import { IoIosSync } from "react-icons/io";
import { LibraryResponse } from "@/types";
import {
  CardWithAvatar,
  CardWithAvatarAvatar,
  CardWithAvatarBody,
  CardWithAvatarFooter,
} from "./core/CardWithAvatar";
import ResetModal from "./chat/ResetModal";
import OracleFooter from "./oracle/OracleFooter";
import OracleHeader from "./oracle/OracleHeader";
import OracleInput from "./oracle/OracleInput";
import OracleResponsePanel from "./oracle/OracleResponsePanel";

type Props = {
  library: LibraryResponse;
  cardStyleProps?: any;
  isCompact?: boolean;
  variant?: "assistant" | "search";
};

function OracleView({ library, cardStyleProps, isCompact, variant }: Props) {
  const {
    messageState,
    iterationPercentage,
    handleSubmit,
    streaming,
    currentLang,
    setCurrentLang,
    setMessageState,
    usedSuggestions,
    setUsedSuggestions,
    removeConversation,
  } = useChatHook({
    library,
    cachePreviousMessagesLocalStorage: false,
    type: "oracle",
    isPublicFacing: true,
  });
  const { messages, pending } = messageState;
  const libraryStyle = library.assistantStyles as LibraryStyle;
  const libraryColorScheme = getColorSchemeFromLibrary(libraryStyle);
  const placeholder =
    library?.Greeting?.find((g) => LANGUAGE_CODE_TO_LANGUAGE_NAME[g.language ?? ""] === currentLang)
      ?.assistantPlaceholder ??
    library?.assistantPlaceholder ??
    "Ask me anything";

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

  return (
    <CardWithAvatar
      isCompact={isCompact}
      avatarProps={{
        bg: "white",
      }}
      variant={variant ?? "assistant"}
      {...(cardStyleProps ?? {})}
    >
      {isCompact ? (
        <></>
      ) : (
        <CardWithAvatarAvatar
          src={library?.assistantImage}
          name={library?.assistantImage ? library?.assistantName : undefined}
        />
      )}
      <CardWithAvatarBody>
        <OracleHeader library={library} isCompact={isCompact} currentLang={currentLang} />
        <Stack spacing={0}>
          <OracleResponsePanel
            isStreaming={streaming}
            isCompact={isCompact}
            removeConversation={removeConversation}
            library={library}
            messages={chatMessages as any}
            iterationPercentage={iterationPercentage}
            pending={streaming}
          />
          {messages.length > 0 && <Divider my={8} />}
          <Stack
            fontWeight={"bold"}
            fontSize="lg"
            spacing={4}
            w="full"
            py={0}
            px={{
              base: 6,
              md: 8,
            }}
          >
            <Stack>
              <Box w="full" justifyContent="end">
                {messages?.length > 0 && (
                  <ResetModal
                    buttonStyle={{
                      justifyContent: "left",
                    }}
                    widgetType={"oracle"}
                    library={library}
                    setMessages={setMessageState}
                    removeConversation={removeConversation}
                    cta={<IoIosSync />}
                  />
                )}
              </Box>
              <OracleInput
                usedSuggestions={usedSuggestions}
                setUsedSuggestions={setUsedSuggestions}
                isCompact={isCompact}
                isLoading={streaming}
                currentLang={currentLang}
                libraryColorScheme={libraryColorScheme}
                library={library}
                handleSubmit={handleSubmit}
                placeholder={placeholder}
              />
            </Stack>
          </Stack>
        </Stack>
      </CardWithAvatarBody>
      <CardWithAvatarFooter
        pt={
          isCompact
            ? "0px"
            : {
                base: 2,
                lg: 12,
              }
        }
      >
        <OracleFooter
          library={library}
          currentLang={currentLang}
          setCurrentLang={setCurrentLang}
          isCompact={isCompact}
        />
      </CardWithAvatarFooter>
    </CardWithAvatar>
  );
}

export default OracleView;
