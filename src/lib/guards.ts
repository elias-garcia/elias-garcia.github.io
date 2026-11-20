// Type guards for data a script reads back from the page's HTML.

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

// An object whose every listed key holds a string.
export function hasStrings<Key extends string>(
  value: unknown,
  keys: readonly Key[],
): value is Record<Key, string> {
  return isRecord(value) && keys.every((key) => typeof value[key] === "string");
}
