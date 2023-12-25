import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from "./router";

const app = express();

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

/**
 * Starts the server and listens on port 8080.
 * @param {function} callback - A callback function to be executed when the server starts listening.
 * @returns None
 */
server.listen(8080, () => {
  console.log("Server running on http://localhost:8080/");
});

const MONGO_URL = "mongodb://localhost:27017";

mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);

/**
 * Event listener for the "error" event emitted by the Mongoose connection.
 * @param {Error} error - The error object emitted by the connection.
 * @returns None
 */
mongoose.connection.on("error", (error: Error) => {
  console.log(error);
});

/**
 * Mounts the router middleware on the root path ("/") of the application.
 * @param {string} "/" - The root path of the application.
 * @param {Router} router - The router middleware to be mounted.
 * @returns None
 */
app.use("/", router());
