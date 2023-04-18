import { Message, ChatMessage } from '../types';

export function trunc(text: string, length: number) {
	if (text.length > length) return text.slice(0, length) + '...';
	return text;
}

export function generateId() {
	return window.crypto.randomUUID();
}

export function messagesToChatMessages(messages: Message[]): ChatMessage[] {
	return messages.map(message => {
		return {
			role: message.role,
			content: message.content,
		};
	});
}
