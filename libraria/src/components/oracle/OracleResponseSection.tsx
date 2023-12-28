import LibraryDocumentSnippet from "@/components/snippets/library/LibraryDocumentSnippet";
import { QueryExtraFields } from "@/types/extraFields";
import {
  Stack,
  Box,
  Text,
  Progress,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { LibraryColorScheme } from "@/types/style";
import LibraryLearnMoreSnippet from "@/components/snippets/library/LibraryLearnMoreSnippet";
import { LibraryResponse } from "@/types";
import ToolProgress from "../chat/ToolProgress";
import AssistantAnswerSnippetBox from "./AssistantAnswerSnippetBox";
import AssistantSnippetBox from "./AssistantSnippetBox";
import { CardWithAvatarItemStack } from "../core/CardWithAvatar";

type Props = {
  library: LibraryResponse;
  pending: boolean;
  iterationPercentage?: number;
  currQuestion?: string;
  currAnswer?: any;
  isStreaming: boolean;
  removeConversation: () => void;
};

function OracleResponseSection({
  iterationPercentage,
  isStreaming,
  library,
  pending,
  currQuestion,
  currAnswer,
  removeConversation,
}: Props) {
  // Snippets
  const gptQuery: any = currAnswer?.gptQuery;
  const extraFields: QueryExtraFields = gptQuery?.extraFields as QueryExtraFields;
  const articles = extraFields?.helpArticles
    ?.filter((article) => article?.title && article?.url)
    ?.filter((v, i, a) => a.findIndex((t) => t.url === v.url) === i);
  const utmParams = extraFields?.documents?.map(
    (x) => x.tags?.find((tag) => !!tag.utmParams)?.utmParams,
  );
  const documentSnippets = extraFields?.documents ?? [];
  const helpArticles = extraFields?.helpArticles
    ?.filter((x) => {
      return x.title && x.url;
    })
    ?.filter((v, i, a) => a.findIndex((t) => t.url === v.url) === i);
  const tool = currAnswer?.tool;

  return (
    <Stack spacing={0}>
      {currQuestion && (
        <>
          <AssistantSnippetBox header="">
            <Box pt="2" pb={8} fontSize="md">
              {currQuestion.split("\n").map((item, key) => {
                return (
                  <Text fontSize={{ base: "sm", md: "md" }} key={`question-char-${key}`}>
                    {item}
                  </Text>
                );
              })}
            </Box>
          </AssistantSnippetBox>
        </>
      )}
      {iterationPercentage !== undefined && iterationPercentage !== 0 ? (
        <>
          <Progress hasStripe value={iterationPercentage} />
          <Box fontSize="sm" fontWeight="bold">
            I'm currently reading your document to summarize it...
          </Box>
        </>
      ) : null}
      {tool !== undefined && (
        <Box px={8}>
          <ToolProgress tool={tool as any} isTyping={!!pending} isStreaming={isStreaming} />
        </Box>
      )}
      <CardWithAvatarItemStack>
        {currAnswer && (
          <AssistantAnswerSnippetBox
            answerText={currAnswer?.text}
            useTipTapMarkdown={(gptQuery?.extraFields as QueryExtraFields)?.returnDirectly}
            gptQueryId={gptQuery?.id}
            anonKey={library.anonKey}
            utmParam={utmParams?.[0] ?? undefined}
          />
        )}
        {(helpArticles?.length || extraFields?.maps) && (
          <AssistantSnippetBox header="Learn More">
            <LibraryLearnMoreSnippet
              shopify={extraFields.shopify}
              documents={helpArticles}
              places={extraFields.maps}
              removeConversation={removeConversation}
            />
          </AssistantSnippetBox>
        )}
        {library.assistantShouldShowSources && documentSnippets.length > 0 && (
          <>
            <AssistantSnippetBox header="Sources">
              <LibraryDocumentSnippet sources={documentSnippets as any} py={8} />
            </AssistantSnippetBox>
          </>
        )}
        {pending && gptQuery?.extraFields && (
          <>
            <Accordion allowToggle border="solid 1px transparent">
              <AccordionItem>
                <AccordionButton _expanded={{ bg: "tomato", color: "white" }}>
                  <Box flex="1" textAlign="left" color="inherit">
                    <BeatLoader size={8} />
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel></AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </CardWithAvatarItemStack>
    </Stack>
  );
}
export default OracleResponseSection;
