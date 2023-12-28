## Description

`@libraria/react` is a comprehensive React component library to integrate powerful ChatGPT and [Libraria AI](https://libraria.ai) on any surface you want. From search, to chatbots and oracles, with customizable styling and configurations, `@libraria/react` has got you covered.

## Installation

```bash
npm install @libraria/react
```

or

```bash
yarn add @libraria/react
```

## Prerequisites

- An `anonKey` on [libraria.ai](https://libraria.ai). You can follow the docs on [docs.libraria.ai](https://docs.libraria.ai/components/getting-started)

## Features

- 🤖 **LibrariaChatbot**: A full-featured chatbot interface.
- 💬 **LibrariaInlineChat**: Minimalist inline chat functionality.
- 🧙 **LibrariaOracle**: Answering component with an optional compact mode.
- 🔍 **LibrariaSearch**: A search bar powered by ChatGPT & Libraria AI.
- 🎨 Customizable styles for components.
- 🗝️ Pass in your `anonKey` to identify which library to use

## Usage

### LibrariaChatbot

```jsx
import { LibrariaChatbot } from "@libraria/react";

function MyApp() {
  return (
    <LibrariaChatbot
      anonKey="YOUR_ANON_KEY_HERE"
      placement="bottom-right"
      style={{
        fontFamily: "Roboto",
        fontColor: "black",
        // ... other styles
      }}
    />
  );
}
```

### LibrariaInlineChat

```jsx
import { LibrariaInlineChat } from "@libraria/react";

function MyApp() {
  return <LibrariaInlineChat anonKey="YOUR_ANON_KEY_HERE" />;
}
```

### LibrariaOracle

```jsx
import { LibrariaOracle } from "@libraria/react";

function MyApp() {
  return <LibrariaOracle anonKey="YOUR_ANON_KEY_HERE" isCompact={true} />;
}
```

### LibrariaSearch

```jsx
import { LibrariaSearch } from "@libraria/react";

function MyApp() {
  return (
    <LibrariaSearch
      anonKey="YOUR_ANON_KEY_HERE"
      isDarkMode={true}
      style={{
        fontFamily: "Roboto",
        fontColor: "white",
        // ... other styles
      }}
    />
  );
}
```

## Props

### Common Prop for All Components

#### `anonKey` (required)

- Type: `string`
- Description: Your anonymous key for authentication with the AI services.

### LibrariaChatbot Props

#### `placement`

- Type: `string`
- Default: `'bottom-right'`
- Description: Placement of the chatbot on the screen. Available options: `'top-left'`, `'top-right'`, `'bottom-left'`, `'bottom-right'`.

### LibrariaOracle Props

#### `isCompact`

- Type: `boolean`
- Default: `false`
- Description: Display the Oracle component in a compact mode.

### LibrariaSearch Props

#### `keepStateOnClose`

- Type: `boolean`
- Default: `false`
- Description: Option to keep the search state even after closing the component.

#### `isDarkMode`

- Type: `boolean`
- Default: `false`
- Description: Enable or disable dark mode.

#### `style`

- Type: `StyleOverrideProps`
- Description: Override the default styles for the search component in light mode.

#### `darkModeStyle`

- Type: `StyleOverrideProps`
- Description: Override the default styles for the search component in dark mode.

#### `StyleOverrideProps`

An object to customize the styles. Available properties:

- `fontFamily`: Font family of the search input.
- `fontColor`: Font color of the search input.
- `fontSize`: Font size of the search input.
- `iconColor`: Color of the search icon.
- `borderColor`: Border color of the search input.
- `hoverColor`: Border color of the search input on hover.
- `backgroundColor`: Background color of the search input.
- `inputBorderRadius`: Border radius of the search input.
- `borderRadius`: Border radius of the search component.
- `inputBackgroundColor`: Background color of the search input.
