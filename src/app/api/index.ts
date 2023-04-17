import axios, { AxiosResponse } from 'axios';
import {
	Image,
	ChatMessage,
	ChatApiRequest,
	ChatApiResponse,
	ImageGenerationApiRequest,
	ImageGenerationApiResponse,
} from '../../shared/types';

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
	const response = await axios.post<ChatApiResponse, AxiosResponse<ChatApiResponse, ChatApiRequest>, ChatApiRequest>('/chat', {
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
	const response = await axios.post<ImageGenerationApiResponse, AxiosResponse<ImageGenerationApiResponse, ImageGenerationApiRequest>, ImageGenerationApiRequest>('/chat', {
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
