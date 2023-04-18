export interface AddMessagePayload {
	conversationId: string;
	messageId: string;
	role: string;
	handle: string;
	content: string;
}

export interface AppendMessagePayload {
	conversationId: string;
	messageId: string;
	content: string;
}

export type ConversationAction =
	| { type: 'add-conversation', conversationId: string }
	| { type: 'set-conversation-prompt', conversationId: string, prompt?: string }
	| { type: 'set-conversation-error', conversationId: string, error?: string }
	| { type: 'set-conversation-input', conversationId: string, input: string }
	| { type: 'set-conversation-loading', conversationId: string, loading: boolean }
	| { type: 'increment-conversation-unread', conversationId: string }
	| { type: 'clear-conversation-unread', conversationId: string }
	| { type: 'clear-conversations' }
	| { type: 'add-message', payload: AddMessagePayload }
	| { type: 'append-message', payload: AppendMessagePayload };
