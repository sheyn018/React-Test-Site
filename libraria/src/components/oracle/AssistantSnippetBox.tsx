import { Heading, HStack } from "@chakra-ui/react";
import React from "react";
import { CardWithAvatarItem } from "../core/CardWithAvatar";

function AssistantSnippetBox(
  props: React.PropsWithChildren<{ header: string; gptQueryId?: string }>,
) {
  return (
    <CardWithAvatarItem>
      <HStack justifyItems={"center"} justifyContent={"space-between"}>
        <Heading size="xs">{props.header}</Heading>
      </HStack>
      {props.children}
    </CardWithAvatarItem>
  );
}

export default AssistantSnippetBox;
