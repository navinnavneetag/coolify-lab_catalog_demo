import express from "express";
import cors from "cors";
import middleware from "./utils/middleware.js";
import { dataRouter } from "./routes/data.route.js";
import { authRouter } from "./routes/auth.route.js";
import config from "./utils/config.js";

const app = express();

const cors_options = {
  origin: config.ALLOWED_ORIGINS?.split(","),
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
};

app.use(cors(cors_options));

app.use(express.json());

app.use(middleware.firstMiddleware);

app.get("/test", (req, res) => {
  res.send("Route is working");
});
app.use("/data", dataRouter);
app.use("/auth", authRouter);

app.use(middleware.errorHandlerMiddleware);

export { app };
