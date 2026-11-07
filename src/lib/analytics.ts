export function track(
  event: string,
  properties?: Record<string, string | number | boolean>,
): void {
  void event;
  void properties; /* Optional opt-in analytics intentionally defaults to no-op. */
}
