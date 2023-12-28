import { KnowledgeDocument } from "@/types";
import { Badge } from "@chakra-ui/react";
import React from "react";

function LibrarySourceDocumentCompactSnippet({
  documents,
}: {
  documents: Partial<KnowledgeDocument>[];
}) {
  return (
    <>
      {documents.map((document) => {
        return <Badge key={document.id}>{document.title}</Badge>;
      })}
    </>
  );
}

export default LibrarySourceDocumentCompactSnippet;
