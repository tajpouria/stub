export interface SessionObj {
  session?: string;
  isChanged: boolean;
  isNew: boolean;
  isPopulated: boolean;
}

export interface JwtPayload {
  username: string;
  sub: string;
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      session: SessionObj;
    }
  }
}
