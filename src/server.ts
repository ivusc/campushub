import express from "express";
import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import authRouter from "./routes/auth.js"
import postRouter from "./routes/posts.js"
import indexRouter from "./routes/index.js"
import MongoStore from "connect-mongo";
import session from "express-session";
import flash from "connect-flash";
import { globals, requireAuth } from "./middleware/middleware.js";
// import { savePost, saveUser } from "./scripts/tests.js";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/campushub";

//SESSIONS
const sessionOptions = {
  name: 'campushub_session',
  secret: process.env.SESSION_SECRET || 'secretkey12345',
  resave: false,
  saveUninitialized: false,
  //@ts-ignore
  store: MongoStore.default.create({
    mongoUrl: MONGODB_URI,
    ttl: 14 * 24 * 7 * 60 * 60, //14 days
    autoRemove: 'native', //Automatically removes expired sessions,
    collectionName: 'sessions'
  }),
  cookie: {
    secure: false,
    sameSite: "lax" as "lax",
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}

if (app.get("env") == "production"){
  console.log('In Production')
  app.set("trust proxy", 1);
  //@ts-ignore
  sessionOptions.cookie.secure = true;
}

//MIDDLEWARE
app.use(flash());
app.use(session(sessionOptions));
app.use(globals);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));



//ROUTES
app.use('/', authRouter);
app.use('/', postRouter);
app.use('/', indexRouter);

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ Connected to MongoDB."))
  .catch((err) => console.log("Connection error:", err));

// mongoose.connection.once('open', async() => {
//   await saveUser();
//   await savePost();
// })

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
