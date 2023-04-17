export interface ChatMessage {
	id: string;
	role: string;
	handle: string;
	content: string;
	date: Date;
}

export interface Conversation {
	id: string;
	title?: string;
	prompt?: string;
	messages: ChatMessage[];
	unread: number;
	lastUpdated: Date;
}

export interface Image {
	url: string;
}

export interface ImageContainer {
	image: Image;
	prompt: string;
}

export interface ServerError {
	code: string;
	message: string;
}

export interface ValidationError {
	field: string;
	message: string;
}

export interface ChatApiRequest {
	messages: ChatMessage[];
	prompt?: string;
}

export interface ChatApiResponse {
	data?: ChatMessage;
	error?: ServerError;
	validationErrors?: ValidationError[];
}

export interface ImageGenerationApiRequest {
	prompt: string;
}

export interface ImageGenerationApiResponse {
	data?: Image;
	error?: ServerError;
	validationErrors?: ValidationError[];
}
