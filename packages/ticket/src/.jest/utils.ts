import { JwtPayload, SessionObj } from 'src/interfaces/session';
import { sign } from 'jsonwebtoken';

export enum HttpMessage {
  UNAUTHORIZED = 'Unauthorized',
  BAD_REQUEST = 'Bad Request Exception',
}

export const generateCookie = (
  payload: JwtPayload = { iat: 123, sub: 'abc123', username: 'abc' },
) => {
  const { JWT_SECRET, SESSION_NAME } = process.env;

  const stringifiedSessionObj = JSON.stringify({
    session: sign(payload, JWT_SECRET),
  });

  return [
    `${SESSION_NAME}=${Buffer.from(stringifiedSessionObj).toString(
      'base64',
    )}; path=/; httponly`,
  ];
};
