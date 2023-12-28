import React, { useState } from "react";
import { Box, Link as ChakraLink, LinkProps } from "@chakra-ui/react";

export type CafeLinkProps = LinkProps & {
  nextLinkStyles?: any;
  innerRef?: any;
};

function CafeLink({
  href,
  children,
  nextLinkStyles,
  innerRef,
  ...rest
}: LinkProps & CafeLinkProps) {
  const [mounted, isMounted] = useState(false);

  React.useEffect(() => {
    isMounted(true);
  }, []);

  if (!href) return <Box>{children}</Box>;

  if (!mounted) {
    return (
      <Box style={nextLinkStyles} {...rest}>
        {children}
      </Box>
    );
  }

  if (href.startsWith("http") && rest.isExternal == null) {
    return (
      <ChakraLink href={href} ref={innerRef} target="_blank" isExternal {...rest}>
        {children}
      </ChakraLink>
    );
  }
  return (
    <ChakraLink
      href={href}
      style={nextLinkStyles}
      target={rest.isExternal === false ? undefined : "_blank"}
      isExternal
      {...rest}
      ref={innerRef}
    >
      {children}
    </ChakraLink>
  );
}

export default React.forwardRef((props: CafeLinkProps, innerRef: any) => (
  <CafeLink {...props} innerRef={innerRef as any} />
));
