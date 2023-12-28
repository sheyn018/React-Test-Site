import { getColorSchemeFromLibrary } from "@/utils/styleUtils";

export type LibraryStyle = {
  backgroundColor: string;
  color: string;
};

export type LibraryColorScheme = ReturnType<typeof getColorSchemeFromLibrary>;
