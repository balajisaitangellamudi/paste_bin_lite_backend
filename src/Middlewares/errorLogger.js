const { logEvents } = require("./logEvents");

const errorLogger = (err, req, res, next) => {
  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime();
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(3); // Convert to milliseconds

    // Adding the log in the req log
    logEvents(
      `${req.method}\t${req.originalUrl}\t${err.name}\t${err.message}`,
      "errLog.txt",
    );
  });

  // logEvents(`${err.name}: ${err.message}`, "errLog.txt");
  console.error(err.stack);
  next(err);
};

module.exports = errorLogger;
