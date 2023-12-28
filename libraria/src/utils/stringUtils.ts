export const modifiedParseJSON = (jsonString, fallback?) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    if (fallback) {
      return fallback;
    }
    return jsonString;
  }
};

export const countWords = (text: string) => {
  return text.split(/\s+/).length;
};

/*
 * Split text into chunks of n words
 * @param {string} text
 * @param {number} chunkSize
 * @returns {string[]}
 */
export function splitTextIntoChunks(text: string, chunkSize = 500) {
  const regex = new RegExp(`\\b(?:\\w+\\W+){0,${chunkSize - 2}}\\w+\\b(?:\\W+\\w+\\b)?`, "g");
  const chunks = text.trim().match(regex) || [];

  return chunks.filter((x) => x.length);
}

export function splitTextIntoNCharacters(text: string, n = 500) {
  // handle new lines
  const regex = new RegExp(`(.|[\r\n]){1,${n}}`, "g");
  const chunks = text.trim().match(regex) || [];

  return chunks.filter((x) => x.length);
}
