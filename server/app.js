const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const fileUpload = require("express-fileupload");

const authRouter = require("./routes/auth-route");
const userRouter = require("./routes/user-route");
const friendRequestRouter = require("./routes/friend-request-route");
const postRouter = require("./routes/post-route");
const commentRouter = require("./routes/comment-route");

require("./passport");

dotenv.config();

// set up server
const app = express();

const mongoDB = process.env.DEV_DB_URL;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(passport.initialize());
app.use(fileUpload());

app.use("/auth", authRouter);
app.use("/", userRouter);
app.use("/", friendRequestRouter);
app.use("/", postRouter);
app.use("/", commentRouter);
