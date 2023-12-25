import express from "express";
import { get, merge } from "lodash";

import { Role, getUserBySessionToken } from "../db/users";

/**
 * Checks if the current user is an admin.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next function to call.
 */
export const isAdmin = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const currentUserRole = get(req, "identity.role") as string;

    if (!currentUserRole) {
      return res.sendStatus(403);
    }

    if (currentUserRole !== Role.ADMIN) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

/**
 * Middleware function to check if the current user is the owner of a resource.
 * @param {express.Request} req - The Express request object.
 * @param {express.Response} res - The Express response object.
 * @param {express.NextFunction} next - The next middleware function.
 * @throws {Error} If there is an error while checking ownership.
 */
export const isOwner = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const { id } = req.params;
    const currentUserId = get(req, "identity._id") as string;

    if (!currentUserId) {
      return res.sendStatus(403);
    }
    if (currentUserId.toString() !== id) {
      return res.sendStatus(403);
    }

    next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

/**
 * Middleware function to check if a user is authenticated.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @param {express.NextFunction} next - The next function to call.
 * @throws {Error} If there is an error while checking authentication.
 */
export const isAuthenticated = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const sessionToken = req.cookies["JUNAID-AUTH"];

    if (!sessionToken) {
      return res.sendStatus(403);
    }

    const existingUser = await getUserBySessionToken(sessionToken).select(
      "+authentication.sessionExpiry"
    );

    if (!existingUser) {
      return res.sendStatus(403);
    }

    if (!existingUser.authentication.sessionExpiry) {
      return res.sendStatus(403);
    }

    const date = new Date();
    const expiryDate = existingUser.authentication.sessionExpiry;

    if (date > expiryDate) {
      return res.sendStatus(403);
    }

    merge(req, { identity: existingUser });

    return next();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};
