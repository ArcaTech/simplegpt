import axios, { AxiosResponse } from 'axios';
import {
	Image,
	ChatMessage,
	ChatRequest,
	ChatResponse,
	ImageGenerationRequest,
	ImageGenerationResponse,
} from '../../types';

export class ServerError extends Error {
	constructor(message: string) {
		super(message);
	}
}

export class OpenAIApiError extends ServerError {
	constructor() {
		super('OpenAPI: API error');
	}
}

export class OpenAINoResponseError extends ServerError {
	constructor() {
		super('OpenAPI: No response');
	}
}

export async function doChat(messages: ChatMessage[], prompt?: string): Promise<ChatMessage> {
	// Note: The extensive types here aren't really necessary. I just felt like being explicit.
	const response = await axios.post<ChatResponse, AxiosResponse<ChatResponse, ChatRequest>, ChatRequest>('/chat', {
		messages,
		prompt,
	});

	if (response.data.data) return response.data.data;
	if (response.data.error) {
		if (response.data.error.code === 'openai-api') {
			throw new OpenAIApiError();
		}

		if (response.data.error.code === 'openai-no-response') {
			throw new OpenAINoResponseError();
		}
	}

	throw new ServerError('Unknown error');
}

export async function doImageGeneration(prompt: string): Promise<Image> {
	// Note: The extensive types here aren't really necessary. I just felt like being explicit.
	const response = await axios.post<ImageGenerationResponse, AxiosResponse<ImageGenerationResponse, ImageGenerationRequest>, ImageGenerationRequest>('/image', {
		prompt,
	});

	if (response.data.data) return response.data.data;
	if (response.data.error) {
		if (response.data.error.code === 'openai-api') {
			throw new OpenAIApiError();
		}

		if (response.data.error.code === 'openai-no-response') {
			throw new OpenAINoResponseError();
		}
	}

	throw new ServerError('Unknown error');
}

export async function doStream(messages: ChatMessage[], prompt?: string) {
	return await fetch('http://localhost:3000/chat-stream', {
		method: 'POST',
		cache: 'no-cache',
		keepalive: true,
		headers: {
			'Content-Type': 'application/json',
			'Accept': 'text/event-stream',
		},
		body: JSON.stringify({ messages, prompt }),
	});
}
