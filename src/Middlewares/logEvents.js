const { format } = require("date-fns");
const { v4: uuid } = require("uuid");

const fs = require("fs");
const fsPromises = require("fs").promises;
const path = require("path");

const logEvents = async (message, logName) => {
  const dateTime = `${format(new Date(), "dd-MM-yyy\tHH:mm:ss")}`;
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }

    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logName),
      logItem,
    );
  } catch (err) {
    console.log(err);
  }
};

const logger = (req, res, next) => {
  // response time logger
  const start = process.hrtime(); // Start the timer

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime();
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(3); // Convert to milliseconds

    // console.log(
    //   `Request to ${req.method} ${req.originalUrl} took ${durationInMs}ms`
    // );

    // Adding the log in the req log
    logEvents(
      `${req.method}\t${req.headers["user-agent"]}\t${req.originalUrl}\t${durationInMs}`,
      "reqLog.txt",
    );
  });

  next();
};

module.exports = { logger, logEvents };
