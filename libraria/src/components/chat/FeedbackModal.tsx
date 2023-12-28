import { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  useDisclosure,
  Textarea,
  ModalHeader,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";

const FeedbackModal = ({
  isFeedbackCorrect,
  feedbackEndpoint,
  icon,
  anonKey,
}: {
  isFeedbackCorrect: boolean;
  feedbackEndpoint: string;
  icon: React.ReactNode;
  anonKey: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [submitted, setSubmitted] = useState(false);

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
      <Button
        bg="transparent"
        _hover={{
          bg: "transparent",
        }}
        size="xs"
        onClick={onOpen}
        variant="searchInverted"
      >
        {icon}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} variant="internal">
        <ModalOverlay />
        <ModalContent zIndex="popover">
          <ModalCloseButton />
          <Formik
            initialValues={{
              feedback: "",
            }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, handleChange, handleBlur, values }) => (
              <Form>
                <ModalBody>
                  <ModalHeader>
                    Tell us why the answer is {isFeedbackCorrect ? "correct" : "incorrect"}
                  </ModalHeader>
                  <FormControl>
                    <Textarea
                      name="feedback"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.feedback}
                      placeholder={`What do you ${
                        isFeedbackCorrect ? "like" : "dislike"
                      } about this response?`}
                    />
                  </FormControl>
                </ModalBody>
                <ModalFooter>
                  <Button type="submit" isLoading={isSubmitting} mr={3}>
                    Submit
                  </Button>
                  <Button onClick={onClose}>Cancel</Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FeedbackModal;
