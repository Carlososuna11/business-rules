class Delegator<T extends (...args: unknown[]) => unknown> {
	private to: T | null;

	constructor() {
		this.to = null;
	}

	public delegate(...args: Parameters<T>): ReturnType<T> | unknown {
		return this.to ? this.to(...args) : undefined;
	}

	public set(to: T) {
		this.to = to;
	}

	public unset() {
		this.to = null;
	}

	public static getSegmentName(segment: unknown): unknown {
		return typeof segment === 'string' ? segment.toString() : segment;
	}
}

export default Delegator;
