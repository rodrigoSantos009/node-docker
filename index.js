const express = require('express');
const moongose = require("mongoose");
const session = require("express-session");
const redis = require("redis");
let RedisStore = require("connect-redis").default;
const cors = require("cors");

const { MONGO_USER, MONGO_PASSWORD, MONGO_IP, MONGO_PORT, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

let redisClient = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`
});
redisClient.connect().catch(console.error)

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();

app.use(express.json());

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  moongose
    .connect(mongoURL)
    .then(() => {
      console.log("Succefully connected to DB");
    })
    .catch((e) => {
      console.log(e);
      setTimeout(connectWithRetry, 5000);
    });

  app.get("/api/v1", (req, res) => {
    res.send("<h2>Hello World!!! HOW ARE YOU?</h2>");
    console.log("yeah it ran");
  });
}

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

connectWithRetry();

app.enable("trust proxy");
app.use(cors({}));

app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000,
    },
  })
);

const port  = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listing on port ${port}`));