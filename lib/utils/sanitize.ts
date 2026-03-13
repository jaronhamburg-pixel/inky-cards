/**
 * Sanitise user-provided text by removing potentially dangerous HTML.
 * Strips <script> tags and on* event handler attributes.
 */
export function sanitizeText(input: string): string {
  let text = input;
  // Remove script tags and their contents
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  // Remove on* event handlers (onclick, onerror, etc.)
  text = text.replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '');
  // Remove remaining script-related tags
  text = text.replace(/<\/?script[^>]*>/gi, '');
  // Remove javascript: URLs
  text = text.replace(/javascript\s*:/gi, '');
  return text.trim();
}

/**
 * Recursively sanitise all string values in an object.
 */
export function sanitizeObject<T>(obj: T): T {
  if (typeof obj === 'string') return sanitizeText(obj) as T;
  if (Array.isArray(obj)) return obj.map(sanitizeObject) as T;
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeObject(value);
    }
    return result as T;
  }
  return obj;
}
