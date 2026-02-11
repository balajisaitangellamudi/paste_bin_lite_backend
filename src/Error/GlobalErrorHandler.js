const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    message: err.isOperational ? err.message : "Internal server error",
  });
};

module.exports = globalErrorHandler;
