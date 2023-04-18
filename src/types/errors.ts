export interface ServerError {
	code: string;
	message: string;
}

export interface ValidationError {
	field: string;
	message: string;
}
