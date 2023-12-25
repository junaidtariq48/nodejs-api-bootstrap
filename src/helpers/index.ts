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
