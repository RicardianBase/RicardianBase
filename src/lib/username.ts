export const USERNAME_MIN_LENGTH = 3;
export const USERNAME_MAX_LENGTH = 30;
const USERNAME_PATTERN = /^[A-Za-z0-9_-]+$/;

export function normalizeUsername(value: string): string {
  return value.trim().replace(/^@/, "").toLowerCase();
}

export function validateUsername(value: string): string | null {
  if (value.length < USERNAME_MIN_LENGTH) {
    return "Username must be at least 3 characters";
  }

  if (value.length > USERNAME_MAX_LENGTH) {
    return "Username cannot exceed 30 characters";
  }

  if (!USERNAME_PATTERN.test(value)) {
    return "Only letters, numbers, hyphens, and underscores";
  }

  return null;
}

export function isResolvableUsername(value: string): boolean {
  return validateUsername(normalizeUsername(value)) === null;
}
