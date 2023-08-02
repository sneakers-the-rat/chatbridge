const fs = require('fs')
const path = require('path')
import config from "config";
// import { Logger, format, createLogger, transports } from 'winston';
const winston = require('winston');
let Logger = winston.Logger
let format = winston.format
let createLogger = winston.createLogger
let transports = winston.transports

const logDir = config.get<string>('logDir')

const makeLogdir = () => {
  if (!fs.existsSync(logDir)){
    fs.mkdir(logDir, (err:Error|undefined) => {
      if (err) throw err;
    })
  }
}

const makeLogger = (): typeof Logger => {
  makeLogdir()

  const logger = createLogger({
    levels: winston.config.syslog.levels,
    level: process.env.NODE_ENV === 'development' ? 'debug' : 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    transports: [
      new transports.File({
        filename: path.join(logDir, 'chatbridge.error.log'),
        level: 'error'
      }),
      new transports.File({
        filename: path.join(logDir, 'chatbridge.debug.log'),
        level: 'debug'
      }),
      ...(process.env.NODE_ENV === 'development' ? [
        new transports.Console({
          level: 'debug',
          format: format.combine(
            format.colorize(),
            format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            format.simple(),
            format.splat()
          )
        })
      ]: [])

    ]
  })
  return(logger)
}

const logger = makeLogger()
export default logger
