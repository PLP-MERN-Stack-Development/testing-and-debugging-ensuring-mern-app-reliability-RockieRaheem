// Request Logger Middleware - Log all HTTP requests

const morgan = require("morgan");
const logger = require("../utils/logger");

// Create stream object for morgan
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Skip logging during tests
const skip = () => {
  return process.env.NODE_ENV === "test";
};

// Custom token for response time
morgan.token("response-time-ms", (req, res) => {
  if (!req._startTime) return "0";
  const diff = process.hrtime(req._startTime);
  return (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
});

// Custom format
const format = ":method :url :status :response-time ms - :res[content-length]";

// Create morgan middleware
const requestLogger = morgan(format, { stream, skip });

/**
 * Custom middleware to add start time
 */
const addStartTime = (req, res, next) => {
  req._startTime = process.hrtime();
  next();
};

/**
 * Performance monitoring middleware
 */
const performanceMonitor = (req, res, next) => {
  const start = Date.now();

  // Listen for response finish
  res.on("finish", () => {
    const duration = Date.now() - start;

    // Log slow requests (> 1 second)
    if (duration > 1000) {
      logger.warn(
        `Slow request detected: ${req.method} ${req.originalUrl} - ${duration}ms`,
        {
          method: req.method,
          url: req.originalUrl,
          duration,
          user: req.user ? req.user._id : "unauthenticated",
        }
      );
    }
  });

  next();
};

module.exports = {
  requestLogger,
  addStartTime,
  performanceMonitor,
};
