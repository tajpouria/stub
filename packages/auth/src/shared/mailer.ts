import { Mailer } from '@tajpouria/stub-common/dist/mailer';
import { Logger } from '@tajpouria/stub-common/dist/logger';

const { MAILER, NODE_ENV } = process.env;

export const mailer = Mailer(
  JSON.parse(MAILER),
  NODE_ENV !== 'test' ? Logger(`${process.cwd()}/logs/mailer`) : null,
);
