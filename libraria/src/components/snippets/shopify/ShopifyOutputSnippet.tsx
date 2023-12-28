import React from "react";
import { Text } from "@chakra-ui/react";

function ShopifyOutput({ shopifyOutput }: { shopifyOutput: any }) {
  return (
    <>
      <Text pt="2" fontSize="sm">
        <Text as={"pre"} whiteSpace="pre-wrap">
          {JSON.stringify(
            shopifyOutput,
            (key, value) => {
              if (
                key.includes("http") ||
                ["id", "orders", "email", "line_items", "customer", "name"].includes(key)
              ) {
                return value;
              }
              return undefined;
            },
            2,
          )}
        </Text>
      </Text>
    </>
  );
}

export default ShopifyOutput;
