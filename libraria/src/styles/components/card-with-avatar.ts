import { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const parts = [
  "container",
  "avatar",
  "body",
  "item",
  "itemStack",
  "header",
  "action",
  "footer",
  "divider",
];

const baseStyle = (props: StyleFunctionProps) => ({
  container: {
    position: "relative",
    direction: "column",
    maxW: "2xl",
    rounded: {
      sm: "lg",
    },
    shadow: {
      base: "base",
    },
    align: {
      sm: "center",
    },
    bg: mode("white", "gray.700")(props),
    px: { base: "6", md: "8" },
    p: 0,
  },
  action: {
    mt: {
      base: -15,
      sm: 4,
    },
    mb: {
      base: 15,
      sm: 4,
    },
    fontWeight: "bold",
    as: "h1",
    lineHeight: "tight",
    textAlign: "center",
  },
  item: {
    px: { base: "6", md: "8" },
  },
  itemStack: {
    px: { base: "6", md: "8" },
  },
  avatar: {
    mt: "-10",
    borderWidth: "6px",
    borderColor: mode("white", "gray.700")(props),
    size: "2xl",
    bg: "white",
    color: "white",
  },
  footer: {
    px: { base: "6", md: "8" },
  },
});

const variants = {
  assistant: (props: StyleFunctionProps) => ({
    container: {
      w: "full",
      color: "default",
    },
    body: {
      w: "fill-available",
      textAlign: "left",
    },
    footer: {
      pt: props.isCompact ? 0 : 12,
      justifyContent: "space-between",
      w: "full",
      alignItems: "center",
      pb: 8,
      mt: 2,
      px: { base: "6", md: "8" },
    },
  }),
  search: () => ({
    container: {
      boxShadow: "none",
      w: "full",
      pb: 4,
      pt: 2,
    },
    item: {
      w: "full",
      p: 0,
    },
    body: {
      w: "full",
      p: 0,
    },
    itemStack: {
      spacing: 8,
      borderRadius: "lg",
      w: "unset",
      ml: "10px",
      mr: "2px",
    },
    footer: {
      justifyContent: "space-between",
      w: "full",
      alignItems: "center",
      p: 0,
      mt: 2,
    },
  }),
};

export default {
  variants,
  baseStyle,
  parts,
};
