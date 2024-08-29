import winston from 'winston';
import _ from 'lodash';

const { format } = winston;
const transports = [];

const timestamp = format.splat();
const consoleFormat = format.combine(format.colorize({ all: true }), timestamp, format.simple(), format.ms());
transports.push(new winston.transports.Console(_.extend({ format: consoleFormat })));

export const Logger = winston.createLogger({
    level: 'debug',
    format: format.json(),
    transports,
});
