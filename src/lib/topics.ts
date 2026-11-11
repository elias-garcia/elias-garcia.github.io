export function topicSlug(topic: string): string {
  return topic.trim().toLowerCase().replace(/\s+/g, "-");
}
