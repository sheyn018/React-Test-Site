import React, { useState } from "react";
import { Box, Button, Card, CardBody, CardFooter, Text, Wrap, WrapProps } from "@chakra-ui/react";
import CafeLink from "@/components/core/CafeLink";
import { DocumentExtraFields } from "@/types/extraFields";
import { KnowledgeDocument } from "@/types";

function Snippet({ source, index, setIndex }) {
  const { content, title, extraFields, url } = source;
  let googleFileId;

  if (url && url?.includes("drive.google.com")) {
    const pattern = /\/d\/([a-zA-Z0-9-_]+)/;

    // Search the URL for the pattern and extract the Google ID
    const match = url?.match(pattern);
    if (match) {
      googleFileId = match[1];
    }
  }
  const pageNumber = (source.extraFields as DocumentExtraFields)?.pdf?.page;
  const youtube = (source.extraFields as DocumentExtraFields)?.youtube;
  const startTime = youtube?.startTime ? Math.round(youtube?.startTime) : 0;

  return (
    <Card variant="source" onMouseEnter={() => setIndex(index)}>
      <CardBody>{youtube && youtube.summary ? youtube.summary : content}</CardBody>
      <CardFooter>
        <Box fontWeight={"bold"}>{title}</Box>
        {(source.sourceType === "pdf" ||
          (source.sourceType === "scrape_url" && (extraFields as any)?.pdf?.page)) &&
          (url ? (
            <CafeLink
              href={
                url?.includes("drive.google.com")
                  ? `https://drive.google.com/uc?export=view&id=${googleFileId}#page=${pageNumber}`
                  : `${url}#page=${pageNumber}`
              }
              isExternal
            >
              Page {pageNumber} →
            </CafeLink>
          ) : (
            <Box>Page {pageNumber}</Box>
          ))}
        {youtube && (
          <CafeLink href={`https://youtu.be/${youtube?.videoId}?t=${startTime}`} isExternal>
            Timestamp {startTime} →
          </CafeLink>
        )}
      </CardFooter>
    </Card>
  );
}

export default function LibraryDocumentSnippet({
  sources,
  ...rest
}: {
  sources: KnowledgeDocument[];
} & WrapProps) {
  const [currIndex, setCurrIndex] = useState(-1);

  return (
    <Box onMouseLeave={() => setCurrIndex(-1)} position="relative" pt={2}>
      <Wrap {...rest}>
        {sources.map(({ title, url, extraFields, id, sourceType }, index) => {
          let googleFileId;

          if (url && url?.includes("drive.google.com")) {
            const pattern = /\/d\/([a-zA-Z0-9-_]+)/;

            // Search the URL for the pattern and extract the Google ID
            const match = url?.match(pattern);
            if (match) {
              googleFileId = match[1];
            }
          }

          const youtube = (extraFields as DocumentExtraFields)?.youtube;
          const startTime = youtube?.startTime ? Math.round(youtube?.startTime) : 0;

          return (
            <Box w="150px" key={`document-snippet-${index}-${id}`}>
              <CafeLink
                href={
                  sourceType === "pdf" ||
                  (sourceType === "scrape_url" && (extraFields as any)?.pdf?.page)
                    ? url?.includes("drive.google.com")
                      ? `https://drive.google.com/uc?export=view&id=${googleFileId}#page=${(
                          extraFields as DocumentExtraFields
                        )?.pdf?.page}`
                      : `${url}#page=${(extraFields as DocumentExtraFields)?.pdf?.page}`
                    : youtube
                    ? `https://youtu.be/${youtube?.videoId}?t=${startTime}`
                    : (extraFields as DocumentExtraFields)?.learnMoreLink?.url ?? url ?? undefined
                }
              >
                <Button
                  size="xs"
                  border="solid 1px"
                  borderColor="subtle"
                  color="muted"
                  maxW="inherit"
                  onMouseEnter={() => setCurrIndex(index)}
                  w="150px"
                >
                  <Text isTruncated={true}>
                    {index + 1}. {title}
                  </Text>
                </Button>
              </CafeLink>
            </Box>
          );
        })}
      </Wrap>
      {currIndex >= 0 && (
        <Box pt={2}>
          <Snippet source={sources[currIndex]} index={currIndex} setIndex={setCurrIndex} />
        </Box>
      )}
    </Box>
  );
}
