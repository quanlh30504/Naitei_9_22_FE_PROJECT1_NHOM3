import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getValidImageUrl(imageUrl: string): string {
  if (!imageUrl) return '';
  
  // Remove public prefix if it exists (both "/public" and "public")
  let cleanUrl = imageUrl.replace(/^\/public\//, '/').replace(/^public\//, '/');
  
  // Ensure the URL starts with /
  if (!cleanUrl.startsWith('/')) {
    cleanUrl = '/' + cleanUrl;
  }
  
  return cleanUrl;
}
