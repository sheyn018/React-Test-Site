import React, { useState } from "react";
import { Button, FormControl, Stack, Text, HStack, useToast, Box } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { ResizableTextArea } from "../core/ResizableTextArea";

const FeedbackInline = ({
  isOpen,
  onOpen,
  onClose,
  feedbackEndpoint,
  isFeedbackCorrect,
  setCurrentFeedback,
  icon,
  anonKey,
}: {
  isOpen: boolean;
  onOpen: any;
  onClose: any;
  feedbackEndpoint: string;
  isFeedbackCorrect: boolean;
  setCurrentFeedback: (feedback: boolean) => void;
  icon: React.ReactNode;
  anonKey: string;
}) => {
  const [submitted, setSubmitted] = useState(false);
  const toast = useToast();

  const handleSubmit = async (values, actions) => {
    // Submit feedback to the endpoint
    const response = await fetch(feedbackEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        feedback: values.feedback,
        isCorrect: isFeedbackCorrect,
        anonKey,
      }),
    });

    // Handle response and close the modal
    if (response.ok) {
      onClose();
      setSubmitted(true);
    } else {
      actions.setSubmitting(false);
      actions.setStatus({ error: "An error occurred. Please try again." });
    }
  };

  if (submitted) return <></>;

  return (
    <>
      <Box
        cursor="pointer"
        _hover={{
          opacity: "50%",
        }}
        fontSize="xs"
        justifyContent={"left"}
        onClick={() => {
          if (!submitted) {
            onOpen();
            setCurrentFeedback(isFeedbackCorrect);
          }
        }}
      >
        {icon}
      </Box>
      {isOpen && (
        <Formik
          initialValues={{
            feedback: "",
          }}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, handleChange, values }) => (
            <Form>
              <Stack>
                <FormControl>
                  <Text fontSize="sm" fontWeight="bold">
                    Your Feedback
                  </Text>
                  <ResizableTextArea
                    focusBorderColor="transparent"
                    _focus={{
                      outline: "none",
                    }}
                    onKeyDown={async (e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        await handleSubmit(
                          {
                            feedback: values.feedback,
                          },
                          {},
                        );
                        setSubmitted(true);
                        onClose();
                        toast({
                          status: "success",
                          title: "Feedback submitted",
                        });
                      }
                    }}
                    w="full"
                    borderRadius="md"
                    variant="outline"
                    name="feedback"
                    onChange={handleChange}
                    p={1}
                    fontSize="sm"
                    value={values.feedback}
                    autoFocus={true}
                    placeholder={`Enter your feedback here...`}
                  />
                  <HStack justifyContent={"end"}>
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={onClose}
                      _hover={{ bg: "gray/95" }}
                    >
                      Cancel
                    </Button>
                    <Button
                      size="xs"
                      isLoading={isSubmitting}
                      mr={3}
                      onClick={async (e) => {
                        e.preventDefault();
                        await handleSubmit(
                          {
                            feedback: values.feedback,
                          },
                          {},
                        );
                        setSubmitted(true);
                        onClose();
                        toast({
                          status: "success",
                          title: "Feedback submitted",
                        });
                      }}
                    >
                      Submit
                    </Button>
                  </HStack>
                </FormControl>
              </Stack>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default FeedbackInline;
