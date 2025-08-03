export function getImageUrl(imageUrl: string): string {
  if (!imageUrl) return "";

  let cleanUrl = imageUrl.replace(/^\/public\//, "/").replace(/^public\//, "/");

  if (!cleanUrl.startsWith("/")) {
    cleanUrl = "/" + cleanUrl;
  }

  return cleanUrl;
}
