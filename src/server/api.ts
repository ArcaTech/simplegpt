import OpenAI from 'openai';
import { ChatMessage, Image } from '../types';

export function getOpenAIClient(): OpenAI {
	return new OpenAI({
		apiKey: process.env.OPENAI_KEY,
	});
}

// The API always returns a 'choices' array of messages. Return the first (and usually only)
// choice formatted as a ChatMessage.
export function getMessageFromChatCompletion(chatCompletion: OpenAI.Chat.ChatCompletion): ChatMessage | undefined {
	if (chatCompletion.choices && chatCompletion.choices.length > 0) {
		const message = chatCompletion.choices[0].message;
		if (message) {
			return {
				role: message.role,
				content: message.content,
			};
		}
	}
}

export function getImageFromImageResponse(response: OpenAI.Images.ImagesResponse): Image | undefined {
	if (response.data && response.data.length) {
		const url = response.data[0].url;
		if (url) {
			return { url };
		}
	}
}

// Filter the given ChatMessage list for valid roles, and then format
// them as OpenAI ChatCompletionRequestMessage objects.
export function getChatCompletionRequestMessages(messages: ChatMessage[]): OpenAI.Chat.ChatCompletionMessageParam[] {
	return messages.filter(message => {
		if (message.role && (message.role === 'user' || message.role === 'assistant') && message.content) {
			return true;
		}

		return false;
	}).map(message => {
		return {
			role: message.role,
			content: message.content,
		};
	});
}
