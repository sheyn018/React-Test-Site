import React, { useEffect } from "react";
import { Image } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";

function LibraryImageSnippet({ src }) {
  const [currSrc, setCurrSrc] = React.useState(src);
  const [loading, setLoading] = React.useState(true);
  const getTmpUrl = async () => {
    // get key from src
    const s3Key = src.split("https://libraria-prod-p.s3.us-east-1.amazonaws.com/")[1];
    if (s3Key) {
      const response = await fetch(`/api/generate-temporary-url?key=${s3Key}`);
      const { temporaryUrl } = await response.json();
      setCurrSrc(temporaryUrl);
    }
    setLoading(false);
  };

  useEffect(() => {
    getTmpUrl();
  }, [loading, currSrc]);

  if (loading) {
    return (
      <>
        <BeatLoader />
      </>
    );
  }

  return (
    <>
      <Image src={currSrc} />
    </>
  );
}

export default LibraryImageSnippet;
