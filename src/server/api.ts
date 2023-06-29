import {
	Configuration,
	ChatCompletionRequestMessage,
	ChatCompletionRequestMessageRoleEnum,
	CreateChatCompletionResponse,
	ImagesResponse,
	OpenAIApi,
} from 'openai';
import { ChatMessage, Image } from '../types';

export function getOpenAIClient() {
	return new OpenAIApi(new Configuration({
		apiKey: process.env.OPENAI_KEY,
	}));
}

// The API always returns a 'choices' array of messages. Return the first (and usually only)
// choice formatted as a ChatMessage.
export function getMessageFromChatResponse(response: CreateChatCompletionResponse): ChatMessage | undefined {
	if (response.choices && response.choices.length > 0) {
		const message = response.choices[0].message;
		if (message) {
			return {
				role: message.role,
				content: message.content,
			};
		}
	}
}

export function getImageFromImageResponse(response: ImagesResponse): Image | undefined {
	if (response.data && response.data.length) {
		const url = response.data[0].url;
		if (url) {
			return { url };
		}
	}
}

// Filter the given ChatMessage list for valid roles, and then format
// them as OpenAI ChatCompletionRequestMessage objects.
export function getChatCompletionRequestMessages(messages: ChatMessage[]): ChatCompletionRequestMessage[] {
	return messages.filter(message => {
		if (message.role && (message.role === 'user' || message.role === 'assistant') && message.content) {
			return true;
		}

		return false;
	}).map(message => {
		return {
			role: message.role === 'user' ? ChatCompletionRequestMessageRoleEnum.User : ChatCompletionRequestMessageRoleEnum.Assistant,
			content: message.content,
		};
	});
}
