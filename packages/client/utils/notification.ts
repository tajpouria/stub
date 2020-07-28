export const errorParser = (
  { message }: { message: string | string[] } = {
    message: 'Unknown exception!',
  },
  description = '',
) => ({
  message: Array.isArray(message) ? message.join('\n') : message,
  description,
});
