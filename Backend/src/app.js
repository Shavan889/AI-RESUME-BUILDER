const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

/*require all the routes here*/
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");

const app = express();

const allowedOriginRegex = /^https:\/\/ai-resume-builder-[a-z0-9-]+\.vercel\.app$/;

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOriginRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
/*using all the routes here*/
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

module.exports = app;
