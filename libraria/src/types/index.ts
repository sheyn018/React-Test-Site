import { BoxProps, InputProps, IconProps } from "@chakra-ui/react";

export type TiptapNode = {
  type: string;
  [key: string]: any;
};

export type LibraryResponse = any;
export type KnowledgeLibrary = any;
export type KnowledgeDocument = any;
export type KnowledgeLibraryTag = any;
export type OrganizationResponse = any;
export type GptQuery = any;
export enum CtaPosition {
  "in_chat" = "in_chat",
}

export enum DocumentSourceType {
  "pdf" = "pdf",
  "scrape_url" = "scrape_url",
}

export enum AssistantPrivacy {
  "public" = "public",
  "unlisted" = "unlisted",
}

export type SearchStyleProps = {
  fontFamily?: BoxProps["fontFamily"];
  fontColor?: BoxProps["color"];
  fontSize?: BoxProps["fontSize"];
  iconColor?: IconProps["color"];
  borderColor?: BoxProps["borderColor"];
  hoverColor?: BoxProps["borderColor"];
  aiResponseFontColor?: BoxProps["color"];
  aiResponseBackgroundColor?: BoxProps["backgroundColor"];
  inputBorderRadius?: InputProps["borderRadius"];
  borderRadius?: BoxProps["borderRadius"];
  inputBackgroundColor?: InputProps["backgroundColor"];
  containerBackgroundColor?: BoxProps["backgroundColor"];
};
