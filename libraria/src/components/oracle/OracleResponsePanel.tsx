import OracleResponseSection from "./OracleResponseSection";
import { Stack } from "@chakra-ui/react";
import { GptQuery, LibraryResponse } from "@/types";
import { css } from "@emotion/react"; // or styled-components
import { useRef, useEffect } from "react";

type Props = {
  messages: {
    type: "user" | "assistant";
    text: string;
    gptQuery?: GptQuery;
  }[];
  library: LibraryResponse;
  pending: boolean;
  isStreaming: boolean;
  iterationPercentage?: number;
  removeConversation: () => void;
  isCompact?: boolean;
};

function OracleResponsePanel({
  messages,
  pending,
  isStreaming,
  iterationPercentage,
  library,
  removeConversation,
  isCompact,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
  }, [messages]);

  return (
    <Stack
      pt={isCompact ? 6 : 0}
      onWheel={(e: React.WheelEvent) => {
        const target = e.currentTarget as HTMLElement;
        const atTop = target.scrollTop === 0 && e.deltaY < 0;
        const atBottom =
          target.offsetHeight + target.scrollTop >= target.scrollHeight && e.deltaY > 0;
        if (atTop || atBottom) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      spacing={8}
      maxH={"calc(100% - 7.5rem)"}
      overflowY={"scroll"}
      css={css`
        scrollbar-width: thin; // For Firefox
        scrollbar-color: rgba(155, 155, 155, 0.7) transparent; // For Firefox
        &::-webkit-scrollbar {
          width: 12px; // For Webkit browsers (Chrome, Safari)
        }
        &::-webkit-scrollbar-thumb {
          background-color: rgba(155, 155, 155, 0.7); // For Webkit browsers (Chrome, Safari)
        }
      `}
      w="full"
    >
      {messages.reduce((acc, message, idx) => {
        if (idx % 2 === 0) {
          const currQuestion = messages[idx].text;
          const currAnswer = messages[idx + 1];
          acc.push(
            <div>
              <OracleResponseSection
                isStreaming={isStreaming}
                removeConversation={removeConversation}
                iterationPercentage={iterationPercentage}
                library={library}
                pending={pending && idx === messages.length - 2}
                currQuestion={currQuestion ?? ""}
                currAnswer={currAnswer}
              />
            </div>,
          );
        }
        return acc;
      }, [] as JSX.Element[])}
      <div ref={bottomRef} />
    </Stack>
  );
}

export default OracleResponsePanel;
