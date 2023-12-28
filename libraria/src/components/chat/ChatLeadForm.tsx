import {
  Text,
  HStack,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  Button,
  useToast,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Formik, Field, ErrorMessage } from "formik";
import { IoMdSend } from "react-icons/io";
import { RiCloseFill } from "react-icons/ri";
import * as Yup from "yup";

function ChatLeadForm({ message, library, postFollowUpValueToGptConversation, closeEmail }) {
  const toast = useToast();
  return (
    <HStack justifyContent={message.type === "user" ? "flex-end" : "flex-start"} py={2}>
      <Box
        bg={"#b6a6a026"}
        color={"default"}
        rounded="md"
        p={2}
        boxShadow="sm"
        maxW="200px"
        textAlign={message.type === "user" ? "right" : "left"}
      >
        <Box>
          <Box>
            <Formik
              validationSchema={Yup.object({
                followUpValue: !library.chatbotFollowUp
                  ? Yup.string().email("Invalid email address").required("Required")
                  : Yup.string(),
              })}
              initialValues={{ followUpValue: "" }}
              onSubmit={async (values, { setSubmitting, setErrors }) => {
                try {
                  await postFollowUpValueToGptConversation(values.followUpValue);
                  toast({
                    position: "bottom-right",
                    title: library.chatbotFollowUp ? "Saved!" : "Email saved!",
                    status: "success",
                  });
                  closeEmail();
                } catch (error) {
                  if ((error as any).message) {
                    setErrors({ followUpValue: (error as any).message });
                  }
                } finally {
                  setSubmitting(false);
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <HStack
                    justifyContent={"space-between"}
                    alignItems="center"
                    alignContent={"center"}
                  >
                    <FormLabel>
                      <Text fontSize="sm" fontWeight="bold">
                        {library.chatbotFollowUp ?? "Get notified by email"}
                      </Text>
                    </FormLabel>
                    <RiCloseFill onClick={closeEmail} cursor="pointer" />
                  </HStack>
                  <InputGroup size="sm">
                    <Field
                      name="followUpValue"
                      as={Input}
                      placeholder={library.chatbotFollowUpPlaceholder ?? "Email address..."}
                      required
                      sx={{
                        "::placeholder": {
                          fontSize: "14px", // Adjust this value to your desired size
                        },
                      }}
                    />
                    <InputRightElement
                      isLoading={isSubmitting}
                      as={Button}
                      type="submit"
                      bg="none"
                      _hover={{
                        bg: "none",
                      }}
                    >
                      <IoMdSend color={"black"} />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage as={ErrorMessage} name="followupValue"></FormErrorMessage>
                </form>
              )}
            </Formik>
          </Box>
        </Box>
      </Box>
    </HStack>
  );
}

export default ChatLeadForm;
