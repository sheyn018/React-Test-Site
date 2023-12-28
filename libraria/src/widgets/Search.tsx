"use client";

import { useState, useEffect } from "react";
import {
  Input,
  Modal,
  ModalOverlay,
  Text,
  ModalContent,
  ModalBody,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Box,
  extendTheme,
} from "@chakra-ui/react";
import { FaSearch } from "react-icons/fa";
import OracleView from "@/components/OracleView";
import theme from "@/styles/theme";
import Fonts from "@/styles/fonts/Fonts";
import { BeatLoader } from "react-spinners";
import { ChakraNestedProvider } from "@/components/core/ChakraNestedProvider";
import { SearchStyleProps } from "../types";
import { getColorSchemeFromLibrary } from "@/utils/styleUtils";
import tinycolor from "tinycolor2";
import { AssistantStyles } from "@/types/extraFields";

function Search({
  anonKey,
  isDarkMode,
  style,
  darkModeStyle,
  keepStateOnClose = false,
}: {
  anonKey: string;
  keepStateOnClose?: boolean;
  isDarkMode?: boolean;
  style?: SearchStyleProps;
  darkModeStyle?: SearchStyleProps;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const handleOpen = () => {
    if (!keepStateOnClose) {
      setIsOpen(true);
    } else {
      setIsHidden(false);
    }
  };

  const handleClose = () => {
    if (!keepStateOnClose) {
      setIsOpen(false);
    } else {
      setIsHidden(true);
    }
  };

  const [library, setLibrary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const defaultStyle = {
    fontFamily: "Calibre",
    fontColor: "black",
    headerFontFamily: "Calibre",
    fontSize: "sm",
    iconColor: "rgba(0, 0, 0, 0.4)",
    borderColor: "rgba(0, 0, 0, 0.4)",
    hoverColor: "rgba(0, 0, 0, 0.3)",
    aiResponseFontColor: "black",
    inputBorderRadius: "md",
    inputBackgroundColor: "rgba(0, 0, 0, 0.05)",
    containerBackgroundColor: "white",
  };

  const defaultDarkModeStyle = {
    fontFamily: "Calibre",
    fontColor: "white",
    fontSize: "sm",
    iconColor: "rgba(255, 255, 255, 0.4)",
    headerFontFamily: "Calibre",
    borderColor: "rgba(255, 255, 255, 0.4)",
    hoverColor: "rgba(255, 255, 255, 0.3)",
    containerBackgroundColor: "rgba(255, 255, 255, 0.05)",
    aiResponseFontColor: "white",
    inputBackgroundColor: "rgba(255, 255, 255, 0.05)",
    inputBorderRadius: "md",
  };

  const currentStyle = isDarkMode
    ? { ...defaultDarkModeStyle, ...darkModeStyle }
    : { ...defaultStyle, ...style };

  useEffect(() => {
    async function fetchLibrary() {
      setLoading(true);
      try {
        const response = await fetch(`https://api.libraria.dev/initialize-library`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            anonKey,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLibrary(data);
      } catch (e) {
        console.error("An error occurred while fetching the library:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, [anonKey]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        handleOpen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleOpen]);

  useEffect(() => {
    if (library) {
      const element = document.getElementById("libraria-react");
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    }
  }, [library]);

  const libraryStyle = (library?.assistantStyles ?? {}) as AssistantStyles;
  const libraryColorScheme = getColorSchemeFromLibrary(libraryStyle);
  currentStyle.borderColor = currentStyle.borderColor ?? libraryColorScheme.primary;

  // Set the AI response background color. If it's not defined, use the primary subtle color from the library color scheme.
  // If that's also not defined, default to '#f2f2f2'.
  currentStyle.aiResponseBackgroundColor =
    currentStyle.aiResponseBackgroundColor || libraryColorScheme?.primarySubtle || "#f2f2f2";

  /**
   * Set the AI response font color. If it's not defined, use the color that contrasts
   * with the AI response background color. If the background color is dark, use white;
   * otherwise, use black. If the background color is also not defined, default to black.
   */
  currentStyle.aiResponseFontColor =
    currentStyle.aiResponseFontColor ||
    (currentStyle?.aiResponseBackgroundColor
      ? tinycolor(currentStyle.aiResponseBackgroundColor).isDark()
        ? "white"
        : "black"
      : "black");

  currentStyle.fontColor =
    currentStyle.fontColor ||
    (currentStyle?.containerBackgroundColor
      ? tinycolor(currentStyle.containerBackgroundColor).isDark()
        ? "white"
        : "black"
      : "black");

  currentStyle.borderColor =
    currentStyle.borderColor ||
    (currentStyle?.containerBackgroundColor
      ? tinycolor(currentStyle.containerBackgroundColor).isDark()
        ? "white"
        : "black"
      : "black");

  return (
    <Box id={"libraria-react"}>
      <ChakraNestedProvider
        theme={extendTheme({
          ...theme,
          styles: {
            ...theme.styles,
            global: {
              ...theme.styles.global,
              ".answerbeatloader": {
                color: tinycolor(currentStyle.aiResponseBackgroundColor).isDark()
                  ? "white"
                  : "black",
              },
            },
          },
          components: {
            ...theme.components,
            Heading: {
              ...theme.components.Heading,
              baseStyle: {
                ...theme.components.Heading.baseStyle,
                fontFamily: currentStyle.headerFontFamily ?? currentStyle.fontFamily ?? "Calibre",
              },
            },
            Divider: {
              ...theme.components.Divider,
              baseStyle: {
                ...theme.components.Divider.baseStyle,
                borderColor: currentStyle.borderColor,
              },
            },
            Modal: {
              ...theme.components.Modal,
              variants: {
                internal: (props) => {
                  return {
                    ...theme.components.Modal.baseStyle,
                    dialog: {
                      ...theme.components.Modal.baseStyle.dialog,
                      bg: "rgba(0, 0, 0, 0.85)",
                    },
                    body: {
                      ...theme.components.Modal.baseStyle.body,
                      fontSize: "md",
                      color: currentStyle.fontColor,
                    },
                    header: {
                      ...theme.components.Modal.baseStyle.header,
                      px: 0,
                      fontSize: "md",
                      color: currentStyle.fontColor,
                      fontFamily: currentStyle.fontFamily ?? "Calibre",
                    },
                  };
                },
              },
            },
            Textarea: {
              ...theme.components.Textarea,
              baseStyle: {
                ...theme.components.Input.baseStyle.field,
                fontFamily: currentStyle.fontFamily ?? "Calibre",
                borderColor: currentStyle.borderColor,
                borderRadius: currentStyle.inputBorderRadius,
                color: currentStyle.fontColor,
                _hover: {
                  border: "1px solid",
                  borderColor: tinycolor(currentStyle.borderColor).setAlpha(0.5).toRgbString(),
                },
                _placeholder: {
                  color: tinycolor(currentStyle.fontColor).setAlpha(0.5).toRgbString() ?? "white",
                },
                _focus: {
                  border: "1px solid",
                  borderColor: currentStyle.borderColor,
                },
                _active: {
                  border: "1px solid",
                  borderColor: currentStyle.borderColor,
                },
                backgroundColor: currentStyle.inputBackgroundColor,
              },
            },
            Input: {
              ...theme.components.Input,
              baseStyle: {
                element: {
                  color: currentStyle.fontColor,
                  _hover: {
                    color: currentStyle.borderColor,
                  },
                },
                field: {
                  ...theme.components.Input.baseStyle.field,
                  fontFamily: currentStyle.fontFamily ?? "Calibre",
                  borderColor: currentStyle.borderColor,
                  borderRadius: currentStyle.inputBorderRadius,
                  color: currentStyle.fontColor,
                  _hover: {
                    border: "1px solid",
                    borderColor: tinycolor(currentStyle.borderColor).setAlpha(0.5).toRgbString(),
                  },
                  _placeholder: {
                    color: tinycolor(currentStyle.fontColor).setAlpha(0.5).toRgbString() ?? "white",
                  },
                  _focus: {
                    border: "1px solid",
                    borderColor: currentStyle.borderColor,
                  },
                  _active: {
                    border: "1px solid",
                    borderColor: currentStyle.borderColor,
                  },
                  backgroundColor: currentStyle.inputBackgroundColor,
                },
              },
            },
            Button: {
              ...theme.components.Button,
              variants: {
                search: (props) => {
                  return {
                    ...theme.components.Button.variants.ghost(props),
                    color: currentStyle.fontColor,
                    borderColor: currentStyle.borderColor,
                    _hover: {
                      color: currentStyle.borderColor,
                      borderColor: currentStyle.borderColor,
                    },
                  };
                },
                searchInverted: (props) => {
                  return {
                    ...theme.components.Button.variants.ghost(props),
                    // get either black or white depending on the fontColor
                    color: tinycolor(currentStyle.aiResponseBackgroundColor).isDark()
                      ? "white"
                      : "black",
                    _hover: {
                      color: currentStyle.borderColor,
                      borderColor: currentStyle.borderColor,
                    },
                  };
                },
              },
              defaultProps: {
                variant: "search",
              },
              baseStyle: {
                ...theme.components.Button.baseStyle,
                color: currentStyle.fontColor,
                borderColor: currentStyle.borderColor,
                _hover: {
                  color: currentStyle.borderColor,
                  borderColor: currentStyle.borderColor,
                },
                _focus: {
                  color: currentStyle.borderColor,
                  borderColor: currentStyle.borderColor,
                },
                _active: {
                  color: currentStyle.borderColor,
                  borderColor: currentStyle.borderColor,
                },
              },
            },
            CardWithAvatar: {
              ...theme.components.CardWithAvatar,
              variants: {
                search: {
                  ...theme.components.CardWithAvatar.variants.search(),
                  borderRadius: currentStyle.inputBorderRadius,
                  container: {
                    ...theme.components.CardWithAvatar.variants.search().container,
                    px: 0,
                    backgroundColor: currentStyle.containerBackgroundColor,
                  },
                  itemStack: {
                    ...theme.components.CardWithAvatar.variants.search().itemStack,
                    backgroundColor:
                      currentStyle.aiResponseBackgroundColor ?? libraryColorScheme.primarySubtle,
                    color: currentStyle.aiResponseFontColor,
                  },
                  footer: {
                    ...theme.components.CardWithAvatar.variants.search().footer,
                    color: currentStyle.fontColor,
                  },
                },
              },
            },
          },
        })}
        cssVarsRoot={"#libraria-react"}
      >
        <Fonts />
        <Box fontFamily={currentStyle.fontFamily}>
          <InputGroup onClick={handleOpen}>
            <InputLeftElement pointerEvents="none">
              <FaSearch color={currentStyle.iconColor as any} />
            </InputLeftElement>
            <Input
              cursor={"pointer"}
              readOnly
              placeholder="Search"
              autoFocus={true}
              border="1px solid"
              backgroundColor={currentStyle.inputBackgroundColor}
              color={currentStyle.fontColor}
              borderRadius={currentStyle.inputBorderRadius}
              borderColor={currentStyle.borderColor}
              _hover={{
                backgroundColor: currentStyle.hoverColor,
                borderColor: currentStyle.borderColor,
              }}
              _focus={{
                borderColor: currentStyle.borderColor,
              }}
              _active={{
                borderColor: currentStyle.borderColor,
              }}
            />
            <InputRightElement width="3.5rem">
              <Box
                color={currentStyle.borderColor}
                borderColor={currentStyle.borderColor}
                border="1px solid"
                borderRadius="md"
                px={"10px"}
              >
                <Text as="span" fontSize="sm">
                  ⌘
                </Text>
                <Text as="span" fontSize="sm">
                  K
                </Text>
              </Box>
            </InputRightElement>
          </InputGroup>
        </Box>
        <Box display={!keepStateOnClose ? undefined : isHidden ? "none" : "block"}>
          <Modal
            isOpen={keepStateOnClose ? !isHidden : isOpen}
            closeOnEsc={true}
            onOverlayClick={handleClose}
            onClose={handleClose}
            scrollBehavior="inside"
            size="2xl"
          >
            <ModalOverlay />
            <ModalContent bg={currentStyle.containerBackgroundColor}>
              <ModalBody
                w="full"
                p={0}
                backgroundColor={"none"}
                fontFamily={currentStyle.fontFamily}
                color={currentStyle.fontColor}
              >
                {!library ?? loading ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <BeatLoader />
                  </Box>
                ) : (
                  <OracleView variant="search" library={library} isCompact={true} />
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </Box>
      </ChakraNestedProvider>
    </Box>
  );
}

export default Search;
