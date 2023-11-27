const express = require("express");
const mongoose = require("mongoose");

const session = require("express-session");
const redis = require("redis");
const RedisStore = require("connect-redis").default;

const {
  MONGO_USER,
  MONGO_PASSWORD,
  MONGO_IP,
  MONGO_PORT,
  REDIS_URL,
  REDIS_PORT,
  SESSION_SECRET,
} = require("./config/config");

const redisClient = redis.createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});

// let redisClient = redis.createClient({
//   host: REDIS_URL,
//   port: REDIS_PORT,
// });

const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes");

const app = express();
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

const connectWithRetry = () => {
  mongoose
    .connect(mongoURL, {
      // usenewUrlParser: true,
      // useUnifiedTopology: true,
    })
    .then(() => console.log("Successfully connected to database "))
    .catch((err) => {
      console.log(
        `MongoDB connection unsuccessful, retry after 5 seconds. ${err}`
      );
      setTimeout(connectWithRetry, 5000);
    });
};
connectWithRetry();

redisClient.connect().catch(console.error);

app.use(express.json());

// app.use(
//   session({
//     store: new RedisStore({
//       client: redisClient,
//     }),
//     secret: SESSION_SECRET,
//     cookie: {
//       secure: false,
//       resave: false,
//       saveUninitialized: false,
//       httpOnly: true,
//       maxAge: 30000,
//     },
//   })
// );

app.use(
  session({
    proxy: true,
    store: new RedisStore({ client: redisClient }),
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 30000, // in ms
    },
  })
);

app.get("/api/v1", (req, res) => {
  res.send("<h2>Hi there!!</h2>");
});

app.use("/api/v1/posts", postRouter);
app.use("/api/v1/users", userRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listing on port :${port}`));
