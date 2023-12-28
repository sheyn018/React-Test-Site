import {
  Avatar,
  AvatarProps,
  Box,
  Flex,
  FlexProps,
  HStack,
  Stack,
  createStylesContext,
  useMultiStyleConfig,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface CardWithAvatarProps extends FlexProps {
  avatarProps: AvatarProps;
  action?: ReactNode;
  isCompact?: boolean;
  variant?: any;
  innerRef?: any;
  size?: any;
}

const [StylesProvider, useStyles] = createStylesContext("CardWithAvatar");

export function CardWithAvatarAvatar(props) {
  // 4. Read computed `item` styles from styles provider
  const styles = useStyles();
  if (props.isCompact) {
    return <></>;
  }
  return <Avatar {...styles.avatar} {...props} src={props.src ?? "/peep-1.svg"} />;
}

export function CardWithAvatarAction(props) {
  const styles = useStyles();
  return <Box {...(styles.action as any)}>{props.children}</Box>;
}

export function CardWithAvatarFooter({ children, ...rest }) {
  const styles = useStyles();
  return (
    <HStack {...(styles.footer as any)} {...rest}>
      {children}
    </HStack>
  );
}

export function CardWithAvatarBody(props) {
  const styles = useStyles();
  return <Box {...(styles.body as any)}>{props.children}</Box>;
}

export function CardWithAvatarItem(props) {
  const styles = useStyles();
  return <Box {...(styles.item as any)}>{props.children}</Box>;
}

export function CardWithAvatarItemStack(props) {
  const styles = useStyles();
  return <Stack {...(styles.itemStack as any)}>{props.children}</Stack>;
}

export const CardWithAvatar = (props: CardWithAvatarProps) => {
  const { action, avatarProps, children, isCompact, variant, size, innerRef, ...rest } = props;
  const styles = useMultiStyleConfig("CardWithAvatar", { variant });

  return (
    <Flex {...(styles.container as any)} {...rest} ref={innerRef}>
      <StylesProvider value={styles}>{children}</StylesProvider>
    </Flex>
  );
};
