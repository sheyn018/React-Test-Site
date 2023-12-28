import { Box, Image, Text, Flex, VStack, LinkBox, LinkOverlay } from "@chakra-ui/react";

function GooglePlaceCard({ placeData }) {
  return (
    <Flex
      boxShadow="rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px"
      justifyContent="space-between"
      flexDirection="column"
      overflow="hidden"
      rounded={5}
      color="black"
      flex={1}
    >
      <LinkBox mb={6}>
        <VStack>
          {placeData.photo && <Image src={placeData.photo} alt={placeData.name} />}
          <Box p="2">
            <Box display="flex" alignItems="baseline">
              <Text fontWeight="semibold" textTransform="uppercase" fontSize="sm" color="teal.600">
                {placeData.types?.[0]}
              </Text>
            </Box>
            <Text mt="2" fontWeight="bold">
              {placeData.name}
            </Text>
            <Text mt="2" fontSize="sm">
              {placeData.formatted_address}
            </Text>
            <LinkOverlay
              fontSize="sm"
              fontWeight="bold"
              color="blue.500"
              href={`https://www.google.com/maps/dir/?api=1&destination=${placeData.geometry.location.lat},${placeData.geometry.location.lng}`}
              mt="2"
              isExternal
            >
              Get directions
            </LinkOverlay>
          </Box>
        </VStack>
      </LinkBox>
    </Flex>
  );
}

export default GooglePlaceCard;
