export interface SessionObj {
  session?: string;
  updateUserSession?: string;
  isChanged: boolean;
  isNew: boolean;
  isPopulated: boolean;
}

export interface JwtPayload {
  username: string;
  sub: string;
  iat: number;
  token?: string;
}

declare global {
  namespace Express {
    interface Request {
      session: SessionObj;
    }
  }
}
