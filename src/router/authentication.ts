import express from "express";

import { login, register } from "../controllers/authentication";

/**
 * Sets up the routes for user authentication.
 * @param {express.Router} router - The Express router object.
 * @returns None
 */
export default (router: express.Router) => {
  /**
   * Route handler for the POST /auth/register endpoint.
   * Registers a new user with the provided credentials.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns None
   */
  router.post("/auth/register", register);

  /**
   * Route handler for the POST /auth/login endpoint.
   * @param {Request} req - The request object.
   * @param {Response} res - The response object.
   * @returns None
   */
  router.post("/auth/login", login);
};
