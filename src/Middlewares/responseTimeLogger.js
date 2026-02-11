const responseTimeLogger = (req, res, next) => {
  const start = process.hrtime(); // Start the timer

  res.on("finish", () => {
    const [seconds, nanoseconds] = process.hrtime(start);
    const durationInMs = (seconds * 1000 + nanoseconds / 1e6).toFixed(3); // Convert to milliseconds
    console.log(`Request to ${req.method} ${req.url} took ${durationInMs}ms`);
  });

  next(); // Pass control to the next middleware/route handler
};

module.exports = responseTimeLogger;
