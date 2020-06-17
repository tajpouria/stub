import { promisify } from 'util';
import { readFile } from 'fs';
import { render } from 'mustache';

const readFilePromise = promisify(readFile);

const TEMPS_DIR = `${process.cwd()}/src/shared/mail-template`;

export const enTempProvider = async (view: {
  forSignUp: boolean;
  confirm_link: string;
  hours_to_expire: number | string;
  host: string;
}) =>
  render(
    await readFilePromise(`${TEMPS_DIR}/en-confirm.html`, {
      encoding: 'utf-8',
    }),
    view,
  );
