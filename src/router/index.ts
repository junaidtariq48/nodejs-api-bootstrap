import express from "express";
import authentication from "./authentication";
import users from "./users";

const router = express.Router();

/**
 * Initializes and configures the express router with authentication and user routes.
 * @returns {express.Router} - The configured express router.
 */
export default (): express.Router => {
  authentication(router);
  users(router);
  return router;
};
