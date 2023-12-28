import { Box, Text } from "@chakra-ui/react";
import CafeLink from "@/components/core/CafeLink";

function LibraryPdfWithUrlSnippet({
  title,
  text,
  url,
  pageNumber,
}: {
  title?: string;
  text: string;
  url: string;
  pageNumber: number;
}) {
  let googleFileId;

  if (url.includes("drive.google.com")) {
    const pattern = /\/d\/([a-zA-Z0-9-_]+)/;

    // Search the URL for the pattern and extract the Google ID
    const match = url.match(pattern);
    if (match) {
      googleFileId = match[1];
    }
  }

  return (
    <>
      <Box pt={8}>
        {title && (
          <Text fontSize="lg" fontWeight="bold" textAlign={"center"}>
            {title}
          </Text>
        )}
        <CafeLink
          textDecoration={"underline !important"}
          color="blue.500"
          href={
            url.includes("drive.google.com")
              ? `https://drive.google.com/uc?export=view&id=${googleFileId}#page=${pageNumber}`
              : `${url}#page=${pageNumber}`
          }
          isExternal
        >
          Page {pageNumber} →
        </CafeLink>
        <Text pt="2" fontSize="sm" wordBreak={"break-all"}>
          {text}
        </Text>
      </Box>
    </>
  );
}

export default LibraryPdfWithUrlSnippet;
