import { Textarea, TextareaProps } from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";
import React from "react";

export const ResizableTextArea = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps & {
    maxRows?: number;
    minRows?: number;
  }
>((props, ref) => {
  return (
    <Textarea
      minH="unset"
      overflow="hidden"
      w="100%"
      resize="none"
      ref={ref}
      transition="height none"
      minRows={1}
      as={ResizeTextarea}
      {...props}
    />
  );
});
