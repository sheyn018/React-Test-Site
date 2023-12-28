import CafeLink from "@/components/core/CafeLink";
import { SOURCE_TYPE_DETAILS } from "@/constants/document";
import { KnowledgeDocument } from "@/types";
import { Box, Icon, Text, Button, Tooltip } from "@chakra-ui/react";

function SourceBadge({ document, i }: { document: Partial<KnowledgeDocument>; i: number }) {
  const details = SOURCE_TYPE_DETAILS(document);
  if (!details) {
    return null;
  }

  const { icon, url: finalUrl, title: finalTitle, color } = details;
  return (
    <Button
      as={CafeLink}
      href={finalUrl ?? undefined}
      target="_blank"
      colorScheme="blue"
      variant="outline"
      width="fit-content"
      border="solid 1px black"
      borderRadius="lg"
      p={2}
      size="xs"
      w="150px"
      leftIcon={
        <Box display="flex" alignItems="center">
          <Icon fontSize="18px" as={icon as any} color={color} mr={1}></Icon>
          <Text as="span" color="subtle">
            {i + 1}
          </Text>
        </Box>
      }
    >
      <Tooltip label={finalTitle} placement="top">
        <Text as="span" isTruncated>
          {finalTitle}
        </Text>
      </Tooltip>
    </Button>
  );
}

export default SourceBadge;
