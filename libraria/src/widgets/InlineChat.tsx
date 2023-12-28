"use client";

import ClientChatView from "../components/ClientChatView";
import React, { useEffect } from "react";

function InlineChat({ anonKey }: { anonKey: string }) {
  const [library, setLibrary] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

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

  if (loading) {
    return <div></div>;
  }

  if (!library) {
    return <div>Could not find the library</div>;
  }

  return <ClientChatView library={library} />;
}

export default InlineChat;
