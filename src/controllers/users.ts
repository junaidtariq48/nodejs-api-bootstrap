import express from "express";

import { deleteUserById, getUserById, getUsers } from "../db/users";

/**
 * Retrieves all users from the database and returns them as a JSON response.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns A JSON response containing all users.
 */
export const getAllUsers = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const users = await getUsers();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

/**
 * Deletes a user with the specified ID.
 * @param {express.Request} req - The request object.
 * @param {express.Response} res - The response object.
 * @returns {Promise<void>} - A promise that resolves when the user is deleted.
 * @throws {Error} - If there is an error deleting the user.
 */
export const deleteUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;

    const deleteUser = await deleteUserById(id);

    return res.json(deleteUser);
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

/**
 * Updates a user's username based on the provided request parameters and body.
 * @param {express.Request} req - The request object containing the user's ID and new username.
 * @param {express.Response} res - The response object to send the updated user data.
 * @returns None
 * @throws {Error} If there is an error updating the user's username.
 */
export const updateUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    if (!username) {
      return res.sendStatus(400);
    }

    const user = await getUserById(id);

    user.username = username;
    await user.save();

    return res.status(200).json(user).end();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};
