"use client";
import { dynamicHoverFilter, dynamicTitleColor } from "@/utils/styleUtils";
import ClientChatView from "../components/ClientChatView";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { VscChevronDown } from "react-icons/vsc";
import { Box, IconButton, useMediaQuery, useToast } from "@chakra-ui/react";
import { ChakraNestedProvider } from "@/components/core/ChakraNestedProvider";
import theme from "@/styles/theme";
import { BsChatTextFill } from "react-icons/bs";

const MotionIcon = motion(IconButton);

function Chatbot({
  anonKey,
  placement = "right",
  style = {},
}: {
  anonKey: string;
  placement?: string;
  style?: any;
}) {
  // fetch library
  const [library, setLibrary] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false); // state to control visibility of ClientChatView
  const [isMobile] = useMediaQuery("(max-width: 768px)");
  const toast = useToast();

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
        toast({
          title: "An error occurred.",
          description: "n error occurred while fetching the library.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
        console.error("An error occurred while fetching the library:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, [anonKey]);

  const handleButtonClick = () => {
    setIsOpen(!isOpen); // toggle visibility on button click
  };

  if (!library || loading) {
    return <div></div>;
  }

  return (
    <Box id={"libraria-react"}>
      <ChakraNestedProvider theme={theme} cssVarsRoot={"#libraria-react"}>
        <div
          style={{
            position: "fixed",
            bottom: "12px",
            right: isMobile ? "0" : placement === "right" ? "12px" : undefined,
            left: isMobile ? "0" : placement === "left" ? "12px" : undefined,
            width: isMobile ? "100%" : undefined,
            height: isMobile ? "100%" : undefined,
            zIndex: "100",
            ...style,
          }}
        >
          <div style={{ position: "relative" }}>
            {isOpen && (
              <Box
                position="relative"
                w="100%"
                h={isMobile ? "100vh" : "85vh"}
                zIndex={3000}
                bg="transparent"
              >
                <Box h="100%" w="400px">
                  <ClientChatView library={library} />
                </Box>
              </Box>
            )}
            <Box
              w="full"
              display={"flex"}
              justifyContent={placement === "right" ? "flex-end" : "flex-start"}
            >
              {!isMobile && ( // Hide button on mobile
                <Box
                  w="full"
                  display={"flex"}
                  justifyContent={placement === "right" ? "flex-end" : "flex-start"}
                >
                  <MotionIcon
                    w="50px"
                    borderRadius="100%"
                    h="50px"
                    icon={isOpen ? <VscChevronDown /> : <BsChatTextFill />}
                    aria-label="Toggle chat"
                    _hover={{
                      filter: library?.assistantStyles?.["color"]
                        ? dynamicHoverFilter(library?.assistantStyles?.["color"])
                        : undefined,
                    }}
                    color={dynamicTitleColor(library?.assistantStyles?.["color"] ?? "black")}
                    onClick={handleButtonClick}
                    zIndex="100"
                    bg={library?.assistantStyles?.["color"] ?? "black"}
                    boxShadow="0 0 10px rgba(0, 0, 0, 0.1)"
                    cursor="pointer"
                    animate={{ scale: isOpen ? 0.8 : 1 }} // Change this line
                    transition={{ duration: 0.5 }}
                  />
                </Box>
              )}
            </Box>
          </div>
        </div>
      </ChakraNestedProvider>
    </Box>
  );
}

export default Chatbot;
