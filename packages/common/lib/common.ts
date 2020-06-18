/**
 * Check if target contains all specified items
 * @param target
 * @param items
 * @param message
 */
export function objectContainsAll(
  target: Record<string, any>,
  items: string[],
  message = "Does not exists",
) {
  const result: string[] = [];
  items.forEach((env) => {
    target[env] ?? result.push(env);
  });
  if (result.length) throw new Error(`${result.join(", ")} ${message}`);
}
