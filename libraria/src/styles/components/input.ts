import { mode, StyleFunctionProps, transparentize } from "@chakra-ui/theme-tools";

const baseStyle = (props: StyleFunctionProps) => ({
  field: {
    bg: mode("white", "gray.700")(props),
    borderColor: mode("gray.400", "gray.600")(props),
    borderRadius: "md",
    borderWidth: "1px",
    _hover: {
      bg: mode("gray.50", "gray.600")(props),
      borderColor: mode("gray.300", "gray.500")(props),
    },
    _disabled: {
      opacity: 0.4,
      cursor: "not-allowed",
    },
    _focus: {
      bg: mode("white", "gray.700")(props),
      borderColor: mode("gray.300", "gray.500")(props),
      boxShadow: `0 0 0 1px ${mode("blue.500", "blue.300")(props)}, 0 1px 1px ${transparentize(
        mode("blue.500", "blue.300")(props),
        0.08,
      )(props)}`,
    },
  },
});

const variants = {};

const sizes = {
  lg: {
    field: {
      fontSize: "md",
      borderRadius: "lg",
    },
  },
};

export default {
  variants,
  sizes,
  baseStyle,
};
