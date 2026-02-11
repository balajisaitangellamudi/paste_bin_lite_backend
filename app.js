const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

// Utility Imports
const { testDatabaseConnection } = require("./src/Config/config");
const AppError = require("./src/Error/AppError");

// Middleware Imports
const { logger } = require("./src/Middlewares/logEvents");
const responseTimeLogger = require("./src/Middlewares/responseTimeLogger");
const credentials = require("./src/Middlewares/credentials");
const corsOptions = require("./src/Config/corsOptions");
const errorLogger = require("./src/Middlewares/errorLogger");
const globalErrorHandler = require("./src/Error/GlobalErrorHandler");

//Routers
const mainRouter = require("./src/Routers/mainRoutes");

//  MIDDLEWARE SETUP
app.use(logger); // Log requests
app.use(responseTimeLogger); // Response time logger
app.use(credentials); // Handle CORS credentials
app.use(cors(corsOptions)); // Apply CORS settings
app.use(express.json()); // Parse JSON requests

//  ROUTES SETUP
app.use("/", mainRouter);

// <-------------- ERROR HANDLING------------------->
// Handle unknown routes
app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on the server`, 404));
});

// Custom error log handler
app.use(errorLogger);

// Global error handler
app.use(globalErrorHandler);

//  SERVER START FUNCTION
async function startServer() {
  try {
    await testDatabaseConnection();

    const hostname = process.env.HOST || "127.0.0.1";
    const port = process.env.PORT || 3000;

    app.listen(port, hostname, () => {
      console.log(`Server running at http://${hostname}:${port}/`);
    });
  } catch (err) {
    console.error("Failed to start the server:", err.message);
  }
}

// Start the server
startServer();
