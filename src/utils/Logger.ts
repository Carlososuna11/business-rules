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

	async debug(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.debug) return;
		await this.log({ ...options, level: 'debug' });
	}

	async error(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.error) return;
		await this.log({ ...options, level: 'error' });
	}

	async warn(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.warn) return;
		await this.log({ ...options, level: 'warn' });
	}

	async info(options: { message: string; rule?: string; error?: Error }) {
		if (!this.filter.info) return;
		await this.log({ ...options, level: 'info' });
	}

	private async log(options: { message: string; rule?: string; error?: Error; level: LoggerLevels }) {
		const out = this.delegate ? this.delegate : Logger.logDefault;
		await out(options);
	}

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
