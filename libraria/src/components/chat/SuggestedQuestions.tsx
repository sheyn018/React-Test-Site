import { WrapItem, Button, useBreakpointValue, Flex, Box, Wrap } from "@chakra-ui/react";
import { motion } from "framer-motion";
import React, { useRef } from "react";
import { RxCaretRight } from "react-icons/rx";

function SuggestedQuestions({
  suggestions,
  handleSubmit,
  buttonProps,
  containerType = "wrap",
  borderRadius = "full",
  ...rest
}) {
  const scrollContainer = useRef<any>(null);
  let isDown = false;
  let startX;
  let scrollLeft;

  const onMouseDown = (e) => {
    isDown = true;
    startX = e.pageX - scrollContainer.current.offsetLeft;
    scrollLeft = scrollContainer.current.scrollLeft;
  };

  const onMouseLeave = () => {
    isDown = false;
  };

  const onMouseUp = () => {
    isDown = false;
  };

  const onMouseMove = (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.current.offsetLeft;
    const walk = (x - startX) * 3; //scroll-fast
    scrollContainer.current.scrollLeft = scrollLeft - walk;
  };

  const Container = containerType === "wrap" ? Wrap : Box;

  return (
    <Container
      py={1}
      ref={scrollContainer}
      onMouseDown={onMouseDown}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      maxW="inherit"
      height={"auto"} // adjust this value as needed
      overflowX={"scroll"}
      whiteSpace={"nowrap"}
      overflowY="hidden"
      sx={{
        "&::-webkit-scrollbar": {
          display: "none",
        },
        "-ms-overflow-style": "none",
        "scrollbar-width": "none",
        cursor: "grab",
        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      {suggestions
        ?.filter((query) => query.length > 0)
        ?.map((query, i) => (
          <WrapItem key={`suggested-q-${i}`}>
            <Button
              as={motion.button}
              textAlign={"left"}
              height="auto"
              blockSize="auto"
              onClick={async () => {
                await handleSubmit(query);
              }}
              key={i}
              size="xs"
              bg="bg-surface"
              color="muted"
              py={"4px"}
              borderColor="blackAlpha.300"
              variant="outline"
              {...rest}
              {...buttonProps}
              _hover={{
                boxShadow: "sm",
                bg: "#b6a6a026",
              }}
              fontSize={{
                base: "xs",
                md: "sm",
              }}
              style={{
                overflow: "visible", // change from 'hidden' to 'visible'
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                wordWrap: "break-word", // add this line
              }}
              whiteSpace="normal" // change from 'nowrap' to 'normal'
              borderRadius={borderRadius}
            >
              <Flex alignItems={"center"}>
                {query} <RxCaretRight />
              </Flex>
            </Button>
          </WrapItem>
        ))}
    </Container>
  );
}

export default SuggestedQuestions;
