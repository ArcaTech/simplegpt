import { MessageImage } from '../../types/chat';

export interface AddMessagePayload {
	conversationId: string;
	messageId: string;
	role: 'user' | 'assistant';
	handle: string;
	content: string | null;
	images: MessageImage[];
}

export interface AppendMessagePayload {
	conversationId: string;
	messageId: string;
	content: string;
}

export type ConversationAction =
	| { type: 'add-conversation', conversationId: string }
	| { type: 'set-conversation-model', conversationId: string, model: string }
	| { type: 'set-conversation-system-message', conversationId: string, content?: string }
	| { type: 'set-conversation-error', conversationId: string, error?: string }
	| { type: 'set-conversation-input', conversationId: string, input: string }
	| { type: 'set-conversation-loading', conversationId: string, loading: boolean }
	| { type: 'add-pending-image', conversationId: string, image: MessageImage }
	| { type: 'remove-pending-image', conversationId: string, url: string }
	| { type: 'clear-pending-images', conversationId: string }
	| { type: 'increment-conversation-unread', conversationId: string }
	| { type: 'clear-conversation-unread', conversationId: string }
	| { type: 'clear-conversations' }
	| { type: 'add-message', payload: AddMessagePayload }
	| { type: 'append-message', payload: AppendMessagePayload };
