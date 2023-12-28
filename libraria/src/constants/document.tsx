import { KnowledgeDocument, DocumentSourceType } from "@/types";
import { pdfUrlWithPage } from "@/utils/urlUtils";
import { Image } from "@chakra-ui/react";
import { BsFiletypePdf } from "react-icons/bs";

export const SOURCE_TYPE_DETAILS = (document: Partial<KnowledgeDocument>) => {
  const { title, url, sourceUrl, extraFields } = document;
  let finalUrl = url ?? sourceUrl ?? undefined;
  let finalTitle = title ?? url ?? sourceUrl ?? "Untitled";
  if (document.sourceType === DocumentSourceType.pdf) {
    const pdf = extraFields?.["pdf"];
    if (finalUrl && pdf) {
      finalUrl = pdfUrlWithPage(finalUrl, pdf.page);
    }

    if (pdf && pdf.page) {
      finalTitle = finalTitle + `- Page ${pdf.page}`;
    }
    return {
      icon: BsFiletypePdf,
      color: "red",
      url: document.url,
      title: finalTitle,
    };
  } else if (document.sourceType === DocumentSourceType.scrape_url) {
    if (finalUrl?.includes("docs.google.com/document/d")) {
      return {
        icon: (
          <Image src="/logo/google-docs-logo.svg" alt="google-docs-logo" boxSize="1.5rem" />
        ) as any,
        color: "black",
        url: document.url,
        title: finalTitle,
      };
    }
  } else {
    return null;
  }
};
