export class Logger {
	public static log(message?: any, ...optionalParams: any[]): void {
		console.log(message, optionalParams);
	}
	public static error(message?: any, ...optionalParams: any[]): void {
		console.error(message, optionalParams);
	}
}
