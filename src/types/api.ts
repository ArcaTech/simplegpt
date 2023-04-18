import { ServerError, ValidationError } from './errors';

export interface ChatMessage {
	role: string;
	content: string;
}

export interface Image {
	url: string;
}

export interface ImageContainer {
	id: string;
	image: Image;
	prompt: string;
}

export interface ChatRequest {
	messages: ChatMessage[];
	prompt?: string;
}

export interface ChatResponse {
	data?: ChatMessage;
	error?: ServerError;
	validationErrors?: ValidationError[];
}

export interface ImageGenerationRequest {
	prompt: string;
}

export interface ImageGenerationResponse {
	data?: Image;
	error?: ServerError;
	validationErrors?: ValidationError[];
}
