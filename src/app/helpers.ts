import { Message, ChatMessage } from '../types';

const VISION_MODELS = [
	'gpt-4-vision-preview',
];

export function trunc(text: string, length: number) {
	if (text.length > length) return text.slice(0, length) + '...';
	return text;
}

export function generateId() {
	return window.crypto.randomUUID();
}

export function isVisionModel(modelId?: string) {
	if (!modelId) return false;
	return VISION_MODELS.includes(modelId);
}

// Converts the Message used here on the frontend, to a ChatMessage
// used on the backend/OpenAI (which just consists of the role, content, and optional images).
export function messagesToChatMessages(messages: Message[]): ChatMessage[] {
	return messages.map(message => {
		return {
			role: message.role,
			content: message.content,
			images: message.images,
		};
	});
}
