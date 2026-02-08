/**
 * Input sanitization utilities to prevent XSS and injection attacks.
 */

/**
 * Strip HTML tags from a string (basic XSS prevention).
 */
export function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * Escape HTML special characters to prevent XSS in rendered output.
 */
export function escapeHtml(input: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };
  return input.replace(/[&<>"'/]/g, (char) => map[char] || char);
}

/**
 * Sanitize user input — trim whitespace and remove dangerous characters.
 * Use for text fields that should not contain HTML.
 */
export function sanitizeText(input: string): string {
  return stripHtml(input.trim());
}

/**
 * Sanitize a slug for URL usage — only allow lowercase letters, numbers, and hyphens.
 */
export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Validate and sanitize a UUID string.
 */
export function isValidUuid(input: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    input,
  );
}
