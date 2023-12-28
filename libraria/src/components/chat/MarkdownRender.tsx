// import "katex/dist/katex.min.css";
import { FunctionComponent, useEffect, useMemo, useState } from "react";
import { Code } from "bright";
import styles from "./github-markdown-light.module.css";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import {
  Text,
  Box,
  BoxProps,
  Image,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { MemoizedReactMarkdown } from "./MemoizedReactMarkdown";
import { CopyIcon } from "../icons/Icons";
import CafeLink from "../core/CafeLink";

type Props = {
  markdown: string;
  utmParam?: string;
} & BoxProps;

const Markdown: FunctionComponent<Props> = ({
  markdown,
  utmParam,
  ...rest
}: {
  markdown: string;
  utmParam?: string;
} & BoxProps) => {
  const components: Partial<any> = useMemo(
    () => ({
      code: ({ inline, className, children, ...props }) => {
        const match = /language-(\w+)/.exec(className || "");
        return !inline && match ? (
          <div style={{ position: "relative" }}>
            <Code lang={match[1]}
              style={{
                paddingTop: '20px',
              }}
            >
              {String(children).replace(/\n$/, "")}
            </Code>
            <IconButton
              aria-label="Copy code"
              icon={<CopyIcon />}
              isRound
              size="sm"
              position="absolute"
              top={2}
              right={2}
              onClick={() => {
                if (navigator && navigator.clipboard) {
                  navigator.clipboard.writeText(String(children));
                } else {
                  // Fallback for environments where clipboard is not available
                  console.warn("Clipboard API not available");
                }
              }}
            />
          </div>
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
      div: ({ className, children, ...props }) => {
        return (
          <div className={className} {...props}>
            {children}
          </div>
        );
      },
      p: ({ className, children, ...props }) => {
        return (
          <Text
            className={className}
            style={{
              whiteSpace: "pre-wrap",
            }}
            color="default"
            {...rest}
            {...props}
            fontSize={{
              base: "sm",
              md: "md",
            }}
          >
            {children}
          </Text>
        );
      },
      a: ({ children, href, ...props }) => {
        // replace with utm tag if exists
        let newHref = href;
        if (utmParam && newHref) {
          newHref = newHref + (newHref.includes("?") ? "&" : "?") + utmParam;
        }
        return (
          <CafeLink
            isExternal
            color="black !important"
            textDecoration={"underline !important"}
            fontWeight="bold"
            _hover={{ opacity: "50%" }}
            href={newHref}
            {...props}
          >
            {children}
          </CafeLink>
        );
      },

      img: ({ src }) => {
        const [tempUrl, setTempUrl] = useState("");
        const { isOpen, onOpen, onClose } = useDisclosure();

        useEffect(() => {
          fetchTempUrl(src);
        }, [src]);

        async function fetchTempUrl(src) {
          const s3Url = "https://libraria-prod-p.s3.us-east-1.amazonaws.com/";
          if (src && src.startsWith(s3Url)) {
            const s3Key = src.split(s3Url)[1];
            if (s3Key) {
              try {
                const response = await fetch(`/api/generate-temporary-url?key=${s3Key}`);
                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const { temporaryUrl } = data;
                setTempUrl(temporaryUrl);
              } catch (error) {
                console.error("There was a problem with the fetch operation: ", error);
              }
            }
          }
        }

        return (
          <>
            <Image
              src={tempUrl || src}
              fallback={<>{src}</>}
              bg="none"
              maxW="75% !important"
              maxH={"240px"}
              backgroundColor="transparent !important"
              borderRadius="lg"
              onClick={onOpen}
            />
            <Modal isOpen={isOpen} onClose={onClose} size="lg">
              <ModalOverlay />
              <ModalContent>
                <ModalBody>
                  <Image
                    src={tempUrl || src}
                    fallback={<>{src}</>}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </>
        );
      },
      table: ({ children, ...props }) => {
        return (
          <table {...props} style={{ color: "white" }}>
            {children}
          </table>
        );
      },
      // handle lists and make black text
      ul: ({ children, ...props }) => {
        return (
          <ul {...props} style={{ color: "black" }}>
            {children}
          </ul>
        );
      },
      ol: ({ children, ...props }) => {
        return (
          <ol {...props} style={{ color: "black" }}>
            {children}
          </ol>
        );
      },
      h1: ({ children, ...props }) => {
        return (
          <h1 style={{ color: "black" }} {...props}>
            {children}
          </h1>
        );
      },
      h2: ({ children, ...props }) => {
        return (
          <h2 style={{ color: "black" }} {...props}>
            {children}
          </h2>
        );
      },
      h3: ({ children, ...props }) => {
        return (
          <h3 style={{ color: "black" }} {...props}>
            {children}
          </h3>
        );
      },
      h4: ({ children, ...props }) => {
        return (
          <h4 style={{ color: "black" }} {...props}>
            {children}
          </h4>
        );
      },
      h5: ({ children, ...props }) => {
        return (
          <h5 style={{ color: "black" }} {...props}>
            {children}
          </h5>
        );
      },
    }),
    [utmParam, rest],
  );

  return (
    <Box
      className={styles["markdown-body"]}
      style={{ backgroundColor: "transparent" }}
      {...rest}
      px={2}
      fontSize={{
        base: "sm",
        md: "md",
      }}
    >
      <MemoizedReactMarkdown
        children={markdown
          .replace(/\$/g, "\\$")
          .replace("====={}", "")
          ?.replace('"help_articles": []', "")}
        remarkPlugins={[remarkGfm, remarkMath]}
        components={components}
      />
    </Box>
  );
};

export default Markdown;
