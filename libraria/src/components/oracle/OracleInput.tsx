import { LibraryColorScheme } from "@/types/style";
import { SHORTLIST_NAME_TO_DATA } from "@/utils/languages";
import {
  FormControl,
  TextareaProps,
  Button,
  Text,
  Stack,
  Box,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Form, Field, Formik, FieldProps } from "formik";
import { BeatLoader } from "react-spinners";
import { translateSuggestedQuestions } from "@/utils/i18nUtils";
import { BsSend } from "react-icons/bs";
import { useMemo } from "react";
import { ResizableTextArea } from "../core/ResizableTextArea";
import SuggestedQuestions from "../chat/SuggestedQuestions";
import { LibraryResponse } from "@/types";

type Props = {
  library: LibraryResponse;
  placeholder: string;
  isDisabled?: boolean;
  libraryColorScheme: LibraryColorScheme;
  currentLang?: string;
  isLoading: boolean;
  handleSubmit: (values: any, helpers?: any) => Promise<void>;
  isCompact?: boolean;
  usedSuggestions: any[];
  setUsedSuggestions: any;
} & TextareaProps;

function OracleInput({
  isDisabled,
  setUsedSuggestions,
  usedSuggestions,
  handleSubmit,
  placeholder,
  library,
  libraryColorScheme,
  isLoading,
  currentLang,
  isCompact,
  ...rest
}: Props) {
  const LANG_DATA = SHORTLIST_NAME_TO_DATA[currentLang ?? "English"];
  const filteredSuggestions = useMemo(() => {
    return translateSuggestedQuestions(
      library?.Greeting ?? [],
      currentLang,
      library.assistantQuerySuggestions,
    ).filter((suggestion) => !usedSuggestions.includes(suggestion));
  }, [usedSuggestions, library, currentLang]);

  if (isCompact) {
    return (
      <Box h="18%" mt={0}>
        <Formik
          initialValues={{ input: "" }}
          onSubmit={async (values, rest) => {
            await handleSubmit(values, rest);
          }}
        >
          {() => {
            return (
              <Form>
                <Stack mt={2} spacing={2}>
                  <InputGroup size="md">
                    <Field
                      as={Input}
                      pr={"4.5rem"}
                      name="input"
                      type="text"
                      placeholder={placeholder}
                    />
                    <InputRightElement height="40px">
                      <BsSend />
                    </InputRightElement>
                  </InputGroup>
                </Stack>
              </Form>
            );
          }}
        </Formik>
      </Box>
    );
  }

  return (
    <Formik
      initialValues={{ input: "" }}
      onSubmit={async (values, rest) => {
        await handleSubmit(values, rest);
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Stack>
            <FormControl>
              <Stack>
                <SuggestedQuestions
                  suggestions={filteredSuggestions}
                  handleSubmit={async (query) => {
                    setUsedSuggestions((prev: string[]) => [...prev, query as string]);
                    await handleSubmit({
                      input: query,
                    });
                  }}
                  buttonProps={{
                    _hover: {
                      bg: libraryColorScheme.primary,
                      color: libraryColorScheme.primarySubtle,
                    },
                  }}
                />
                <Field name="input">
                  {({ field, form }: FieldProps) => {
                    return (
                      <ResizableTextArea
                        {...field}
                        isDisabled={isDisabled || isLoading}
                        placeholder={placeholder}
                        _placeholder={{ color: libraryColorScheme.subtle }}
                        bg="#b6a6a026"
                        filter={libraryColorScheme.filter}
                        maxRows={10}
                        minRows={3}
                        onKeyDown={(event) => {
                          if (
                            event.key === "Enter" &&
                            !event.shiftKey &&
                            field.value &&
                            field.value.trim()
                          ) {
                            event.preventDefault();
                            form.submitForm();
                          }
                        }}
                      />
                    );
                  }}
                </Field>
              </Stack>
            </FormControl>
            <Button
              type="submit"
              w="full"
              isLoading={isLoading}
              colorScheme={libraryColorScheme.rawBg ? undefined : "blue"}
              bg={libraryColorScheme.primary}
              isDisabled={isDisabled || !values.input || !values.input.trim()}
              color={libraryColorScheme.primaryInverted}
              spinner={<BeatLoader size={8} color={libraryColorScheme.inverted} />}
              _hover={{
                filter: libraryColorScheme.filter,
              }}
            >
              {LANG_DATA?.submitTranslation ?? "Submit"}{" "}
              {<Text ml={2} as="span" color={libraryColorScheme.primarySubtle}></Text>}
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

export default OracleInput;
