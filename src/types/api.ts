import { ServerError, ValidationError } from './errors';

export interface ImageUpload {
	name: string;
	url: string;
}

export interface ChatImage {
	url: string;
	detail?: 'auto' | 'low' | 'high';
}

export interface ChatMessage {
	role: 'user' | 'assistant';
	content: string | null;
	images: ChatImage[];
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
	systemMessage?: string;
	model?: string;
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

export interface ModelsResponse {
	models: string[];
}

export interface ImageUploadConfig {
	enabled: boolean;
}

export interface ImageUploadResponse {
	data?: ImageUpload;
	error?: ServerError;
}
