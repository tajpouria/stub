import { Mailer } from '@tajpouria/stub-common/dist/mailer';
import { Logger } from '@tajpouria/stub-common/dist/logger';

const { MAILER } = process.env;

export const mailer = Mailer(
  JSON.parse(MAILER),
  Logger(`${process.cwd()}/logs/mailer`),
);
