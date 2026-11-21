// A content template with its `{name}` placeholders filled in. A function
// replacement, so a `$` in a value isn't read as a pattern.
export function fill(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (placeholder, name: string) => {
    return values[name] ?? placeholder;
  });
}
