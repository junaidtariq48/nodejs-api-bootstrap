import mongoose from "mongoose";

export enum Role {
  ADMIN = "ADMIN",
  USER = "USER",
}
/**
 * Defines the schema for the User collection in the MongoDB database.
 * @param {Object} UserSchema - The schema definition for the User collection.
 * @property {string} username - The username of the user. Required field.
 * @property {string} email - The email of the user. Required field.
 * @property {Object} authentication - The authentication details of the user.
 * @property {string} authentication.password - The password of the user. Required field. Not selected by default.
 * @property {string} authentication.salt - The salt used for password hashing. Not selected by default.
 * @property {string} authentication.sessionToken - The session token of the user. Not selected by default.
 */
const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    authentication: {
      password: { type: String, required: true, select: false },
      salt: { type: String, select: false },
      sessionToken: { type: String, select: false },
    },
    meta: {
      ip: { type: String, select: false },
      geo: { type: String, select: false },
      browser: { type: String, select: false },
      language: { type: String, select: false },
    },
    role: {
      type: String,
      enum: Role,
      default: Role.USER,
    },
  },
  { timestamps: true }
);

/**
 * Represents a user model in the MongoDB database.
 * @class UserModel
 */
export const UserModel = mongoose.model("User", UserSchema);

/**
 * Retrieves all users from the database.
 * @returns {Promise<UserModel[]>} - A promise that resolves to an array of user models.
 */
export const getUsers = () => UserModel.find();

/**
 * Retrieves a user from the database based on their email address.
 * @param {string} email - The email address of the user.
 * @returns A promise that resolves to the user object if found, or null if not found.
 */
export const getUserByEmail = (email: string) => UserModel.findOne({ email });

/**
 * Retrieves a user from the database based on the provided session token.
 * @param {string} sessionToken - The session token of the user.
 * @returns {Promise<UserModel>} A promise that resolves to the user object if found, or null if not found.
 */
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({
    "authentication.sessionToken": sessionToken,
  });

/**
 * Retrieves a user from the database by their ID.
 * @param {string} id - The ID of the user to retrieve.
 * @returns {Promise<UserModel>} A promise that resolves to the user object.
 */
export const getUserById = (id: string) => UserModel.findById(id);

/**
 * Creates a new user with the given values and saves it to the database.
 * @param {Record<string, any>} values - The values to create the user with.
 * @returns {Promise<object>} A promise that resolves to the created user object.
 */
export const createUser = (values: Record<string, any>) =>
  new UserModel(values).save().then((user) => user.toObject());

/**
 * Deletes a user from the database by their ID.
 * @param {string} id - The ID of the user to delete.
 * @returns A promise that resolves to the deleted user.
 */
export const deleteUserById = (id: string) =>
  UserModel.findOneAndDelete({ _id: id });

/**
 * Update a user in the database by their ID.
 * @param {string} id - The ID of the user to update.
 * @param {Record<string, any>} values - The updated values for the user.
 * @returns {Promise<UserModel | null>} A promise that resolves to the updated user object, or null if no user was found with the given ID.
 */
export const updateUserById = (id: string, values: Record<string, any>) =>
  UserModel.findByIdAndUpdate(id, values);
