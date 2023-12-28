import { Image } from "@tiptap/extension-image";
import { NodeViewWrapper, ReactNodeViewRenderer } from "@tiptap/react";
import { useEffect, useState } from "react";

const CustomImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(CustomImageView);
  },
});

const CustomImageView = ({ node }) => {
  const [tempUrl, setTempUrl] = useState("");

  useEffect(() => {
    fetchTempUrl(node.attrs.src);
  }, [node.attrs.src]);

  async function fetchTempUrl(src) {
    const s3Url = "https://libraria-prod-p.s3.us-east-1.amazonaws.com/";
    if (src && src.startsWith(s3Url)) {
      const s3Key = src.split(s3Url)[1];
      if (s3Key) {
        const response = await fetch(`/api/generate-temporary-url?key=${s3Key}`);
        const result = await response.json();
        const { temporaryUrl } = result;
        setTempUrl(temporaryUrl);
      }
    }
  }

  return (
    <NodeViewWrapper>
      <img src={tempUrl || node.attrs.src} />
    </NodeViewWrapper>
  );
};

export default CustomImage;
