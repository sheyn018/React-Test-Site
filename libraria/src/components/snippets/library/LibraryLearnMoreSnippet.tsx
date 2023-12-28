import { Box, useBreakpointValue } from "@chakra-ui/react";
import GooglePlaceCard from "./cards/GooglePlaceCard";
import ChakraCarousel from "./carousel/CardCarousel";
import ShopifyBuy from "shopify-buy";
import ShopifyPreviewCard from "@/components/chat/ShopifyPreviewCard";
import LinkPreviewCard from "@/components/chat/LinkPreviewCard";

const youtubeRegex = /(http:|https:)?\/\/(www\.)?(youtube.com|youtu.be.com)/;

function LibraryLearnMoreSnippet({ shopify, documents, places, removeConversation, maxW = 500 }) {
  const isDesktop = useBreakpointValue(
    { base: false, lg: true },
    {
      ssr: false,
    },
  );
  // dedupe by url
  let shopifyClient;

  if (shopify && shopify.storefrontAccessToken) {
    shopifyClient = ShopifyBuy.buildClient({
      domain: shopify.domain,
      storefrontAccessToken: shopify.storefrontAccessToken,
    });
  }

  documents = documents?.filter((article, i, self) => {
    return self.findIndex((a) => a.url === article.url) === i;
  });

  return (
    <Box p={4} overflowX="hidden">
      {places?.length && (
        <ChakraCarousel gap={32} itemWidthInitial={200}>
          {places?.map((place, i) => {
            return <GooglePlaceCard placeData={place} key={`google-map-${i}`} />;
          })}
        </ChakraCarousel>
      )}
      {shopify?.products && (
        <ChakraCarousel gap={32} itemWidthInitial={200}>
          {shopify?.products?.map((product, i) => {
            return (
              <ShopifyPreviewCard
                key={`shopify-product-${i}`}
                client={shopifyClient}
                checkoutId={shopify.checkout?.id}
                product={product}
              />
            );
          })}
        </ChakraCarousel>
      )}
      {
        <ChakraCarousel gap={32} itemWidthInitial={200}>
          {documents?.map((article, i) => {
            return (
              <LinkPreviewCard
                ogTags={article.ogTags}
                article={article}
                url={article.url}
                isDesktop={isDesktop}
                key={`help-article-${i}`}
                size={"small"}
                title={article.title}
                removeConversation={removeConversation}
                controls={false}
                media={youtubeRegex.test(article.url) ? "video" : undefined}
                maxW={maxW}
              />
            );
          })}
        </ChakraCarousel>
      }
    </Box>
  );
}

export default LibraryLearnMoreSnippet;
