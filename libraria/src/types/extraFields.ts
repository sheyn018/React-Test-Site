import { KnowledgeDocument, KnowledgeLibraryTag } from ".";

type CtaLink = {
  text?: string;
  url?: string;
};

type CtaSnippet = {
  cta: string;
  url: string;
  content: any;
};

export type DocumentExtraFields = {
  images?: string[];
  ctaSnippet?: CtaSnippet;
  learnMoreLink?: CtaLink;
  pdf?: {
    info: any;
    page: number;
    numpages: number;
  };
  ogTags?: {
    "og:url"?: string;
    "og:title"?: string;
    "og:description"?: string;
    "og:image"?: string;
    "og:image:width"?: string;
    "og:image:height"?: string;
    "og:image:secure_url"?: string;
    "og:site_name"?: string;
    "og:type"?: string;
    "og:locale"?: string;
  };
  youtube?: {
    videoId?: string;
    startTime: number;
    title?: string;
    summary?: string;
    opening?: string;
    keywords?: string;
    channelTitle?: string;
    description?: string;
    thumbnailUrl?: string;
    videoDescriptionLinks?: { link_value: string; href: string }[];
  };
};

export type QueryExtraFields = {
  documents: Partial<
    KnowledgeDocument & {
      tags?: Partial<KnowledgeLibraryTag>[];
    }
  >[];
  images?: string[];
  ctaSnippet?: CtaSnippet[];
  learnMoreLinks?: CtaLink[];
  helpArticles?: {
    title: string;
    url: string;
  }[];
  error?: {
    message: string;
  };
  snippet?: {
    image: string;
  }; // deprecate
  returnDirectly?: boolean;
  maps?: any;
  shopify?: {
    storefrontAccessToken: string;
    cart?: {
      checkoutUrl: string;
      id: string;
    };
    products?: {
      currencyCode: string;
      description: string;
      id: string;
      image: string;
      maxPrice: string;
      minPrice: string;
      price: string;
      title: string;
      variantId: string;
      variantTitle: string;
    }[];
    product?: {
      currencyCode: string;
      description: string;
      id: string;
      image: string;
      maxPrice: string;
      minPrice: string;
      price: string;
      title: string;
      variantId: string;
      variantTitle: string;
    };
  };
};

export type AssistantStyles = {
  color: string;
  backgroundColor: string;
  primaryColor: string;
  textColor: string;
  fontFamily: string;
};

export type WhatsappIntegrationExtraFields = {
  whatsappAccount: string;
  whatsappToken: string;
};

export type InstagramIntegrationExtraFields = {
  instagramPageId: string;
  instagramToken: string;
};
