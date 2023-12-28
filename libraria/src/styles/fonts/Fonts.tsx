import { Global, css } from "@emotion/react";
// import  calibreBold from './calibre/test-calibre-bold.woff2'

const fontList = [
  {
    family: "Calibre",
    weight: 700,
    sources: [
      {
        location:
          "https://libraria-public.s3.us-west-1.amazonaws.com/fonts/calibre/test-calibre-bold.woff2",
        format: "woff2",
      },
    ],
  },
  {
    family: "Calibre",
    weight: 400,
    sources: [
      {
        location:
          "https://libraria-public.s3.us-west-1.amazonaws.com/fonts/calibre/test-calibre-regular.woff2",
        format: "woff2",
      },
    ],
  },
  {
    family: "Calibre",
    weight: 500,
    sources: [
      {
        location:
          "https://libraria-public.s3.us-west-1.amazonaws.com/fonts/calibre/test-calibre-medium.woff2",
        format: "woff2",
      },
    ],
  },
  {
    family: "Calibre",
    weight: 300,
    sources: [
      {
        location:
          "https://libraria-public.s3.us-west-1.amazonaws.com/fonts/calibre/test-calibre-light.woff2",
        format: "woff2",
      },
    ],
  },
  {
    family: "Calibre",
    weight: 600,
    sources: [
      {
        location:
          "https://libraria-public.s3.us-west-1.amazonaws.com/fonts/calibre/test-calibre-semibold.woff2",
        format: "woff2",
      },
    ],
  },
  {
    family: "Calibre",
    weight: 200,
    sources: [
      {
        location:
          "https://libraria-public.s3.us-west-1.amazonaws.com/fonts/calibre/test-calibre-thin.woff2",
        format: "woff2",
      },
    ],
  },
  {
    family: "Calibre",
    weight: 900,
    sources: [
      {
        location:
          "https://libraria-public.s3.us-west-1.amazonaws.com/fonts/calibre/test-calibre-black.woff2",
        format: "woff2",
      },
    ],
  },
];

const sourceMap = ({ location, format }) => {
  return `url(${location}) format('${format}')`;
};

const sourcesStringFormatter = (sources) => sources.map(sourceMap).join(", ");

const fontStringFormatter = (font) => {
  const fontString = `
    @font-face {
      font-family: '${font.family}';
      font-weight: ${font.weight || "500"};
      font-display: swap;
      src: ${sourcesStringFormatter(font.sources)};
    }
  `;

  return fontString;
};

const styles = fontList.map(fontStringFormatter).join("\n");

const Fonts = () => (
  <Global
    styles={css`
      ${styles}
    `}
  />
);

export default Fonts;
