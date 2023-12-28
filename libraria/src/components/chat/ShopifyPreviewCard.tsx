import { Button, Card, CardBody, CardFooter, Image, Skeleton, Stack, Text } from "@chakra-ui/react";
import { CiShoppingCart } from "react-icons/ci";

export default function ShopifyPreviewCard({
  product,
  checkoutId,
  checkoutUrl,
  client,
  ...rest
}: any) {
  const addToCart = async () => {
    const lineItemsToAdd = [{ variantId: product.variantId, quantity: 1 }];
    const updatedCheckout = await client.checkout.addLineItems(checkoutId, lineItemsToAdd);
    window.open(updatedCheckout.webUrl, "_blank");
  };

  if (!product) {
    // Render skeleton while waiting for product data to load
    return (
      <Card maxW="sm" p={0}>
        <Skeleton height="200px" />
        <Stack mt="1" spacing="3" p="4">
          <Skeleton height="20px" width="80%" />
          <Skeleton height="16px" width="100%" />
          <Skeleton height="16px" width="60%" />
        </Stack>
      </Card>
    );
  }

  return (
    <Card maxW="sm" p={0}>
      <CardBody p={8}>
        <Image
          src={product.image}
          m="auto"
          fallback={<Skeleton height="200px" w="full" />}
          borderTopRadius="lg"
        />
        <Stack mt="1" spacing={3} px={4} py={2}>
          <Text fontSize="sm" fontWeight="bold">
            {product.title}
          </Text>
          <Text fontSize="sm">{product.description}</Text>
          <Text color="blue.600" fontSize="lg">
            {product.price} {product.currencyCode}
          </Text>
        </Stack>
      </CardBody>
      <CardFooter p={8} w="full">
        <Button
          rightIcon={<CiShoppingCart />}
          variant="solid"
          bg="black"
          color="white"
          _hover={{ bg: "gray" }}
          onClick={addToCart}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
