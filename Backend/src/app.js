const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

/*require all the routes here*/
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

const app = express();

const allowedOrigins = [
  "https://ai-resume-builder-cmmgjzwuh-shavans-projects.vercel.app",
  "https://ai-resume-builder-jade-seven.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
/*using all the routes here*/
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
