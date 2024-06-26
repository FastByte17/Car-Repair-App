import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import auth from "./routes/auth.js";
import user from "./routes/user.js";
import task from "./routes/task.js";
import column from "./routes/column.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { protect } from "./controller/auth.js";

const app = express();
const port = process.env.PORT || 3000;
dotenv.config();
app.use(express.static("uploads"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", auth);
app.use("/api/v1", protect);
app.use("/api/v1/user", user);
app.use("/api/v1/task", task);
app.use("/api/v1/column", column);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
