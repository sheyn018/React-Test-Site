import { useEffect, useRef, useState } from "react";
import { LanguageName } from "@/utils/languages";
import React from "react";
import { useEffectOnce, useLocalStorage } from "react-use";
import { AppToolType, PAGINATE_SKIP } from "@/constants";
import { useToast } from "@chakra-ui/react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import useSWRImmutable from "swr/immutable";
import { FatalError, RetryableError } from "../errors";
import { AssistantPrivacy, GptQuery, KnowledgeLibrary, TiptapNode } from "@/types";

const STATUS_TEXTS = {
  401: "Unauthorized.",
  402: "Not enough credits. Please subscribe, or wait for your credits to replenish",
  403: "Forbidden. Please check if this domain has access to the widget",
  429: "Too many requests. Please try again later",
  500: "Something went wrong. Please try again later",
  504: "Timeout error. We are currently working on fixing this.",
  451: "This query is not allowed. Please try again",
  452: "Spend limit reached.",
};

type ChatMessage = {
  text: string;
  component?: any;
  gptQuery?: Partial<GptQuery>;
  id?: string;
  type: "user" | "assistant";
};

type MessageState = {
  messages: ChatMessage[];
  history: [string, string][];
  pending?: string;
};

export function formMessages(message: any) {
  return [
    {
      text: message.prompt ?? "",
      type: "user",
      createdAt: message.createdAt,
      gptQuery: {
        id: message.id,
      },
    },
    {
      text: message?.answer ?? "",
      type: "assistant",
      gptQuery: {
        id: message.id,
        extraFields: message.extraFields,
      },
      createdAt: message.updatedAt,
    },
  ];
}

