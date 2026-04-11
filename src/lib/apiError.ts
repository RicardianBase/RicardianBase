export function extractApiErrorMessage(
  error: unknown,
  fallback = "Something went wrong. Try again.",
): string {
  const message = (error as { response?: { data?: { message?: string | string[] } } })?.response
    ?.data?.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message) && typeof message[0] === "string" && message[0].trim()) {
    return message[0];
  }

  return fallback;
}
