require("dotenv").config();
const express = require("express");
// const authRoutes = require("./routes/authRoute");
const videoRoutes = require("./routes/videoRoute");
const themeRoutes = require("./routes/themeRoute");
const userRoutes = require("./routes/userRoute");
const { connection } = require("./config/postgressDB");
const globalErrorMiddleware = require("./middleware/ErrorMiddleware");
const ApiError = require("./utils/ApiError");
const cors = require("cors");

const app = express();
app.use(express.json());

connection();

// cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    optionsSuccessStatus: 200,

    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);


app.get('/', (req, res) => {
  res.json({
    status: "success",
    action: "Server is running",
    message: "Hello, world",
  });
});
// routes



app.use("/api/videos", videoRoutes);
app.use("/api/themes", themeRoutes);
app.use("/api/users", userRoutes);

// Error Api
app.use("*", (req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl} on this server`, 404));
});

// global error handling midleware
app.use(globalErrorMiddleware);

// run listen
app.listen(process.env.PORT || 3000, () => {
  console.log("listening on port 3000");
});

// Handle rejection outside express
process.on("unhandledRejection", (err) => {
  console.log(`unhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.log("Shutting down...");
    process.exit(1);
  });
});
