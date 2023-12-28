import React, { useState, useRef, useEffect, useCallback } from "react";
import { Box, Button, Input, InputGroup, InputRightElement, Stack } from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import { BsSend } from "react-icons/bs";
import { useMeasure } from "react-use";
import { dynamicTitleColor } from "@/utils/styleUtils";
import { ExternalLinkIcon } from "@/components/icons/Icons";
import { ResizableTextArea } from "@/components/core/ResizableTextArea";
import { CtaPosition } from "@/types";

function checkIfNodeExists(node) {
  if (node.type === "fileNode" || node.type === "linkNode") {
    return true;
  }

  if (Array.isArray(node.content)) {
    return node.content.some(checkIfNodeExists);
  }

  return false;
}

function getAllNodes(node) {
  let nodes: {
    type: string;
    [key: string]: any;
  }[] = [];

  if (node.type === "fileNode" || node.type === "linkNode") {
    nodes.push({
      type: node.type,
      ...node.attrs,
    });
  }

  if (Array.isArray(node.content)) {
    node.content.forEach((childNode) => {
      nodes = nodes.concat(getAllNodes(childNode));
    });
  }

  return nodes;
}

function ChatInput({
  handleSubmit,
  library,
  currentConversation,
  variant,
  chatMessages,
  isStreaming,
  fetchedPreviousMessages,
}) {
  const [chatContent, setChatContent] = useState("");
  const inputRef = useRef(null);
  const [ref, { width }] = useMeasure();
  const py = width < 600 ? 1 : 4;

  const primaryCta = library?.AssistantCta?.find((x) => x.isPrimary);
  const libraryColor = library?.assistantStyles?.["color"] ?? "blue.600";
  const invertedLibraryColor = dynamicTitleColor(libraryColor);
  const handleButtonClick = () => {
    if (!primaryCta?.ctaUrl) return;

    let url = primaryCta.ctaUrl;

    if (url.startsWith("mailto")) {
      const transcript = chatMessages
        .slice(1)
        .map((message) => {
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

  const InputComponent = useCallback(
    (setFieldValue, rest) => {
      switch (variant) {
        case "textarea":
          return (
            <Field
              as={ResizableTextArea}
              ref={inputRef}
              value={chatContent}
              onChange={(e) => setChatContent(e.target.value)}
              maxRows={15}
              id="input"
              pr={"4.5rem"}
              name="input"
              type="text"
              fontSize={{
                base: "sm",
                md: "md",
              }}
              placeholder="Send a message"
              bg="#b6a6a026"
              _hover={{
                boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              onBlur={() => window.scrollTo(0, 0)}
              borderColor="#b6a6a026"
              focusBorderColor="none"
              _focus={{
                border: 0,
                boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
                scrollbarWidth: "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
              onKeyDown={async (event) => {
                // handle shift enter
                if (event.shiftKey && event.key === "Enter") {
                  return;
                } else if (event.key === "Enter") {
                  //submit
                  event.preventDefault();
                  await handleSubmit(
                    {
                      input: chatContent,
                    },
                    {
                      ...rest,
                      setFieldValue,
                    },
                  );
                  window.scrollTo(0, 0);
                  setFieldValue("input", "");
                  rest.resetForm();
                  setChatContent("");
                  return;
                }
                setChatContent(event.target.value);
              }}
            />
          );
        case "input":
        default:
          return (
            <Field
              as={Input}
              ref={inputRef}
              value={chatContent}
              onChange={(e) => setChatContent(e.target.value)}
              maxRows={4}
              pr={"4.5rem"}
              id="input"
              name="input"
              type="text"
              placeholder="Send a message"
              bg="gray/95"
              _hover={{
                border: 0,
                boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
              }}
              focusBorderColor="0"
              borderColor="gray/95"
              _focus={{
                boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
              }}
            />
          );
      }
    },
    [variant, chatContent, isStreaming, fetchedPreviousMessages],
  );

  return (
    <Box h={"auto"} mt={0} ref={ref as any}>
      <Formik initialValues={{ input: chatContent }} onSubmit={handleSubmit}>
        {({ setFieldValue, values, ...rest }) => {
          useEffect(() => {
            setFieldValue("input", chatContent);
          }, [chatContent]);

          return (
            <Form style={{ height: "100%" }}>
              <Stack py={py} spacing={2} h="full" flexDirection="column" justifyContent="flex-end">
                {primaryCta && primaryCta.ctaPosition === CtaPosition.in_chat && (
                  <Box pb={2}>
                    <Button
                      textAlign={"left"}
                      whiteSpace="normal"
                      height="auto"
                      blockSize="auto"
                      size="xs"
                      borderRadius="full"
                      py={"4px"}
                      variant="outline"
                      borderColor={libraryColor}
                      color={libraryColor}
                      _hover={{
                        bg: libraryColor,
                        color: invertedLibraryColor,
                      }}
                      onClick={handleButtonClick}
                      w="fit-content"
                      rightIcon={primaryCta?.ctaUrl ? <ExternalLinkIcon /> : undefined}
                    >
                      {primaryCta?.ctaText}
                    </Button>
                  </Box>
                )}
                {/* <AddDocumentWithinChatOnlyModal setDocumentContent={setDocumentContent} /> */}
                {variant === "input" ? (
                  <InputGroup size="md">
                    <Field
                      as={Input}
                      ref={inputRef}
                      value={chatContent}
                      onChange={(e) => setChatContent(e.target.value)}
                      maxRows={4}
                      pr={"4.5rem"}
                      id="input"
                      name="input"
                      type="text"
                      placeholder="Send a message"
                      bg="gray/95"
                      _hover={{
                        border: 0,
                        boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
                      }}
                      focusBorderColor="none  "
                      borderColor="gray/95"
                      _focus={{
                        boxShadow: "0px 0px 0px 1px rgba(0, 0, 0, 0.05)",
                      }}
                    />
                    <InputRightElement height="40px">
                      <BsSend />
                    </InputRightElement>
                  </InputGroup>
                ) : (
                  <Box display="flex" flexDirection="column" justifyContent="flex-end">
                    <InputGroup size="md">
                      {InputComponent(setFieldValue, rest)}
                      <InputRightElement height="40px">
                        <BsSend
                          onClick={async (e) => {
                            e.preventDefault();
                            await handleSubmit(
                              {
                                input: chatContent,
                              },
                              {
                                ...rest,
                                setFieldValue,
                              },
                            );
                            setFieldValue("input", "");
                            rest.resetForm();
                            setChatContent("");
                          }}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </Box>
                )}
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </Box>
  );
}

export default ChatInput;
