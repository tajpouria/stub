export const errorParser = (
  { message }: { message: string | string[] },
  description = '',
) => ({
  message: Array.isArray(message)
    ? message.join('\n')
    : message ?? 'Unknown exception!',
  description,
});
