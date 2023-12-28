import { extendTheme } from "@chakra-ui/react";
import * as components from "../components";
import * as foundations from "../foundations";

const theme = extendTheme({
  styles: {
    ...foundations,
    global: {
      body: {
        fontFamily: "Calibre",
      },
    },
  },
  components: {
    CardWithAvatar: components.CardWithAvatar,
    Heading: components.Heading,
    Input: components.Input,
  },
});

export default theme;
