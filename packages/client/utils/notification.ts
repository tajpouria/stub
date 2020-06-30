export const errorParser = ({ message }: { message: string | string[] }) => ({
  message: Array.isArray(message)
    ? message.join('\n')
    : message ?? 'Unknown exception!',
});
