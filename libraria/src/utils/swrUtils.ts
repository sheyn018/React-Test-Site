export const swrFetcher = async (url: string, params?: any) => {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${url}?${query}`);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
