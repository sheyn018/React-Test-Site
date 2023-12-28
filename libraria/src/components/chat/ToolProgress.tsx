type ToolProgressProps = {
  tool: {
    type: AppToolType;
    data: any;
  };
  isTyping: boolean;
  isStreaming: boolean;
};
const ToolProgress = ({ tool, isTyping, isStreaming }: ToolProgressProps) => {
  // Check the tool type and return the appropriate component
  switch (tool.type) {
    case AppToolType.library:
      return (
        <LibraryToolProgress extraData={tool.data} isTyping={isTyping} isStreaming={isStreaming} />
      );
    default:
      return null;
  }
};

import { AppToolType } from "../../constants";
import { Button } from "@chakra-ui/react";
import React from "react";

type LibraryToolProgressProps = {
  extraData: any;
  isTyping: boolean;
  isStreaming: boolean;
};

function LibraryToolProgress({ extraData, isTyping, isStreaming }: LibraryToolProgressProps) {
  return (
    <>
      <Button
        isLoading={isStreaming && !isTyping}
        loadingText={`Library Tool: ${extraData.message}`}
        w="fit-content"
        fontWeight="normal"
        size="sm"
      >
        {extraData.message}
      </Button>
    </>
  );
}

export default ToolProgress;
