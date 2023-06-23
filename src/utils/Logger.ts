import { LoggerLevels, LoggerMethods, LoggerOptions } from '../types';

/**
 * Class representing a Logger instance
 */
export default class Logger {
	/**
	 * Object representing the filter options for the logger instance
	 * @property {boolean} error - Whether to log errors or not
	 * @property {boolean} debug - Whether to log debug messages or not
	 * @property {boolean} warn - Whether to log warning messages or not
	 * @property {boolean} info - Whether to log info messages or not
	 */
	private filter: { error: boolean; debug: boolean; warn: boolean; info: boolean } = {
		error: true,
		debug: false,
		warn: true,
		info: true,
	};

	/**
	 * Function that will be called in case of logging
	 */
	private delegate?: CallableFunction;

	/**
	 * Object representing the default logging levels and their corresponding methods
	 * @property {Function} debug - The console.log method
	 * @property {Function} error - The console.error method
	 * @property {Function} warn - The console.warn method
	 * @property {Function} info - The console.info method
	 */
	public static levels: LoggerMethods = {
		debug: console.log,
		error: console.error,
		warn: console.warn,
		info: console.info,
	};

	/**
	 * Create a logger instance
	 * @param {LoggerOptions} options - Logger options object
	 * @param {Object} options.filter - Object representing the filter options for the logger instance
	 * @param {boolean} options.filter.error - Whether to log errors or not
	 * @param {boolean} options.filter.debug - Whether to log debug messages or not
	 * @param {boolean} options.filter.warn - Whether to log warning messages or not
	 * @param {boolean} options.filter.info - Whether to log info messages or not
	 * @param {CallableFunction} options.delegate - Function that will be called in case of logging
	 */
	constructor(options: LoggerOptions) {
		this.filter = options.filter || this.filter;
		this.delegate = options.delegate;
	}

	/**
	 * Log a debug message
	 * @param {Object} options - Debug message options object
	 * @param {string} options.message - Debug message string
	 * @param {string} options.rule - Optional rule string
	 * @param {Error} options.error - Optional error object
	 */
	async debug(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.debug) return;
		await this.log({ ...options, level: 'debug' });
	}

	/**
	 * Log an error message
	 * @param {Object} options - Error message options object
	 * @param {string} options.message - Error message string
	 * @param {string} options.rule - Optional rule string
	 * @param {Error} options.error - Optional error object
	 */
	async error(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.error) return;
		await this.log({ ...options, level: 'error' });
	}

	/**
	 * Log a warning message
	 * @param {Object} options - Warning message options object
	 * @param {string} options.message - Warning message string
	 * @param {string} options.rule - Optional rule string
	 * @param {Error} options.error - Optional error object
	 */
	async warn(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.warn) return;
		await this.log({ ...options, level: 'warn' });
	}

	/**
	 * Log an info message
	 * @param {Object} options - Info message options object
	 * @param {string} options.message - Info message string
	 * @param {string} options.rule - Optional rule string
	 * @param {Error} options.error - Optional error object
	 */
	async info(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.info) return;
		await this.log({ ...options, level: 'info' });
	}

	/**
	 * Log a message
	 * @param {Object} options - Message options object
	 * @param {string} options.message - Message string
	 * @param {string} options.rule - Optional rule string
	 * @param {Error} options.error - Optional error object
	 * @param {string} options.level - Logging level
	 */
	private async log(options: { message: string; rule?: string; error?: Error; level: LoggerLevels }) {
		const out = this.delegate ? this.delegate : Logger.logDefault;
		await out(options);
	}

	/**
	 * Default logging method
	 * @param {Object} options - Logging options object
	 * @param {string} options.message - Logging message string
	 * @param {string} options.rule - Optional rule string
	 * @param {Error} options.error - Optional error object
	 * @param {string} options.level - Logging level
	 */
	private static async logDefault({
		message,
		rule,
		error,
		level,
	}: {
		message: string;
		rule?: string;
		error?: Error;
		level: LoggerLevels;
	}) {
		const msg = rule ? `# ${message} - "${rule}"` : `# ${message}`;
		const err = error ? `\n${error.stack}` : '';
		const method = Logger.levels[level];
		await method(`${msg}${err}`);
	}
}
