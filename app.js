import express from "express";
import morgan from "morgan";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

import accountRouter from "./routes/accountRoutes.js";
import postRouter from "./routes/postRoutes.js";

import cors from "cors";
import authMiddlware from "./middlewares/authMiddlware.js";

const app = express();

//Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.json()); // parsing

// Routes
app.get("/", (req, res, next) => res.send("Secure Social API is running 🚀"));
app.use("/api", accountRouter);
app.use("/api/posts",authMiddlware, postRouter);

// Not Found Middlewares
app.use(notFound);

// Centralized error handling
app.use(errorHandler);
export default app;
