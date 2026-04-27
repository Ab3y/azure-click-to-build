/**
 * Convert a string to camelCase with only alphanumeric characters.
 */
export function sanitizeName(name: string): string {
  const words = name
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .split(/[\s_-]+/)
    .filter(Boolean);

  if (words.length === 0) return 'resource';

  return words
    .map((word, index) => {
      const lower = word.toLowerCase();
      if (index === 0) return lower;
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join('');
}

/**
 * Convert a string to snake_case.
 */
export function toSnakeCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase();
}

/**
 * Convert a string to kebab-case (suitable for Azure resource names).
 */
export function toKebabCase(name: string): string {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
}

/**
 * Generate a resource name with prefix and type.
 * Example: generateResourceName('myapp', 'storage-account') => 'myapp-storage-account'
 */
export function generateResourceName(prefix: string, type: string): string {
  const cleanPrefix = toKebabCase(prefix);
  const cleanType = toKebabCase(type);
  return `${cleanPrefix}-${cleanType}`;
}
