import { SessionObj } from '@tajpouria/stub-common';

declare global {
  namespace Express {
    interface Request {
      session: SessionObj;
    }
  }
}
