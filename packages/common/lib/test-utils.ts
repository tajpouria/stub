import { JwtPayload } from './session';
import { sign } from 'jsonwebtoken';

/**
 * Produce object props in gql format
 * @param props
 */
export const produceObjectVariable = (props: Record<string, any>) =>
  JSON.stringify(props).replace(/\"([^(\")"]+)\":/g, '$1:');

export enum HttpMessage {
  UNAUTHORIZED = 'Unauthorized',
  BAD_REQUEST = 'Bad Request Exception',
  NOT_FOUND = 'Not Found',
}

/**
 * Retrieve generate Cookie function can be used to create application wide valid cookie
 * @param sessionName
 * @param jwtSecret
 */
export const cookieGeneratorFactory = (
  sessionName: string,
  jwtSecret: string,
) => (payload: JwtPayload = { iat: 123, sub: 'abc123', username: 'abc' }) => {
  const stringifiedSessionObj = JSON.stringify({
    session: sign(payload, jwtSecret),
  });

  return [
    `${sessionName}=${Buffer.from(stringifiedSessionObj).toString(
      'base64',
    )}; path=/; httponly`,
  ];
};
