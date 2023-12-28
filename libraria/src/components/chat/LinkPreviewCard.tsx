import {
  Link,
  Text,
  Divider,
  Image,
  ButtonGroup,
  Skeleton,
  LinkBox,
  LinkOverlay,
  Button,
  Card,
  CardBody,
  CardFooter,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CiShoppingCart } from "react-icons/ci";
import { useMeasure } from "react-use";
import { useEffect, useState } from "react";
import { ExternalLinkIcon } from "../icons/Icons";

export default function LinkPreviewCard({ url, title, ogTags: initialOgTags, ...rest }: any) {
  const breakpointDesktop = useBreakpointValue(
    { base: false, lg: true },
    {
      ssr: false,
    },
  );
  const [ref, { width }] = useMeasure();
  const titleFontSize = width < 600 ? "xs" : "sm";
  const isTruncated = width < 600 ? true : false;
  const descriptionFontSize = width < 600 ? "xs" : "sm";
  const buttonSize = width < 600 ? "sm" : "lg";
  const buttonWidth = width < 600 ? "full" : "fit-content";

  const [ogTags, setOgTags] = useState(initialOgTags);
  const [isLoading, setIsLoading] = useState(!initialOgTags); // Add isLoading state

  useEffect(() => {
    let timeoutId;

    if (!ogTags) {
      fetch(`/api/public/scrape-url?ogOnly=true&url=${encodeURIComponent(url)}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => setOgTags(data.ogTags))
        .catch((error) => {
          console.error(`Failed to fetch OG tags:`, error);
          setOgTags({}); // Set ogTags to an empty object on failure
        })
        .finally(() => {
          setIsLoading(false);
        });
      // Set a timeout to stop loading after 4 seconds
    }

    timeoutId = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    // Clear the timeout when the component is unmounted or when the url or initialOgTags change
    return () => {
      clearTimeout(timeoutId);
    };
  }, [url, initialOgTags]);

  const isDesktop = rest.isDesktop ?? breakpointDesktop;

  if (isLoading) {
    // Render skeleton while waiting for OG tags to load
    return (
      <Card maxW="sm" p={0} ref={ref as any} w="200px" maxH={"150px"}>
        <Skeleton height="200px" />
        <Stack mt="1" spacing="3" p="4">
          <Skeleton height="20px" width="80%" />
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="60%" />
        </Stack>
        <Divider />
        <CardFooter p={width < 600 ? 0 : undefined} w="full">
          <ButtonGroup spacing="2" w="full">
            <Button
              borderRadius={width < 600 ? 0 : "md"}
              borderBottomRadius="md"
              w={buttonWidth}
              size={buttonSize}
              variant="solid"
              bg="black"
              color="white"
              _hover={{ bg: "gray" }}
              as={Link}
              href={url}
              isExternal={true}
            >
              {" "}
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
  } else if (ogTags?.["og:image"]) {
    return (
      <Card
        maxW="200px"
        p={0}
        ref={ref as any}
        as={LinkBox}
        _hover={{
          filter: "brightness(0.95)",
          transition: "all 0.2s ease-in-out",
        }}
      >
        <CardBody p={width < 600 ? 0 : 8}>
          {ogTags?.["og:image"] && ogTags?.["og:image"]?.length > 0 && (
            <Image src={ogTags?.["og:image"]} m="auto" fallback={<></>} borderTopRadius="lg" />
          )}
          <Stack mt="1" spacing={width < 600 ? 0 : 3} px={4} py={2}>
            <LinkOverlay href={url} isExternal={true}>
              <Text fontSize={titleFontSize} fontWeight={"bold"} isTruncated={!isDesktop}>
                {ogTags?.["og:title"] ?? title}
              </Text>
              <Text fontSize={descriptionFontSize} isTruncated={isTruncated}>
                {ogTags?.["og:description"]}
              </Text>
              <Text
                color="blue.600"
                fontSize={{
                  base: "md",
                  md: "md",
                  lg: "lg",
                }}
              >
                {ogTags?.["og:price:amount"]} {ogTags?.["og:price:currency"]}
              </Text>
            </LinkOverlay>
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter p={width < 600 ? 0 : undefined} w="full">
          <ButtonGroup spacing="2" w="full">
            {
              <Button
                borderRadius={width < 600 ? 0 : "md"}
                borderBottomRadius="md"
                w={buttonWidth}
                fontSize={titleFontSize}
                size={buttonSize}
                rightIcon={ogTags?.["og:price:amount"] ? <CiShoppingCart /> : <ExternalLinkIcon />}
                variant="solid"
                bg="black"
                color="white"
                _hover={{
                  bg: "gray",
                }}
                as={Link}
                href={ogTags?.["og:url"]}
                isExternal={true}
              >
                {ogTags?.["og:price:amount"] ? "Buy now" : "Learn more"}
              </Button>
            }
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
  } else {
    return (
      <Card maxW="sm" p={0} ref={ref as any}>
        <Stack mt="1" spacing="3" p="4">
          <Text fontSize={titleFontSize} fontWeight={"bold"} isTruncated={!isDesktop}>
            {title}
          </Text>
        </Stack>
        <Divider />
        <CardFooter p={width < 600 ? 0 : undefined} w="full">
          <ButtonGroup spacing="2" w="full">
            <Button
              borderRadius={width < 600 ? 0 : "md"}
              borderBottomRadius="md"
              w={buttonWidth}
              size={buttonSize}
              rightIcon={<ExternalLinkIcon />}
              variant="solid"
              bg="black"
              color="white"
              _hover={{ bg: "gray" }}
              as={Link}
              href={url}
              isExternal={true}
            >
              Learn More
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    );
  }
}
