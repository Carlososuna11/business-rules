import { LoggerLevels, LoggerMethods, LoggerOptions } from '../types';

export default class Logger {
	private filter: { error: boolean; debug: boolean; warn: boolean; info: boolean } = {
		error: true,
		debug: false,
		warn: true,
		info: true,
	};
	private delegate?: CallableFunction;
	public static levels: LoggerMethods = {
		debug: console.log,
		error: console.error,
		warn: console.warn,
		info: console.info,
	};

	constructor(options: LoggerOptions) {
		this.filter = options.filter || this.filter;
		this.delegate = options.delegate;
	}

	debug(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.debug) return;
		this.log({ ...options, level: 'debug' });
	}

	error(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.error) return;
		this.log({ ...options, level: 'error' });
	}

	warn(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.warn) return;
		this.log({ ...options, level: 'warn' });
	}

	info(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.info) return;
		this.log({ ...options, level: 'info' });
	}

	private log(options: { message: string; rule?: string; error?: Error; level: LoggerLevels }) {
		const out = this.delegate ? this.delegate : Logger.logDefault;
		out(options);
	}

	private static logDefault({
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
		method(`${msg}${err}`);
	}
}
