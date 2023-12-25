import crypto from "crypto";

/**
 * The secret key used for authentication in the Node API.
 * @type {string}
 */
const SECRET = "YOUR-NODE-API-AUTH";

/**
 * Generates a random string using cryptographic random bytes.
 * @returns {string} A random string.
 */
export const random = () => crypto.randomBytes(128).toString("base64");

/**
 * Generates an authentication hash using the SHA256 algorithm.
 * @param {string} salt - The salt value used for hashing.
 * @param {string} password - The password to be hashed.
 * @returns The authentication hash as a hexadecimal string.
 */
export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac("sha256", [salt, password].join("/"))
    .update(SECRET)
    .digest("hex");
};

/**
 * Adds the specified number of days to a given date.
 * @param {number} days - The number of days to add.
 * @param {Date} [date=new Date()] - The date to which the days should be added. If not provided, the current date is used.
 * @returns {Date} - The new date after adding the specified number of days.
 */
export const addDays = (days: number, date = new Date()) => {
  date.setDate(date.getDate() + days);

  return date;
};
