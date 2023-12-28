import { LANGUAGE_CODE_TO_LANGUAGE_NAME } from "./languages";

export function translateSuggestedQuestions(greetings, lng, defaultSuggestions) {
  const suggestions = (greetings
    ?.find((g) => LANGUAGE_CODE_TO_LANGUAGE_NAME[g.language ?? ""] === lng)
    ?.assistantQuerySuggestions?.filter(
      (x) => !!x && x.trim() !== "" && x !== null && x !== undefined,
    ) || []) as string[];

  if (suggestions.length > 0) {
    return suggestions.filter((x) => !!x && x.trim() !== "" && x !== null && x !== undefined);
  }
  return defaultSuggestions;
}
