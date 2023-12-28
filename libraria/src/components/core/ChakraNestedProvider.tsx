import { CSSReset, PortalManager, ThemeProvider } from "@chakra-ui/react";
import { EnvironmentProvider } from "@chakra-ui/react-env";
import { useId } from "@chakra-ui/hooks";
import { theme as defaultTheme } from "@chakra-ui/react";

export const ChakraNestedProvider = (props) => {
  const {
    children,
    portalZIndex,
    resetCSS = false, // I don't think resetCSS is needed in a nested provider
    theme = defaultTheme,
    environment,
    cssVarsRoot,
  } = props;
  const id = useId();
  const _children = <EnvironmentProvider environment={environment}>{children}</EnvironmentProvider>;

  return (
    <ThemeProvider theme={theme} cssVarsRoot={cssVarsRoot}>
      {resetCSS && <CSSReset />}
      {portalZIndex ? <PortalManager zIndex={portalZIndex}>{_children}</PortalManager> : _children}
    </ThemeProvider>
  );
};
