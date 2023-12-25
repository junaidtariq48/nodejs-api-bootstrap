import { createUser, getUserByEmail } from "../db/users";
import express from "express";
import { addDays, authentication, random } from "../helpers";
var geoip = require("geoip-lite");

/**
 * Handles the login functionality by validating the user's email and password,
 * generating a session token, and setting a cookie with the session token.
 * @param {express.Request} req - The request object containing the user's email and password.
 * @param {express.Response} res - The response object to send the result of the login process.
 * @returns response
 */
export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.sendStatus(400);
    }

    const user = await getUserByEmail(email).select(
      "+authentication.salt +authentication.password"
    );
    if (!user) {
      return res.sendStatus(400);
    }

    const expectedHash = authentication(user.authentication.salt, password);

    if (user.authentication.password != expectedHash) {
      return res.sendStatus(403);
    }

    /**
     * Sets the session expiry date for the user's authentication.
     * @param {number} days - The number of days to add to the current date.
     */
    user.authentication.sessionExpiry = addDays(2);

    const salt = random();
    user.authentication.sessionToken = authentication(
      salt,
      user._id.toString()
    );

    await user.save();

    res.cookie("JUNAID-AUTH", user.authentication.sessionToken, {
      domain: "localhost",
      path: "/",
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

/**
 * Registers a new user with the provided email, password, and username.
 * @param {express.Request} req - The request object containing the user's information.
 * @param {express.Response} res - The response object to send back to the client.
 * @returns response
 * @throws {Error} If there is an error during the registration process.
 */
export const register = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return res.sendStatus(400);
    }

    var geo = geoip.lookup(req.ip);
    var ip = req.ip;
    var browser = req.headers["user-agent"];
    var language = req.headers["accept-language"];

    const salt = random();
    const user = await createUser({
      email,
      username,
      meta: {
        ip,
        geo,
        browser,
        language,
      },
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
