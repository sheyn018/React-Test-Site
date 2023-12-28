export const removeHttpUrl = (url) => url.replace(/(^\w+:|^)\/\//, "");

export const removeXmlAndHttpUrl = (url) => url.replace(/(^\w+:|^)\/\//, "").replace(/\.xml$/, "");

export const getRoute = (route, subdomain, librarySlug?) => {
  if (subdomain && librarySlug) return `/team/${subdomain}/library/${librarySlug}${route}`;
  if (subdomain) return `/team/${subdomain}${route}`;
  return route;
};

export const formatSlug = (slug) => {
  // remove all characters except letters, numbers, and dashes
  const pattern = /[^a-zA-Z0-9-]/g;
  slug = slug.replace(pattern, "");

  // convert the string to lowercase
  slug = slug.toLowerCase();

  // Substring to 20
  slug = slug.substring(0, 20);

  return slug;
};

export const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const pdfUrlWithPage = (url, pageNumber) => {
  let googleFileId;
  if (url.includes("drive.google.com")) {
    const pattern = /\/d\/([a-zA-Z0-9-_]+)/;

    // Search the URL for the pattern and extract the Google ID
    const match = url.match(pattern);
    if (match) {
      googleFileId = match[1];
    }
  }

  return url.includes("drive.google.com")
    ? `https://drive.google.com/uc?export=view&id=${googleFileId}#page=${pageNumber}`
    : `${url}#page=${pageNumber}`;
};

export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