export function useChatHook({
  library,
  type,
  cachePreviousMessagesLocalStorage = false,
  isPublicFacing = false,
  userOptions,
}: {
  type: "chatbot" | "oracle" | "chat";
  library: Partial<KnowledgeLibrary>;
  cachePreviousMessagesLocalStorage?: boolean;
  isPublicFacing?: boolean;
  userOptions?: {
    email: string;
    userId: string;
    name: string;
  };
}) {
  const [currQuestion, setCurrQuestion] = useState<string>("");
  const { data: session } = { data: undefined };
  const [streaming, setStreaming] = useState<boolean>(false);
  const streamingRef = useRef<boolean>(streaming);
  const [fetchedPreviousMessages, setFetchedPreviousMessages] = useState<boolean>(false);
  const gptQueryIdRef = useRef();
  const [messageState, setMessageState] = useState<MessageState>({
    messages: [],
    history: [],
  });

  const [usedSuggestions, setUsedSuggestions] = useState<string[]>([]);
  const [hasError, setHasError] = React.useState(false);
  const [controller, setController] = useState<AbortController>();
  const [currentConversation, setCurrentConversation, removeConversation] = useLocalStorage(
    `embed-chat-conversation-id-${type}-${library?.anonKey}-v0`,
    {
      id: undefined,
      createdAt: new Date().toISOString(),
      hasEmail: false,
      emailClosed: false,
    },
  );
  const currentConversationRef = useRef(currentConversation);
  const [currentLang, setCurrentLang, removeCurrentLang] = useLocalStorage<
    LanguageName | undefined
  >(library?.id ? `chat-language-${library.anonKey}` : "chat-language-default", undefined);
  const [iterationPercentage, setIterationPercentage] = useState<number | undefined>();
  const [tool, setTool] = useState<AppToolType>();
  const [toolData, setToolData] = useState<any>();
  const toast = useToast();

  const BASE_URL = "https://api.libraria.dev/public";
  const queryUrl = !library ? null : `${BASE_URL}/query`;
  const gptQueryUrl = `https://libraria.dev/api/public/gpt-query`;
  const gptConversationUrl = `${BASE_URL}/conversation`;

  useEffectOnce(() => {
    if (isPublicFacing) {
      if (type === "oracle" || type === "chat") {
        setCurrentConversation({
          id: undefined,
          createdAt: new Date().toISOString(),
          hasEmail: false,
          emailClosed: false,
        });
      } else if (type === "chatbot") {
        // if older than 4 hours,
        if (
          new Date().getTime() - new Date(currentConversation?.createdAt ?? 0).getTime() >
          4 * 60 * 60 * 1000
        ) {
          // removeConversation();
          setCurrentConversation({
            id: undefined,
            createdAt: new Date().toISOString(),
            hasEmail: false,
            emailClosed: false,
          });
        }
      }
    }
  });

  useEffect(() => {
    currentConversationRef.current = currentConversation;
    if (userOptions && currentConversationRef.current?.id) {
      fetch(`${gptConversationUrl}/${currentConversationRef.current?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userOptions,
          anonKey: library.anonKey,
        }),
      });
    }
  }, [currentConversation, gptConversationUrl, library.anonKey, userOptions]);

  useEffect(() => {
    streamingRef.current = streaming;
  }, [streaming]);

  async function postFollowUpValueToGptConversation(followUpValue: string) {
    if (!currentConversation) {
      return;
    }
    const { id, createdAt } = currentConversation;
    const response = await fetch(gptConversationUrl + `/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        followUpValue,
        anonKey: library.anonKey,
      }),
    });
    await response.json();
    setCurrentConversation({
      id,
      createdAt,
      hasEmail: true,
      emailClosed: true,
    });
  }

  async function closeEmail() {
    if (!currentConversation) {
      return;
    }
    const { id, createdAt } = currentConversation ?? {};

    setCurrentConversation({
      id,
      createdAt,
      hasEmail: false,
      emailClosed: true,
    });
  }

  function setInitialMessageState(localMessages) {
    const prev: MessageState = {
      history: [],
      messages: localMessages.map(formMessages)?.flat(),
    };

    if (
      type !== "oracle" &&
      (prev.messages.length === 0 ||
        (prev.messages.length > 0 && localMessages.length < PAGINATE_SKIP))
    ) {
      prev.messages.unshift({
        text: `I am ${library?.assistantName ?? "Chatbot"}. Nice to meet you! ${
          library?.assistantShouldIgnoreGpt
            ? `\n\nI only have access to documents you put in my library. You may enable access to external knowledge in the Assistant Settings if you prefer`
            : `\n\nI have access to documents you put in my library and other external knowledge I was trained on.\n\n You can disable the external knowledge in your Assistant Settings if you prefer`
        }`,
        type: "assistant" as const,
      });
    }
    setMessageState(prev);
    setFetchedPreviousMessages(true);
  }

  const getQueries = async (skip: number) => {
    if (!conversationUrl) {
      setFetchedPreviousMessages(true);
      return;
    }
    const response = await fetch(conversationUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anonKey: library.anonKey,
        skip,
      }),
    });
    const paginatedMessages = await response.json();
    setInitialMessageState(paginatedMessages);
    setFetchedPreviousMessages(true);
    return paginatedMessages;
  };

  const stopGenerate = async () => {
    // abort the current request and send to server
    if (controller) {
      controller.abort();
    }
    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "assistant",
          text: state.pending ?? "",
          gptQuery: {
            id: gptQueryIdRef.current,
          },
        },
      ],
      pending: undefined,
    }));
    await fetch(`${gptQueryUrl}/${gptQueryIdRef.current}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        answer: messageState.pending ?? "",
        status: "completed",
        anonKey: library.anonKey,
      }),
    });
    setIterationPercentage(undefined);
    setStreaming(false);
  };

  const conversationUrl = React.useMemo(() => {
    return currentConversationRef.current?.id &&
      (library.assistantPrivacy === AssistantPrivacy.public ||
        library.assistantPrivacy === AssistantPrivacy.unlisted ||
        session ||
        isPublicFacing) &&
      !fetchedPreviousMessages
      ? `${gptConversationUrl}/${currentConversationRef.current?.id}`
      : null;
  }, [
    currentConversation?.id,
    library,
    session,
    isPublicFacing,
    fetchedPreviousMessages,
    gptConversationUrl,
  ]);

  const { data: messages } = useSWRImmutable(conversationUrl, async (url: string) => {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        anonKey: library.anonKey,
      }),
    });
    if (!response.ok) {
      throw new Error("An error occurred while fetching the data.");
    }
    return response.json();
  });

  if (messages) {
    setInitialMessageState(cachePreviousMessagesLocalStorage ? messages : []);
  }

  async function handleSubmit(values: any, params?: any) {
    if (streamingRef.current) {
      return;
    }
    setStreaming(true);
    const query: string = values.input?.trim();
    const tiptapJson: any = values.tiptapJson;
    const hasNode: boolean = values.hasNode;
    const nodes: TiptapNode[] = values.nodes;

    if (!query) {
      return;
    }

    setMessageState((state) => ({
      ...state,
      messages: [
        ...state.messages,
        {
          type: "user",
          text: query,
          tiptap: tiptapJson,
        },
      ],
      pending: undefined,
    }));

    setCurrQuestion(query);
    setMessageState((state) => ({ ...state, pending: "" }));
    setHasError(false);
    setIterationPercentage(0);
    if (params && params.resetForm) {
      params.resetForm();
    }

    const abortController = new AbortController();
    setController(abortController);

    let retryCount = 0;
    const MAX_RETRIES = 3;

    if (queryUrl) {
      const requestTimeoutId = setTimeout(async () => {
        if (streamingRef.current) {
          console.error("Request took too long, aborting...");
          toast({
            title: "Error",
            description: "Request timed out. Please try again",
            status: "error",
            duration: 9000,
            isClosable: true,
          });

          abortController.abort();
          setStreaming(false);
          setIterationPercentage(undefined);
          await fetch(`${gptQueryUrl}/${gptQueryIdRef.current}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              answer: messageState.pending ?? "",
              status: "completed",
              anonKey: library.anonKey,
            }),
          });
        }
      }, 30000);

      fetchEventSource(queryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // add cookies
          Cookie: document.cookie,
        },
        body: JSON.stringify({
          query,
          conversationId: currentConversationRef.current?.id,
          anonKey: library.anonKey,
          language: currentLang,
          hasNode,
          nodes,
        }),
        signal: abortController.signal,
        // continue to refetch even when leaving tab
        openWhenHidden: true,
        onopen: async (response) => {
          if (requestTimeoutId) clearTimeout(requestTimeoutId);
          if (!response.ok) {
            setStreaming(false);
            const isClientSideError =
              response.status >= 400 &&
              response.status !== 405 &&
              response.status < 500 &&
              response.status !== 429;
            if (isClientSideError) {
              throw new FatalError({
                message: STATUS_TEXTS[response.status] ?? response.statusText,
                code: response.status,
              });
            } else {
              throw new RetryableError(response.statusText);
            }
          }
        },
        onclose: () => {
          setStreaming(false);
          setIterationPercentage(undefined);
        },
        onerror: (error) => {
          if (requestTimeoutId) clearTimeout(requestTimeoutId);
          console.log(391, {
            error,
            isFatal: error instanceof FatalError,
          });
          if (error instanceof FatalError) {
            abortController.abort();
            setStreaming(false);
            setIterationPercentage(undefined);
            fetch(`${gptQueryUrl}/${gptQueryIdRef.current}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                answer: messageState.pending ?? "",
                status: "completed",
                anonKey: library.anonKey,
              }),
            })
              .then(() => {
                if (!toast.isActive(gptQueryIdRef.current ?? "error-toast")) {
                  toast({
                    id: gptQueryIdRef.current ?? "error-toast",
                    title: "Error",
                    description: error.message ?? "Something went wrong. Please try again.",
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                  });
                }
              })
              .catch((error) => {
                console.error("Error:", error);
              });
            throw error;
          } else {
            console.log("retrying...");
            if (++retryCount > MAX_RETRIES) {
              console.error("Hit max retry count");
              const err = {
                message: "Failed to complete stream.",
                code: 500,
              };

              toast({
                id: gptQueryIdRef.current ?? "error-toast",
                title: "Error",
                description:
                  error.error ?? error.message ?? "Something went wrong. Please try again.",
                status: "error",
                duration: 9000,
                isClosable: true,
              });

              setStreaming(false);
              setIterationPercentage(undefined);
              setMessageState((state) => ({
                ...state,
                messages: [...state.messages],
                pending: undefined,
              }));
              clearTimeout(requestTimeoutId);
              fetch(`${gptQueryUrl}/${gptQueryIdRef.current}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  answer: messageState.pending ?? "",
                  status: "completed",
                  anonKey: library.anonKey,
                }),
              });
              abortController.abort();
              throw new FatalError(err);
            }
          }
        },
        onmessage: (event) => {
          const eventData = JSON.parse(event.data);
          if (eventData.type === "token") {
            setIterationPercentage(undefined);
            const { value } = eventData;
            setMessageState((state) => ({
              ...state,
              pending: (state.pending ?? "") + value,
            }));
            if ((messageState.pending ?? "").length > 0) {
              clearTimeout(requestTimeoutId); // Clear the timeout if pending length is greater than 0
            }
          } else if (eventData.type === "response") {
            const { gptQuery } = eventData.data;

            setMessageState((state) => ({
              history: [...state.history, [query, state.pending ?? ""]],
              messages: [
                ...state.messages,
                {
                  type: "assistant",
                  text: state.pending ?? "",
                  gptQuery,
                },
              ],
              pending: undefined,
            }));
          } else if (eventData.type === "initializing") {
            const { gptQueryId } = eventData;
            gptQueryIdRef.current = gptQueryId;
          } else if (eventData.type === "processing-query") {
            const { conversationId } = eventData;
            setCurrentConversation((conv) => {
              return {
                ...(conv ?? {
                  id: undefined,
                  createdAt: new Date().toISOString(),
                  hasEmail: false,
                  emailClosed: false,
                }),
                id: conversationId,
              };
            });
          } else if (eventData.type === "done") {
            setStreaming(false);
            setIterationPercentage(undefined);
            // clear timeout
            clearTimeout(requestTimeoutId);
          } else if (eventData.type === "summarizing") {
            setIterationPercentage((state) => {
              return Math.ceil((((state ?? 0) + 1) / eventData.data.total) * 100);
            });
          } else if (eventData.type === "directResponse") {
            const { gptQuery } = eventData;
            setMessageState((state) => ({
              history: [...state.history, [query, state.pending ?? ""]],
              messages: [
                ...state.messages,
                {
                  type: "assistant",
                  text: gptQuery.answer ?? "",
                  gptQuery,
                },
              ],
            }));
            setStreaming(false);
            setIterationPercentage(undefined);
            clearTimeout(requestTimeoutId);
          } else if (eventData.type === "tool") {
            const { tool: toolType, extraData } = eventData;
            // set tool of last message
            const lastMessage = messageState.messages[messageState.messages.length - 1];
            setMessageState((state) => ({
              ...state,
              messages: [
                ...state.messages.slice(0, -1),
                {
                  ...lastMessage,
                  tool: {
                    type: toolType,
                    data: extraData,
                  },
                },
              ],
            }));
            setTool(toolType);
            setToolData(extraData);
          } else if (eventData.type === "error") {
            const isClientSideError =
              eventData.status >= 400 && eventData.status < 500 && eventData.status !== 429;
            if (isClientSideError) {
              throw new FatalError({
                message: STATUS_TEXTS[eventData.status] ?? eventData.statusText,
                code: eventData.status,
              });
            } else {
              throw new RetryableError(eventData.statusText);
            }
          } else {
            throw new Error("Unknown event data type:", eventData);
          }
        },
      });
    }
  }

  return {
    messageState,
    setMessageState,
    hasError,
    handleSubmit,
    currQuestion,
    setCurrQuestion,
    currentLang,
    iterationPercentage,
    usedSuggestions,
    setUsedSuggestions,
    setCurrentLang,
    removeCurrentLang,
    removeConversation: () => {
      removeConversation();
      setUsedSuggestions([]);
      setCurrentConversation({
        id: undefined,
        createdAt: new Date().toISOString(),
        hasEmail: false,
        emailClosed: false,
      }); // or your initial state
      controller?.abort();
      setStreaming(false);
    },
    setHasError,
    fetchedPreviousMessages,
    closeEmail,
    stopGenerate,
    streaming,
    postFollowUpValueToGptConversation,
    currentConversation,
    getQueries,
    tool,
    toolData,
    setCurrentConversation,
  };
}
