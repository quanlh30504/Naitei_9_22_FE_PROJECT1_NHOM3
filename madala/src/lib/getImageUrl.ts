export function getImageUrl(src: string): string {
  if (!src) return "/api/images/placeholder.jpg"; 

  let cleaned = src.replace(/^\/public\/|^public\//, "");
  
  if (cleaned.startsWith("/")) {
    cleaned = cleaned.substring(1);
  }
  
  return `/api/images/${cleaned}`;
}
