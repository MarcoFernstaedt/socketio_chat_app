import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ENV } from "./lib/env";
import path from "path";
import router from "./routes";
import connectDB from "./lib/db";
import { errorHandler } from "./middleware/error";

const app = express();
const PORT = ENV.PORT || 3000;
const ROOT = process.cwd(); // project root

app.use(express.json({limit: '5mb'}));
app.use(cookieParser());
app.use(errorHandler);
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

// static (prod)
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.resolve(ROOT, "frontend/dist")));
}

app.use("/api", router);

(async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`Server on port: ${PORT}`));
})();
