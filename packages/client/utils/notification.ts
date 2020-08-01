/**
 * Parse REST response error(s) for notification
 * @param param0
 * @param description
 */
export const errorParser = (
  { message }: { message: string | string[] } = {
    message: 'Unknown exception!',
  },
  description = '',
) => ({
  message: Array.isArray(message) ? message.join('\n') : message,
  description,
});

/**
 * Parse GraphQL response errors for notification
 * @param errors GraphQL errors list
 * @param description
 */
export const gqlErrorParser = (
  errors: { message: string }[] = [{ message: 'Unknown exception!' }],
  description = '',
) => ({
  message: errors[0]?.message,
  description,
});
