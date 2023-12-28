"use client";

import OracleView from "@/components/OracleView";
import { ChakraNestedProvider } from "@/components/core/ChakraNestedProvider";
import theme from "@/styles/theme";
import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useMeasure } from "react-use";

function Oracle({ isCompact, anonKey }: { isCompact?: boolean; anonKey: string }) {
  const [ref, { height }] = useMeasure();
  const [library, setLibrary] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
    // post message setHeight
    if (height && window) {
      window.parent.postMessage(
        {
          type: "setHeight",
          height: height + 200,
        },
        "*",
      );
    }
  }, [height]);

  if (!library || loading) {
    return <div></div>;
  }

  return (
    <Box id={"libraria-react"}>
      <ChakraNestedProvider theme={theme} cssVarsRoot={"#libraria-react"}>
        <Box ref={ref as any} overflowY="unset" padding="30px" mt={isCompact ? "0px" : "30px"}>
          <OracleView library={library} isCompact={isCompact} />
        </Box>
      </ChakraNestedProvider>
    </Box>
  );
}

export default Oracle;
