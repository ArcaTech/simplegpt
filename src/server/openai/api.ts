import OpenAI from 'openai';
import { ChatMessage, Image } from '../../types';

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
				images: [],
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
// them as OpenAI ChatCompletionMessageParam objects.
export function getChatCompletionRequestMessages(messages: ChatMessage[]): OpenAI.Chat.ChatCompletionMessageParam[] {
	return messages.filter(message => {
		if (message.role && (message.role === 'user' || message.role === 'assistant') && message.content) {
			return true;
		}

		return false;
	}).map(message => {
		// If the message contains images (for the GPT4-Vision model),
		// add each one as an 'image_url' content part, and then add the
		// text message as a 'text' content part, and then use that array
		// as the content
		if (message.images && message.images.length) {
			const parts: OpenAI.Chat.ChatCompletionContentPart[] = message.images.map(image => {
				return {
					type: 'image_url',
					image_url: {
						url: image.url,
						detail: image.detail,
					},
				};
			});

			parts.push({
				type: 'text',
				text: message.content ?? '',
			});

			return {
				role: message.role,
				content: parts,
			} as OpenAI.Chat.ChatCompletionMessageParam;
		}

		// If the message doesn't contain any images, use the message
		// text itself as the content
		return {
			role: message.role,
			content: message.content,
		} as OpenAI.Chat.ChatCompletionMessageParam;
	});
}
