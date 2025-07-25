import pino from "pino";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  serializers: {
    err: (err) => ({
      type: err.constructor.name,
      message: err.message,
      stack: err.stack,
    }),
  },
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true,
      translateTime: "yyyy-mm-dd HH:MM:ss",
      ignore: "pid,hostname", 
      
    },
  },
});

export default logger;
