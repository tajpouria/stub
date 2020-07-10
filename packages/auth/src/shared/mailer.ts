import { Mailer, Logger } from '@tajpouria/stub-common';

const { MAILER, NODE_ENV } = process.env;

export const mailer = Mailer(
  JSON.parse(MAILER),
  NODE_ENV !== 'test' ? Logger(`${process.cwd()}/logs/mailer`) : null,
);
