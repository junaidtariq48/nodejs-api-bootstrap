import { isAdmin, isAuthenticated, isOwner } from "../middleware";
import { deleteUser, getAllUsers, updateUser } from "../controllers/users";
import express from "express";

/**
 * Configures the routes for user-related operations on the given express router.
 * @param {express.Router} router - The express router to configure the routes on.
 * @returns None
 */
export default (router: express.Router) => {
  /**
   * Route handler for retrieving all users.
   * @route GET /users
   * @access Private
   * @middleware isAuthenticated - Middleware function to check if user is authenticated.
   * @handler getAllUsers - Handler function to retrieve all users.
   */
  router.get("/users", isAuthenticated, isAdmin, getAllUsers);

  /**
   * Deletes a user with the specified ID.
   * @param {string} "/users/:id" - The route path for deleting a user.
   * @param {Function} isAuthenticated - Middleware function to check if the user is authenticated.
   * @param {Function} isOwner - Middleware function to check if the user is the owner of the account.
   * @param {Function} deleteUser - Controller function to delete the user.
   * @returns None
   */
  router.delete("/users/:id", isAuthenticated, isOwner, deleteUser);

  /**
   * PATCH route handler for updating a user's information.
   * @param {string} "/users/:id" - The route path for updating a user.
   * @param {Function} isAuthenticated - Middleware function to check if user is authenticated.
   * @param {Function} isOwner - Middleware function to check if user is the owner of the resource.
   * @param {Function} updateUser - Controller function to handle updating user information.
   * @returns None
   */
  router.patch("/users/:id", isAuthenticated, isOwner, updateUser);
};
