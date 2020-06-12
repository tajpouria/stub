import { randomBytes, scrypt } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export class Cipher {
  /**
   * Hash given target
   * @param target
   * @param options.separator Prepend slat after hash and separator
   * @param options.saltLen
   */
  static async hash(target: string, { separator = ".", saltLen = 8 }) {
    try {
      const salt = randomBytes(saltLen).toString("hex");

      const buffer = await Cipher._scryptAsync(target, salt);

      return `${buffer.toString("hex")}${separator}${salt}`;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * Compare target and supplied
   * @param target
   * @param supplied String to compare with target
   * @param options.separator Prepend slat after hash and separator
   */
  static async compare(target: string, supplied: string, { separator = "." }) {
    try {
      const [hash, salt] = target.split(separator);

      const buffer = await Cipher._scryptAsync(supplied, salt);

      return buffer.toString("hex") === hash;
    } catch (error) {
      throw new Error(error);
    }
  }

  /**
   * @private
   */
  static async _scryptAsync(target: string, salt: string) {
    return (await scryptAsync(target, salt, 64)) as Buffer;
  }
}
